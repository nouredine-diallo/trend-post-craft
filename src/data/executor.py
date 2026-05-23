import polars as pl


def execute_action(df: pl.DataFrame, actions: list[dict]) -> pl.DataFrame:
    """
    Prend un DataFrame et une liste d'actions JSON.
    Exécute chaque transformation sur le DataFrame puis retourne le DataFrame modifié.
    """

    for action in actions:
        operation = action.get("operation")
        column = action.get("column")
        parameters = action.get("parameters", {})

        try:
            if operation == "drop_empty":
                df = df.drop_nulls(subset=[column])
            elif operation == "lowercase":
                df = df.with_columns(pl.col(column).str.to_lowercase())
            elif operation == "uppercase":
                df = df.with_columns(pl.col(column).str.to_uppercase())
            elif operation == "fill_value":
                replacement_value = parameters.get("fill_value", "Valeur_Manquante")
                df = df.with_columns(pl.col(column).fill_null(replacement_value))
            else:
                print(f"Opération inconnue : {operation}")
        except Exception as e:
            print(f"Erreur sur l'opération '{operation}' pour la colonne '{column}' : {e}")

    return df
