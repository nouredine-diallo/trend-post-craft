import polars as pl
import polars.selectors as cs

def execute_action(df: pl.DataFrame, actions: list[dict]) -> pl.DataFrame:
    # Nettoyage des faux vides
    df = df.with_columns(
        cs.string().str.strip_chars().replace("", None)
    )

    for action in actions:
        operation = action.get("operation")
        
        columns = action.get("columns", [])
        parameters = action.get("parameters", {})

        
        valid_columns = [col for col in columns if col in df.columns]
        if not valid_columns:
            print(f" Avertissement : Aucune colonne valide trouvée pour l'opération {operation}.")
            continue

        if operation == "drop_empty":
            df = df.drop_nulls(subset=valid_columns)
            
        elif operation == "lowercase":
            
            df = df.with_columns([
                pl.col(c).cast(pl.String).str.to_lowercase() for c in valid_columns
            ])
            
        elif operation == "uppercase":
            df = df.with_columns([
                pl.col(c).cast(pl.String).str.to_uppercase() for c in valid_columns
            ])
            
        elif operation == "fill_value":
            replacement_value = parameters.get("fill_value", "Valeur_Manquante")
            df = df.with_columns([
                pl.col(c).fill_null(replacement_value) for c in valid_columns
            ])
            
        else:
            raise ValueError(f"Opération inconnue : {operation}")

    return df