import streamlit as st
import requests

# URL de API FASTAPI
API_URL = "http://localhost:8000"

st.set_page_config(page_title="Agent Data Clean", layout="centered")
st.title(" Agent de Nettoyage IA")


# gestion session state pour stocker le id du fichier et pas perdre les donne a chaque clic 

if "file_id" not in st.session_state:
    st.session_state.file_id = None
if "plan" not in st.session_state:
    st.session_state.plan = None

#UPLOAD 
uploaded_file = st.file_uploader("1. Chargez votre fichier (CSV, Excel, JSON, PDF)", type=["csv", "xlsx", "xls", "json", "pdf"])

# Si un fichier est upload et qu'on a pas son id on l'envoie a l'api pour stocker
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


# 3. PANNEAU DE VALIDATION ET ÉDITION du plan généré 

if st.session_state.plan:
    st.write("---")
    st.subheader("3. Validation & Édition du Plan IA")
    
    actions_proposees = st.session_state.plan.get("actions", [])
    actions_validees = []
    
    # Liste des opérations autorisées par notre backend
    operations_dispos = ["drop_empty", "lowercase", "uppercase", "fill_value", "unsupported"]
    
    for i, action in enumerate(actions_proposees):
        raisonnement = action.get('reasoning', 'Pas d\'explication fournie.')
        st.info(f" **Logique IA :** {raisonnement}")
        
        # Création d'une ligne avec 4 colonnes pour éditer l'action proprement
        col1, col2, col3, col4 = st.columns([1, 2, 3, 2])
        
        with col1:
            # L'utilisateur décide s'il garde ou jette cette action
            valider = st.checkbox("Exécuter", value=True, key=f"chk_{i}")
        
        with col2:
            # L'utilisateur peut corriger l'opération si l'IA s'est trompée
            op_index = operations_dispos.index(action['operation']) if action.get('operation') in operations_dispos else 0
            new_op = st.selectbox("Action", operations_dispos, index=op_index, key=f"op_{i}")
        
        with col3:
            # L'utilisateur peut ajouter ou retirer des colonnes (séparées par des virgules)
            cols_str = ", ".join(action.get('columns', []))
            new_cols_str = st.text_input("Colonnes cibles", value=cols_str, key=f"cols_{i}")
        
        with col4:
            # L'utilisateur peut forcer la valeur de remplacement pour éviter les erreurs
            fill_val = action.get("parameters", {}).get("fill_value", "")
            new_fill = st.text_input("Paramètre (ex: val. remp)", value=fill_val, key=f"fill_{i}")

        if valider:
            
            action_modifiee = {
                "reasoning": action.get("reasoning", "Action modifiée ou validée par l'utilisateur."), 
                "operation": new_op,
                "columns": [c.strip() for c in new_cols_str.split(",") if c.strip()],
                "parameters": {"fill_value": new_fill} if new_op == "fill_value" and new_fill else {}
            }
            actions_validees.append(action_modifiee)
            
   
    # 4. EXÉCUTION POLARS
  
    if st.button("Confirmer et Exécuter", type="primary"):
        with st.spinner("Exécution Polars en cours..."):
            # On recrée un objet JSON propre avec uniquement les actions validées et modifiées
            payload = {"actions": actions_validees}
            
            # Appel de la route Phase 1 (Polars Executor)
            response = requests.post(f"{API_URL}/execute/{st.session_state.file_id}", json=payload)
            
            if response.status_code == 200:
                st.success("✅ Nettoyage terminé !")
                st.balloons()
                
                # Récupérer le fichier depuis l'API
                download_response = requests.get(f"{API_URL}/download/{st.session_state.file_id}")
                
                if download_response.status_code == 200:
                    st.download_button(
                        label="⬇Télécharger le fichier propre",
                        data=download_response.content,
                        file_name=f"clean_{uploaded_file.name}",
                        mime="text/csv",
                        type="primary"
                    )
            else:
                st.error(f"Erreur d'exécution : {response.text}")