/**
 * Firebase Authentication Service
 * Maneja registro, login y validaciones con Firebase
 */

class FirebaseAuthService {
  constructor() {
    this.auth = window.firebaseServices?.auth;
    this.db = window.firebaseServices?.db;
    
    if (!this.auth) {
      console.error('❌ Firebase Auth no está disponible');
      return;
    }
    
    console.log('✅ Firebase Auth Service inicializado');
  }

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async signUp(userData) {
    try {
      console.log('📝 Registrando usuario:', userData.email);
      
      // Crear usuario en Firebase Auth
      const userCredential = await this.auth.createUserWithEmailAndPassword(
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;
      
      // Actualizar perfil del usuario
      await user.updateProfile({
        displayName: `${userData.firstName} ${userData.lastName}`
      });
      
      // Guardar datos adicionales en Firestore
      await this.saveUserData(user.uid, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || '',
        accountType: userData.accountType,
        location: userData.location || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Usuario registrado exitosamente:', user.uid);
      return user;
      
    } catch (error) {
      console.error('❌ Error en registro:', error);
      throw this.getErrorMessage(error);
    }
  }

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Usuario autenticado
   */
  async signIn(email, password) {
    try {
      console.log('🔐 Iniciando sesión:', email);
      
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      console.log('✅ Sesión iniciada exitosamente:', user.uid);
      return user;
      
    } catch (error) {
      console.error('❌ Error en inicio de sesión:', error);
      throw this.getErrorMessage(error);
    }
  }

  /**
   * Cierra la sesión actual
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await this.auth.signOut();
      console.log('✅ Sesión cerrada exitosamente');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      throw this.getErrorMessage(error);
    }
  }

  /**
   * Envía email de recuperación de contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<void>}
   */
  async sendPasswordResetEmail(email) {
    try {
      await this.auth.sendPasswordResetEmail(email);
      console.log('✅ Email de recuperación enviado');
    } catch (error) {
      console.error('❌ Error al enviar email de recuperación:', error);
      throw this.getErrorMessage(error);
    }
  }

  /**
   * Obtiene el usuario actual
   * @returns {Object|null} Usuario actual o null
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }

  /**
   * Escucha cambios en el estado de autenticación
   * @param {Function} callback - Función a ejecutar cuando cambie el estado
   * @returns {Function} Función para cancelar la suscripción
   */
  onAuthStateChanged(callback) {
    return this.auth.onAuthStateChanged(callback);
  }

  /**
   * Guarda datos adicionales del usuario en Firestore
   * @param {string} uid - ID del usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<void>}
   */
  async saveUserData(uid, userData) {
    try {
      await this.db.collection('users').doc(uid).set(userData);
      console.log('✅ Datos de usuario guardados en Firestore');
    } catch (error) {
      console.error('❌ Error al guardar datos de usuario:', error);
      throw this.getErrorMessage(error);
    }
  }

  /**
   * Obtiene datos adicionales del usuario desde Firestore
   * @param {string} uid - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  async getUserData(uid) {
    try {
      const doc = await this.db.collection('users').doc(uid).get();
      if (doc.exists) {
        return doc.data();
      } else {
        throw new Error('Usuario no encontrado en la base de datos');
      }
    } catch (error) {
      console.error('❌ Error al obtener datos de usuario:', error);
      throw this.getErrorMessage(error);
    }
  }

  /**
   * Convierte errores de Firebase a mensajes legibles
   * @param {Object} error - Error de Firebase
   * @returns {string} Mensaje de error legible
   */
  getErrorMessage(error) {
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
      'auth/invalid-credential': 'Credenciales inválidas'
    };

    const errorCode = error.code || 'unknown';
    return errorMessages[errorCode] || error.message || 'Error desconocido';
  }
}

// Crear instancia global
window.firebaseAuthService = new FirebaseAuthService(); 