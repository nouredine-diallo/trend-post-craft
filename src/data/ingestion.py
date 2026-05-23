import os

import polars as pl
import pdfplumber


def read_flat_file(path: str) -> pl.DataFrame:
    """Lit un fichier CSV, Excel ou JSON et retourne un DataFrame Polars."""
    extension = os.path.splitext(path)[1].lower()

    try:
        if extension == ".csv":
            return pl.read_csv(path, ignore_errors=True, infer_schema_length=10000)
        elif extension in [".xlsx", ".xls"]:
            return pl.read_excel(path)
        elif extension == ".json":
            return pl.read_json(path)
        else:
            raise ValueError(f"Format de fichier non géré par read_flat_file : {extension}")
    except Exception as e:
        raise RuntimeError(f"Erreur lors de la lecture du fichier plat {path} : {str(e)}")


def read_pdf_file(path: str) -> pl.DataFrame:
    """Lit un fichier PDF et extrait le premier tableau détecté."""
    try:
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                table = page.extract_table()
                if table:
                    cleaned_table = [
                        [str(cell).replace("\n", " ") if cell is not None else "" for cell in row]
                        for row in table
                    ]
                    headers = cleaned_table[0]
                    rows = cleaned_table[1:]
                    return pl.DataFrame(rows, schema=headers, orient="row")

        raise ValueError("Aucun tableau n'a été détecté dans ce PDF.")
    except Exception as e:
        raise RuntimeError(f"Erreur lors de l'extraction du PDF {path} : {str(e)}")


def ingest_file(path: str) -> pl.DataFrame:
    """Route l'ingestion vers la bonne fonction selon l'extension du fichier."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"Le fichier {path} est introuvable.")

    extension = os.path.splitext(path)[1].lower()
    if extension == ".pdf":
        return read_pdf_file(path)
    elif extension in [".csv", ".xlsx", ".xls", ".json"]:
        return read_flat_file(path)
    else:
        raise ValueError(f"Extension {extension} non supportée par le système d'ingestion.")
