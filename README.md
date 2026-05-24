#Agent  Data cleaner (LLM + Polars)

Ce projet est une API permettant de nettoyer des fichiers de données (CSV, Excel, etc.) via des instructions en langage naturel.
Architecture : De la V1 (Naïve) à la V2 (Défensive)
Problème de la V1 : L'approche "zéro-shot" (Prompt -> LLM -> Action) est instable (hallucinations de commandes) et non sécurisée (risque d'exécution de code arbitraire).

Solution V2 : Le LLM est rétrogradé au rôle de "routeur sémantique". 

Principes Techniques & Référentiel /

Structured Outputs & Function Calling : Le LLM ne génère jamais de code de manipulation de données. Il se contente de sélectionner des opérations pré-approuvées pour formater un objet JSON prévisible.[https://developers.openai.com/api/docs/guides/function-calling]

Validation Stricte (Pydantic) : Le schéma de données est la seule source de vérité. Toute hallucination ou déviation du LLM est rejetée par Pydantic, déclenchant une boucle de correction automatique (Tenacity).

Chain of Thought (CoT) Intégré : Le JSON exige un champ reasoning en première position. Forcer l'IA à expliciter sa logique avant de définir l'action diminue radicalement les erreurs de routage.

Séparation des Privilèges (OWASP LLM Security) : Le plan de est généré par l'IA (Groq/Llama), mais l'exécution réelle est isolée côté backend (Polars).  [https://owasp.org/www-project-top-10-for-large-language-model-applications/]

## Stack Technique

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| **Orchestration** | FastAPI | Backend HTTP |
| **Moteur de Traitement** | Polars | Transformation de données haute performance |
| **Intelligence Artificielle** | Llama 3.1 8B (Groq) | Routeur sémantique / Planification |
| **Validation & Résilience** | Pydantic + Tenacity | Type-safety & retry logic |
| **Interface Utilisateur** | Streamlit | Frontend utilisateur |
| **Logging & Monitoring** | Python logging | Traçabilité des opérations |

## Architecture du Dossier

```
trend-post-craft/
├── api.py                         # Point d'entrée FastAPI
├── requirements.txt               # Dépendances Python
├── test.csv                       # Fichier de test
│
├── src/                           # Code source principal
│   ├── __init__.py
│   ├── logger.py                  # Configuration du logging
│   │
│   ├── ai/                        
│   │   ├── __init__.py
│   │   ├── llm_planner.py         # Orchestration du LLM + Tenacity
│   │   └── schemas.py             # Schémas Pydantic (Single Source of Truth)
│   │
│   └── data/                      # Module de Traitement des Données
│       ├── __init__.py
│       ├── ingestion.py           # Lecture/chargement des fichiers
│       ├── analyzer.py            # Analyse statistique des données
│       └── executor.py            # Exécution des transformations Polars
│
├── frontend/                      # Interface Streamlit
│   └── app.py                     # Application Streamlit
│
├── data/                          # Répertoire de données
│   ├── uploads/                   # Fichiers uploadés par les utilisateurs
│   └── cleaned/                   # Fichiers nettoyés (résultats)
│
└── logs/                          # Fichiers de log
```

##  Flux de Données & Architecture Système

```
┌─────────────────────────────────────────────────────────────────┐
│                       UTILISATEUR FINAL                          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │   Streamlit UI     │  (frontend/app.py)
        │  - Upload CSV      │
        │  - Instructions    │
        │  - Résultats       │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │    FastAPI        │  (api.py)
        │   - /upload       │
        │   - /clean        │
        │   - /download     │
        └────────┬───────────┘
                 │
         ┌───────┴────────┬──────────────┐
         ▼                ▼              ▼
    ┌─────────┐    ┌──────────┐   ┌──────────┐
    │Ingestion│    │Analyzer  │   │Planner   │
    │(Load)   │    │(Analyse) │   │(LLM)     │
    └────┬────┘    └────┬─────┘   └─────┬────┘
         │              │              │
         │              │         ┌─────┴─────┐
         │              │         ▼           ▼
         │              │    ┌────────┐  ┌────────────┐
         │              │    │ Groq   │  │ Pydantic   │
         │              │    │ API    │  │ Validation │
         │              │    │ Llama  │  └────────────┘
         │              │    │ 3.1 8B │   (Tenacity Retry)
         │              │    └────────┘
         │              │
         └──────────────┼──────────────┐
                        ▼              ▼
                   ┌──────────┐  ┌──────────┐
                   │Executor  │  │  Logger  │
                   │(Polars)  │  │  (Logs)  │
                   └────┬─────┘  └──────────┘
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
    ┌─────────────┐            ┌─────────────┐
    │data/uploads │            │data/cleaned │
    │  (Bruts)    │            │(Nettoyés)   │
    └─────────────┘            └─────────────┘
```

##  Installation et Utilisation en Local

### 1. Installez les dépendances :

```bash
pip install -r requirements.txt
```

### 2. Créez un fichier `.env` à la racine et ajoutez votre clé API Groq :

```plaintext
GROQ_API_KEY=votre_cle_ici
```

### 3. Lancez le Backend (FastAPI) :

```bash
uvicorn api:app --reload
```

Le serveur sera disponible à `http://localhost:8000`

### 4. Lancez le Frontend (Streamlit) dans un nouveau terminal :

```bash
streamlit run frontend/app.py
```

L'interface sera disponible à `http://localhost:8501`

## Flux Typique de Nettoyage

```
1. Utilisateur upload un CSV
        │
        ▼
2. Ingestion → Chargement en Polars DataFrame
        │
        ▼
3. Analyzer → Statistiques & Profil de données
        │
        ▼
4. Utilisateur formule demande en langage naturel
        │
        ▼
5. LLM Planner → Génère plan de nettoyage
        │
        ├─→ Validation Pydantic ✓/✗
        │
        ▼
6. Executor → Applique transformations Polars
        │
        ▼
7. Export → Sauvegarde en data/cleaned/
        │
        ▼
8. Utilisateur télécharge résultat
```


##  Exemple d'Utilisation

```
Utilisateur: "Supprime les colonnes vides et mets tous les noms en majuscules"

LLM Plan:
{
  "operations": [
    {
      "type": "drop_empty_columns",
      "reasoning": "L'utilisateur demande explicitement la suppression des colonnes vides"
    },
    {
      "type": "uppercase",
      "columns": ["name"],
      "reasoning": "L'utilisateur veut les noms en majuscules, je suppose qu'il s'agit de la colonne 'name'"
    }
  ]
}

Executor: ✓ Opérations valides, exécution...
Résultat: Fichier nettoyé dans data/cleaned/
```
