import firebase_admin
from firebase_admin import credentials, firestore, auth

# Configuración de Firebase
def initialize_firebase():
    """
    Inicializa la conexión con Firebase
    """
    try:
        # Configuración de credenciales
        cred = credentials.Certificate("path/to/serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
        
        # Inicializar Firestore
        db = firestore.client()
        
        return db
    except Exception as e:
        print(f"Error al inicializar Firebase: {e}")
        return None

# Configuración de la base de datos
def get_firestore_client():
    """
    Obtiene el cliente de Firestore
    """
    return firestore.client()

# Configuración de autenticación
def get_auth_client():
    """
    Obtiene el cliente de autenticación
    """
    return auth 