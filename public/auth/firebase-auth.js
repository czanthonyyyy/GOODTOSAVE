/**
 * Firebase Authentication Service
 * Maneja registro, login y validaciones con Firebase
 */

class FirebaseAuthService {
  constructor() {
    this.auth = null;
    this.db = null;
    this.initialized = false;
    this.initPromise = this.initialize();
  }

  async initialize() {
    try {
      // Esperar a que Firebase esté disponible
      let attempts = 0;
      const maxAttempts = 100; // 10 segundos máximo
      
      while (!window.firebaseServices && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.firebaseServices) {
        console.warn('⚠️ Firebase services not available after initialization timeout');
        return;
      }

      this.auth = window.firebaseServices.auth;
      this.db = window.firebaseServices.db;
      
      if (!this.auth || !this.db) {
        console.warn('⚠️ Firebase Auth or Firestore not properly initialized');
        return;
      }
      
      this.initialized = true;
      console.log('✅ Firebase Auth Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Auth Service:', error);
      this.initialized = false;
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initPromise;
    }
    if (!this.initialized) {
      throw new Error('Firebase Auth Service is not available');
    }
  }

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async signUp(userData) {
    try {
      await this.ensureInitialized();
      
      console.log('📝 Registering user:', userData.email);
      
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
        role: userData.accountType === 'provider' ? 'provider' : 'buyer',
        location: userData.location || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ User registered successfully:', user.uid);
      return user;
      
    } catch (error) {
      console.error('❌ Registration error:', error);
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
      await this.ensureInitialized();
      
      console.log('🔐 Signing in:', email);
      
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      console.log('✅ Session started successfully:', user.uid);
      return user;
      
    } catch (error) {
      console.error('❌ Sign-in error:', error);
      // Lanzar objeto rico para que la UI decida feedback según el código
      const friendly = this.getErrorMessage(error);
      throw { code: error.code || 'unknown', message: friendly };
    }
  }

  /**
   * Cierra la sesión actual
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await this.ensureInitialized();
      await this.auth.signOut();
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Error signing out:', error);
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
      await this.ensureInitialized();
      await this.auth.sendPasswordResetEmail(email);
      console.log('✅ Password recovery email sent');
    } catch (error) {
      console.error('❌ Error sending recovery email:', error);
      throw this.getErrorMessage(error);
    }
  }

  /**
   * Obtiene el usuario actual
   * @returns {Object|null} Usuario actual o null
   */
  getCurrentUser() {
    if (!this.initialized || !this.auth) {
      return null;
    }
    return this.auth.currentUser;
  }

  /**
   * Escucha cambios en el estado de autenticación
   * @param {Function} callback - Función a ejecutar cuando cambie el estado
   * @returns {Function} Función para cancelar la suscripción
   */
  onAuthStateChanged(callback) {
    if (!this.initialized || !this.auth) {
      console.warn('⚠️ Firebase Auth not initialized, cannot set up auth state listener');
      return () => {}; // Return empty unsubscribe function
    }
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
      await this.ensureInitialized();
      await this.db.collection('users').doc(uid).set(userData);
      console.log('✅ User data saved in Firestore');
    } catch (error) {
      console.error('❌ Error saving user data:', error);
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
      await this.ensureInitialized();
      const doc = await this.db.collection('users').doc(uid).get();
      if (doc.exists) {
        return doc.data();
      } else {
        throw new Error('User not found in the database');
      }
    } catch (error) {
      console.error('❌ Error getting user data:', error);
      throw this.getErrorMessage(error);
    }
  }

  /**
   * Guarda un producto nuevo creado por un provider
   * @param {string} uid - ID del proveedor
   * @param {Object} product - { id, name/title, price, description, image, category }
   */
  async createProduct(uid, product) {
    try {
      await this.ensureInitialized();
      
      const data = {
        id: product.id || undefined,
        title: product.title || product.name,
        price: typeof product.price === 'number' ? product.price : parseFloat(product.price || '0') || 0,
        description: product.description || '',
        image: product.image || '',
        category: product.category || 'local',
        providerId: uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const ref = data.id ? this.db.collection('products').doc(data.id) : this.db.collection('products').doc();
      if (!data.id) data.id = ref.id;
      await ref.set(data);
      return data;
    } catch (error) {
      console.error('❌ Error creating product:', error);
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
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/user-token-expired': 'Tu sesión ha expirado. Inicia sesión de nuevo',
      'auth/requires-recent-login': 'Por seguridad, inicia sesión de nuevo',
      'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este email usando otro método de inicio de sesión'
    };

    const errorCode = error.code || 'unknown';
    const message = errorMessages[errorCode] || error.message || 'Error desconocido';
    
    console.log(`Error de Firebase [${errorCode}]: ${message}`);
    return message;
  }
}

// Crear instancia global con inicialización asíncrona
window.firebaseAuthService = new FirebaseAuthService(); 