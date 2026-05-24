import json
import os
import requests
from typing import get_args
from pydantic import ValidationError
from tenacity import retry, stop_after_attempt, wait_exponential


from .schemas import CleaningPlan, OperationType

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL_NAME = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")


ALLOWED_OPERATIONS = ", ".join(get_args(OperationType))

SYSTEM_PROMPT = f"""
Tu es un Data Engineer senior responsable du nettoyage de données.

Ta mission :
Traduire l'intention de l'utilisateur en un plan d'actions JSON strictement valide.

RÈGLES DE SÉCURITÉ STRICTES :
1. Tu ne peux utiliser QUE les opérations suivantes : {ALLOWED_OPERATIONS}
2. Si la demande concerne une notion générale (ex: "les prénoms", "les dates"), tu DOIS inclure TOUTES les colonnes du profil qui correspondent à cette notion dans la liste "columns".
3. Réponds UNIQUEMENT avec du JSON brut, sans aucun texte.

Format JSON exigé :
{{
  "actions": [
    {{
      "reasoning": "La demande cible les prénoms, j'applique l'opération aux deux colonnes trouvées.",
      "operation": "lowercase",
      "columns": ["prenom", "prenomsDuDeclarant1"],
      "parameters": {{}}
    }}
  ]
}}
"""

def build_prompt(profile: dict, user_request: str) -> str:
    """Construit le prompt final en injectant le profil et la demande."""
    return f"""
{SYSTEM_PROMPT}

Profil du dataframe :
{json.dumps(profile, indent=2)}

Demande de l'utilisateur :
"{user_request}"
"""

def call_llm(prompt: str) -> str:
    """
    Appelle l'API Groq en forçant le format de sortie en JSON pur.
    """
    if not GROQ_API_KEY:
        raise ValueError("Erreur : La variable d'environnement GROQ_API_KEY est manquante.")

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"}, 
        "temperature": 0 #pour eviter la creativité et hallucination 
    }

    response = requests.post(url, headers=headers, json=payload, timeout=60)
    response.raise_for_status()
    
    data = response.json()
    return data["choices"][0]["message"]["content"].strip()


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=8),
    reraise=True
)
def generate_plan(profile: dict, user_request: str) -> CleaningPlan:
    """
    Orchestre la création du prompt, l'appel au LLM et la validation Pydantic.
    Relance automatiquement .
    """
    prompt = build_prompt(profile=profile, user_request=user_request)
    raw_response = call_llm(prompt)

    try:
        data = json.loads(raw_response)
        # Pydantic valide strictement que le JSON correspond au schéma défini
        plan = CleaningPlan.model_validate(data)
        return plan
    except (json.JSONDecodeError, ValidationError) as e:
        print(f"Erreur validation LLM : {e}")
        raise ValueError("Le LLM a produit un JSON invalide ou une action non autorisée.")