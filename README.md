# Data Cleaner 

nettoie des fichiers **CSV/Excel** à partir d’instructions (ex: “supprime les colonnes vides”, “mets les noms en majuscules”).

 **le modèle ne touche jamais aux données**. Il choisit uniquement des opérations autorisées (format JSON), puis **Polars exécute** côté backend. Si le plan n’est pas conforme, il est rejeté et régénéré.

## Stack

* **FastAPI** : API HTTP
* **Polars** : transformations
* **Pydantic + Tenacity** : validation + retry
* **Streamlit** : interface simple
* **Llama 3.1 (Groq)** : génère le plan d’actions

## Structure rapide

* `api.py` : endpoints
* `src/ai/` : génération + schémas
* `src/data/` : ingestion / analyse / exécution
* `frontend/app.py` : UI Streamlit
* `data/uploads` → `data/cleaned` : fichiers

## Lancer en local

```bash
pip install -r requirements.txt
```

Créer `.env` :

```bash
GROQ_API_KEY=...
```

Backend :

```bash
uvicorn api:app --reload
```

Frontend :

```bash
streamlit run frontend/app.py
```

## Exemple

Demande : “Supprime les colonnes vides et mets les noms en majuscules”
→ le modèle renvoie une liste d’opérations (JSON)
→ Polars applique et exporte dans `data/cleaned/`.

