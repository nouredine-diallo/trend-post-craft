import polars as pl

def analyze_dataframe(df: pl.DataFrame) -> dict:
    """
   genere un dictionnaire  des fichier ingest precedemment et sera utiliser pour que le llm analyse  le dictionnaire 
    """
    profil_complet = {}
    
    #  nombre total de lignes 
    total_lignes = df.height

  
    if total_lignes == 0:
        return {"erreur": "Le fichier est vide."}

    #on veut recup et mettre dans le dict certaine info comme le nom et le type 
    for nom_colonne, type_colonne in df.schema.items():
        
        
        nb_vides = df.get_column(nom_colonne).null_count()
        pourcentage_vide = round((nb_vides / total_lignes) * 100, 2)

        #on rempli le dict colonne avec les info recup 
        profil_colonne = {
            "type": str(type_colonne), 
            "pourcentage_vide": f"{pourcentage_vide}%"
        }

        #  la on va fonctionner par cas numeric pour calculer les max , mini moyenne....
        if type_colonne.is_numeric():
            
            profil_colonne["min"] = df.get_column(nom_colonne).min()
            profil_colonne["max"] = df.get_column(nom_colonne).max()

        # Texte (String)
        elif type_colonne == pl.String:
            
            val_freq = df.get_column(nom_colonne).drop_nulls().value_counts(sort=True).head(3) #top 3 des valeurs les plus frequentes 
            
            # On transforme le résultat en liste Python classique pour le LLM
            valeurs_frequentes = val_freq.get_column(nom_colonne).to_list()
            profil_colonne["valeurs_frequentes"] = valeurs_frequentes

        # Dictionnaire final envoyer au llm c'est un dict de dict ou la clé est le nom de la colonne et la valeur est un dict avec les info de la colonne
        profil_complet[nom_colonne] = profil_colonne

    return profil_complet