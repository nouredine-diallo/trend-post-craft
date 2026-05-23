from pydantic import BaseModel
from typing import Literal

OperationType = Literal[
    "drop_empty",
    "lowercase",
    "uppercase",
    "fill_value",
    "unsupported"
]


class CleaningAction(BaseModel):
    operation: OperationType
    column: str
    parameters: dict = {}


class CleaningPlan(BaseModel):
    actions: list[CleaningAction]
