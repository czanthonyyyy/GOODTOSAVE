/**
 * Firebase Utilities
 * Utilidades para manejar la inicialización y configuración de Firebase
 */

class FirebaseUtils {
    constructor() {
        this.initialized = false;
        this.initPromise = null;
    }

    /**
     * Inicializa Firebase de forma robusta
     */
    async initialize() {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = this._doInitialize();
        return this.initPromise;
    }

    async _doInitialize() {
        try {
            // Esperar a que Firebase esté disponible
            await this._waitForFirebaseSDK();
            
            // Verificar que los servicios estén disponibles
            this._verifyServices();
            
            // Marcar como inicializado
            this.initialized = true;
            console.log('✅ Firebase Utils inicializado correctamente');
            
            // Disparar evento de inicialización
            window.dispatchEvent(new CustomEvent('firebaseUtilsReady'));
            
        } catch (error) {
            console.error('❌ Error al inicializar Firebase Utils:', error);
            this.initialized = false;
            throw error;
        }
    }

    /**
     * Espera a que el SDK de Firebase esté disponible
     */
    async _waitForFirebaseSDK() {
        let attempts = 0;
        const maxAttempts = 100; // 10 segundos máximo
        
        while (attempts < maxAttempts) {
            if (typeof firebase !== 'undefined' && 
                typeof firebase.auth !== 'undefined' && 
                typeof firebase.firestore !== 'undefined') {
                return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        throw new Error('Firebase SDK no está disponible después del tiempo de espera');
    }

    /**
     * Verifica que los servicios de Firebase estén correctamente inicializados
     */
    _verifyServices() {
        if (!window.firebaseServices) {
            throw new Error('Firebase services no están disponibles');
        }

        if (!window.firebaseServices.auth) {
            throw new Error('Firebase Auth no está disponible');
        }

        if (!window.firebaseServices.db) {
            throw new Error('Firebase Firestore no está disponible');
        }
    }

    /**
     * Verifica si Firebase está listo para usar
     */
    isReady() {
        return this.initialized && 
               window.firebaseServices && 
               window.firebaseServices.auth && 
               window.firebaseServices.db;
    }

    /**
     * Espera a que Firebase esté listo
     */
    async waitForReady() {
        if (this.isReady()) {
            return true;
        }

        return new Promise((resolve, reject) => {
            const checkReady = () => {
                if (this.isReady()) {
                    resolve(true);
                } else {
                    setTimeout(checkReady, 100);
                }
            };
            checkReady();
        });
    }

    /**
     * Obtiene el servicio de autenticación
     */
    getAuth() {
        if (!this.isReady()) {
            throw new Error('Firebase no está listo');
        }
        return window.firebaseServices.auth;
    }

    /**
     * Obtiene el servicio de Firestore
     */
    getFirestore() {
        if (!this.isReady()) {
            throw new Error('Firebase no está listo');
        }
        return window.firebaseServices.db;
    }

    /**
     * Maneja errores de Firebase de forma consistente
     */
    handleError(error, context = '') {
        console.error(`❌ Error en Firebase ${context}:`, error);
        
        const errorMessages = {
            'auth/user-not-found': 'No existe una cuenta con este email',
            'auth/wrong-password': 'Contraseña incorrecta',
            'auth/email-already-in-use': 'Ya existe una cuenta con este email',
            'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
            'auth/invalid-email': 'Email inválido',
            'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
            'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
            'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
            'auth/operation-not-allowed': 'Esta operación no está permitida',
            'auth/invalid-credential': 'Credenciales inválidas',
            'permission-denied': 'No tienes permisos para realizar esta acción',
            'unavailable': 'Servicio no disponible temporalmente'
        };

        const errorCode = error.code || 'unknown';
        const message = errorMessages[errorCode] || error.message || 'Error desconocido';
        
        return {
            code: errorCode,
            message: message,
            original: error
        };
    }
}

// Crear instancia global
window.FirebaseUtils = new FirebaseUtils();

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para que Firebase se inicialice primero
    setTimeout(() => {
        window.FirebaseUtils.initialize().catch(error => {
            console.warn('⚠️ Error al inicializar Firebase Utils:', error);
        });
    }, 500);
});
