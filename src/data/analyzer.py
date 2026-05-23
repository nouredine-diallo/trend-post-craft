import polars as pl


def analyze_dataframe(df: pl.DataFrame) -> dict:
    """Génère un profil simple d'un DataFrame pour l'analyse métier."""
    profil_complet = {}
    total_lignes = df.height

    if total_lignes == 0:
        return {"erreur": "Le fichier est vide."}

    for nom_colonne, type_colonne in df.schema.items():
        nb_vides = df.get_column(nom_colonne).null_count()
        pourcentage_vide = round((nb_vides / total_lignes) * 100, 2)

        profil_colonne = {
            "type": str(type_colonne),
            "pourcentage_vide": f"{pourcentage_vide}%"
        }

        if type_colonne.is_numeric():
            profil_colonne["min"] = df.get_column(nom_colonne).min()
            profil_colonne["max"] = df.get_column(nom_colonne).max()
        elif type_colonne == pl.String:
            val_freq = df.get_column(nom_colonne).drop_nulls().value_counts(sort=True).head(3)
            valeurs_frequentes = val_freq.get_column(nom_colonne).to_list()
            profil_colonne["valeurs_frequentes"] = valeurs_frequentes

        profil_complet[nom_colonne] = profil_colonne

    return profil_complet
