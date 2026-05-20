from pydantic import BaseModel
from typing import Literal

# opérations autorisées
OperationType = Literal[
    "drop_empty",
    "lowercase",
    "uppercase",
    "fill_value",
    "unsupported"
]
#on defini les dictionnaire leur type au cas ou ca correspond pas 

class CleaningAction(BaseModel):

    operation: OperationType
    column: str
    parameters: dict = {}


class CleaningPlan(BaseModel):

    actions: list[CleaningAction]