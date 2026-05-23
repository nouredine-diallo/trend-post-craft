import os

from loguru import logger

LOG_PATH = os.getenv("LOG_PATH", "logs/app.log")
log_dir = os.path.dirname(LOG_PATH)
if log_dir:
    os.makedirs(log_dir, exist_ok=True)

logger.add(
    LOG_PATH,
    rotation="10 MB",
    retention="10 days",
    compression="zip",
    level="INFO"
)
