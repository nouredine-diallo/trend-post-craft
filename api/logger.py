from loguru import logger
import os

# VERIFI QUE LE DOSSIER LOGS EXISTE  
os.makedirs("logs", exist_ok=True)


# on ecrit  dans logs/app.log
# -on cree  un nouveau fichier si ça dépasse 10 Mo 
# Garde uniquement les logs des 7 derniers jours 
logger.add("logs/app.log", rotation="10 MB", retention="7 days", format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}")

def log_action(file_id: str, operation: str, duration: float, success: bool = True):
    """
    Fonction simple à appeler depuis FastAPI.
    """
    status = "SUCCESS" if success else "FAILED"
    message = f"ID: {file_id} | Op: {operation} | Latence: {duration:.2f}s | Status: {status}"
    
    if success:
        logger.info(message)
    else:
        logger.error(message)