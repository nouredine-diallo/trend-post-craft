import streamlit as st
import requests

# URL de API FASTAPI
API_URL = "http://localhost:8000"

st.set_page_config(page_title="Agent Data Clean", layout="centered")
st.title("🧹 Agent de Nettoyage IA")


# gestion session state pour stocker le id du fichier et pas perdre les donne a chaque clic 

if "file_id" not in st.session_state:
    st.session_state.file_id = None
if "plan" not in st.session_state:
    st.session_state.plan = None

#UPLOAD 
uploaded_file = st.file_uploader("1. Chargez votre fichier (CSV, Excel, JSON, PDF)", type=["csv", "xlsx", "xls", "json", "pdf"])

# Siun fichier est upload et qu'on a pas son id on l'envoie a l'api pour stocker
if uploaded_file and not st.session_state.file_id:
    with st.spinner("Ingestion et Profilage en cours..."):
        # On prépare le fichier pour l'envoi HTTP
        files = {"file": (uploaded_file.name, uploaded_file.getvalue())}
        response = requests.post(f"{API_URL}/upload", files=files)
        
        if response.status_code == 200:
            # On stocke l'ID renvoyé par l'API dans la session
            st.session_state.file_id = response.json()["file_id"]
            st.success("Fichier profilé avec succès !")
        else:
            st.error(f"Erreur d'upload : {response.text}")



if st.session_state.file_id:
    st.write("---")
    user_prompt = st.text_input("2. Que souhaitez-vous nettoyer ?", placeholder="Ex: Mets les emails en minuscules et supprime les âges vides")
    
    if st.button("Générer le plan de nettoyage") and user_prompt:
        with st.spinner("Le LLM rédige le plan..."):
            
            response = requests.post(f"{API_URL}/generate_plan/{st.session_state.file_id}?user_prompt={user_prompt}")
            
            if response.status_code == 200:
                st.session_state.plan = response.json()
            else:
                st.error("Erreur de génération du plan.")


# 3. PANNEAU DE VALIDATION du plan generer

if st.session_state.plan:
    st.write("---")
    st.subheader("3. Validation du Plan IA")
    
    actions_proposees = st.session_state.plan.get("actions", [])
    actions_validees = []
    
    # On boucle sur le JSON généré par l'IA
    for i, action in enumerate(actions_proposees):
        
        label = f"**{action['operation']}** sur la colonne `{action['column']}`"
        
        
        if st.checkbox(label, value=True, key=f"chk_{i}"):
            # Si la case reste cochée, on garde l'action
            actions_validees.append(action)
            
   
    # 4. EXÉCUTION POLARS
  
    if st.button("Confirmer et Exécuter", type="primary"):
        with st.spinner("Exécution Polars en cours..."):
            # On recrée un objet JSON propre avec uniquement les actions validées
            payload = {"actions": actions_validees}
            
            # Appel de la route Phase 1 (Polars Executor)
            response = requests.post(f"{API_URL}/execute/{st.session_state.file_id}", json=payload)
            
            if response.status_code == 200:
                st.success("✅ Nettoyage terminé ! Le fichier propre est sauvegardé sur le serveur.")
                st.balloons()
            else:
                st.error(f"Erreur d'exécution : {response.text}")