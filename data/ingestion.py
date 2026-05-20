import os
import polars as pl
import pdfplumber

def read_file(chemin : str) -> pl.DataFrame : 
    """
    Lit un fichier csv et retourne sous data le contenu des fichiers 
    """
    ex =os.path.splitext(chemin)[1].lower() 
    if ex ==" .csv" :
        return pl.read_csv(chemin, ignore_errors=True, infer_schema_length=10000) #afin de deviner les type sur les colonns ( int float ..) et true permet de ne pas crasher 
            
        elif ex  in ['.xlsx', '.xls']:
            return pl.read_excel(chemin)
            
        elif ex == '.json':
            return pl.read_json(chemin)
            
        else:
            raise ValueError(f"Format de fichier non géré par read_flat_file : {ex}")
            
    except Exception as e:
        raise RuntimeError(f"Erreur lors de la lecture du fichier plat {chemin} : {str(e)}")


def read_pdf_file(chemin : str)->pl.DataFrame :
    """
    Lit un fichier pdf et retourne sous data le contenu des fichiers  , comme c'est pas un fichier plat on va analyser le premier tableau et le conv en dataframe 
    """
     try : 
        with pdfplumber.open(chemin) as pdf :
            for page in pdf.pages:
                tableau_brut = page.extract_table()
                
                # 3. Si on trouve un tableau sur la page
                if tableau_brut:
                   #on remplace None par "" et on suprime les saut de ligne sdans les cellules 
                    tableau_nettoye = [
                        [str(cellule).replace('\n', ' ') if cellule is not None else "" for cellule in ligne]
                        for ligne in tableau_brut
                    ]
                    
                    # 4. On sépare les en-têtes (la première ligne) des données (le reste)
                    en_tetes = tableau_nettoye[0]
                    donnees = tableau_nettoye[1:]
                    
                    # 5. On crée et on retourne le DataFrame Polars
                    return pl.DataFrame(donnees, schema=en_tetes, orient="row")
            
            # Si la boucle se termine sans avoir retourné de tableau :
            raise ValueError("Aucun tableau n'a été détecté dans ce PDF.")
            
    except Exception as e:
        raise RuntimeError(f"Erreur lors de l'extraction du PDF {chemin} : {str(e)}")

def ingest_file(chemin: str) -> pl.DataFrame:
    """
  decide quelle fonction appeler pour la lecture du fichier en fonction de son extension   
    """
    if not os.path.exists(chemin):
        raise FileNotFoundError(f"Le fichier {chemin} est introuvable.")
        
    extension = os.path.splitext(chemin)[1].lower()
    
    if extension == '.pdf':
        return read_pdf_table(chemin)
    elif extension in ['.csv', '.xlsx', '.xls', '.json']:
        return read_flat_file(chemin)
    else:
        raise ValueError(f"Extension {extension} non supportée par le système d'ingestion.") 