/**
 * Firebase Authentication Service
 * Maneja registro, login y validaciones con Firebase
 */

class FirebaseAuthService {
  constructor() {
    this.auth = window.firebaseServices?.auth;
    this.db = window.firebaseServices?.db;
    
    if (!this.auth) {
      console.error('❌ Firebase Auth is not available');
      return;
    }
    
    console.log('✅ Firebase Auth Service initialized');
  }

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async signUp(userData) {
    try {
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
        role: userData.accountType === 'seller' ? 'provider' : (userData.accountType || 'buyer'),
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

  /**
   * Guarda un producto nuevo creado por un provider
   * @param {string} uid - ID del proveedor
   * @param {Object} product - { id, name/title, price, description, image, category }
   */
  async createProduct(uid, product) {
    try {
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
      'auth/user-not-found': 'No account exists with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'An account with this email already exists',
      'auth/weak-password': 'Password must be at least 6 characters',
      'auth/invalid-email': 'Invalid email',
      'auth/too-many-requests': 'Too many failed attempts. Try again later',
      'auth/network-request-failed': 'Connection error. Check your internet',
      'auth/user-disabled': 'This account has been disabled',
      'auth/operation-not-allowed': 'This operation is not allowed',
      'auth/invalid-credential': 'Invalid credentials'
    };

    const errorCode = error.code || 'unknown';
    return errorMessages[errorCode] || error.message || 'Unknown error';
  }
}

// Crear instancia global
window.firebaseAuthService = new FirebaseAuthService(); 