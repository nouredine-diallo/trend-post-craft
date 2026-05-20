import json
import os

import requests

from pydantic import ValidationError
from tenacity import retry, stop_after_attempt, wait_exponential

from .schemas import CleaningPlan




OLLAMA_URL = os.getenv(
    "OLLAMA_URL",
    "http://localhost:11434/api/generate"
)

MODEL_NAME = os.getenv(
    "OLLAMA_MODEL",
    "llama3.1"
)




SYSTEM_PROMPT = """
Tu es un expert du nettoyage de données.

Ta mission :
Transformer la demande utilisateur en plan JSON strictement valide.

IMPORTANT :
- Réponds UNIQUEMENT avec du JSON brut
- Aucun texte avant ou après
- Aucun markdown
- Ne jamais utiliser ```json

Opérations AUTORISÉES :
- drop_empty
- lowercase
- uppercase
- fill_value
- unsupported

Format JSON attendu :

{
  "actions": [
    {
      "operation": "drop_empty",
      "column": "Age",
      "parameters": {}
    }
  ]
}

Règles :
- Utilise uniquement les colonnes présentes dans le profil
- Si la demande est impossible :
  utilise "unsupported"
- "parameters" doit toujours exister
"""




def build_prompt(
    profile: dict,
    user_request: str
) -> str:

    return f"""
{SYSTEM_PROMPT}

Profil du dataframe :
{json.dumps(profile, indent=2)}

Demande utilisateur :
"{user_request}"
"""




def call_ollama(prompt: str) -> str:

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "format": "json",
        "stream": False
    }

    response = requests.post(
        OLLAMA_URL,
        json=payload,
        timeout=60
    )

    response.raise_for_status()

    data = response.json()

    return data.get("response", "").strip()




@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=8),
    reraise=True
)
def generate_plan(
    profile: dict,
    user_request: str
) -> CleaningPlan:

    # 1. Construire le prompt
    prompt = build_prompt(
        profile=profile,
        user_request=user_request
    )

    # 2. Appeler le LLM
    raw_response = call_ollama(prompt)

    try:

        # 3. Convertir le JSON texte -> dict Python
        data = json.loads(raw_response)

        # 4. Validation Pydantic
        plan = CleaningPlan.model_validate(data)

        # 5. Retour du plan validé
        return plan

    except (
        json.JSONDecodeError,
        ValidationError
    ) as e:

        print(f"Erreur validation LLM : {e}")

        # Tenacity relance automatiquement
        raise ValueError(
            "Le LLM a produit un JSON invalide."
        )