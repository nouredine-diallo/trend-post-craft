from pydantic import BaseModel, Field
from typing import Literal

OperationType = Literal[
    "drop_empty",
    "lowercase",
    "uppercase",
    "fill_value",
    "unsupported"
]

class CleaningAction(BaseModel):
    reasoning: str = Field(description="Explication courte du choix de l'opération.")
    operation: OperationType
    # list de colonne pour effectuer sur plusieurs colone si besoin 
    columns: list[str] = Field(default_factory=list, description="Liste des colonnes ciblées. Peut en contenir plusieurs si pertinent.")
    parameters: dict = {}

class CleaningPlan(BaseModel):
    actions: list[CleaningAction]