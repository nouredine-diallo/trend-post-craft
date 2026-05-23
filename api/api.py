import os
import uuid
import time
from fastapi import FastAPI, UploadFile, File, HTTPException
from dotenv import load_dotenv


from src.data.ingestion import ingest_file
from src.data.analyzer import analyze_dataframe
from src.data.executor import execute_cleaning_plan
from src.ai.llm_planner import generate_plan
from src.ai.schemas import CleaningPlan
from src.logger import log_action

# Charger les .env 
load_dotenv()


os.makedirs("data/uploads", exist_ok=True)
os.makedirs("data/cleaned", exist_ok=True)

app = FastAPI(
    title="Agent Data Clean",
    description="API  de nettoyage de données assisté par LLM",
    version="1.0.0"
)


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Reçoit un fichier, le stocke, et renvoie un ID unique."""
    try:
        file_id = str(uuid.uuid4())
        file_path = f"data/uploads/{file_id}_{file.filename}"
        
        # Sauvegarde physique 
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
            
        return {"file_id": file_id, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur d'upload : {str(e)}")


@app.post("/generate_plan/{file_id}")
async def plan_cleaning(file_id: str, user_prompt: str):
    """Analyse le fichier et demande au LLM un plan de nettoyage."""
    start_time = time.time()
    try:
        #  Retrouver le fichier
        fichier_cible = next((f for f in os.listdir("data/uploads") if f.startswith(file_id)), None)
        if not fichier_cible:
            raise HTTPException(status_code=404, detail="Fichier introuvable.")
            
        file_path = f"data/uploads/{fichier_cible}"
        
        # Ingestion et Analyse
        df = ingest_file(file_path)
        profile = analyze_dataframe(df)
        
        # Génération du plan par l'IA
        plan_json = generate_plan(profile, user_prompt)
        
        log_action(file_id, "Génération Plan ", time.time() - start_time, success=True)
        return plan_json
        
    except Exception as e:
        log_action(file_id, "Génération Plan ", time.time() - start_time, success=False)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/execute/{file_id}")
async def execute_cleaning(file_id: str, plan: CleaningPlan):
    """
    executer les commande de nettoyage du fichier et le sauvegarder dans data/cleaned.
    """
    start_time = time.time()
    try:
        fichier_cible = next((f for f in os.listdir("data/uploads") if f.startswith(file_id)), None)
        file_path = f"data/uploads/{fichier_cible}"
        
        # Recharger le fichier d'origine  
        df = ingest_file(file_path)
        
        # excution des commande polars 
        # conversion de plan.actions en list dict 
        actions_dict = [action.model_dump() for action in plan.actions]
        df_cleaned = execute_cleaning_plan(df, actions_dict)
        
        # Sauvegarder le résultat propre
        output_path = f"data/cleaned/cleaned_{fichier_cible}"
        df_cleaned.write_csv(output_path)
        
        log_action(file_id, "Exécution Polars", time.time() - start_time, success=True)
        return {"message": "Succès", "download_url": output_path}
        
    except Exception as e:
        log_action(file_id, "Exécution Polars", time.time() - start_time, success=False)
        raise HTTPException(status_code=500, detail=str(e))