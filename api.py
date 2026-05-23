from fastapi import FastAPI

from src.logger import logger

app = FastAPI(title="Trend Post Craft API")


@app.get("/")
async def read_root():
    logger.info("Health check requested")
    return {"status": "ok"}
