// Firebase Service para el Frontend
class FirebaseService {
  constructor() {
    // Esperar a que Firebase esté disponible
    if (window.firebaseServices) {
      this.auth = window.firebaseServices.auth;
      this.db = window.firebaseServices.db;
      this.storage = window.firebaseServices.storage;
    } else {
      console.error('Firebase services not available');
    }
  }

  // ===== AUTENTICACIÓN =====
  async signUp(userData) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(
        userData.email, 
        userData.password
      );
      
      // Actualizar perfil del usuario
      await userCredential.user.updateProfile({
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Crear documento de usuario en Firestore
      await this.db.collection('users').doc(userCredential.user.uid).set({
        uid: userCredential.user.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || null,
        accountType: userData.accountType,
        location: userData.location || null,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });

      return userCredential.user;
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async signIn(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async signOut() {
    try {
      await this.auth.signOut();
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  async getCurrentUser() {
    return this.auth.currentUser;
  }

  async sendPasswordResetEmail(email) {
    try {
      await this.auth.sendPasswordResetEmail(email);
    } catch (error) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  // ===== USUARIOS =====
  async getUserProfile(uid) {
    try {
      const doc = await this.db.collection('users').doc(uid).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error(`Error getting user profile: ${error.message}`);
    }
  }

  async updateUserProfile(uid, updateData) {
    try {
      await this.db.collection('users').doc(uid).update({
        ...updateData,
        updatedAt: new Date()
      });
      return { id: uid, ...updateData };
    } catch (error) {
      throw new Error(`Error updating user profile: ${error.message}`);
    }
  }

  // ===== PRODUCTOS =====
  async createProduct(productData) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const docRef = await this.db.collection('products').add({
        ...productData,
        sellerId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: 'available'
      });

      return { id: docRef.id, ...productData };
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  async getProducts(filters = {}) {
    try {
      let query = this.db.collection('products').where('isActive', '==', true);
      
      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }
      if (filters.sellerId) {
        query = query.where('sellerId', '==', filters.sellerId);
      }
      if (filters.minPrice) {
        query = query.where('price', '>=', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.where('price', '<=', filters.maxPrice);
      }

      const snapshot = await query.orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`);
    }
  }

  async getProductById(productId) {
    try {
      const doc = await this.db.collection('products').doc(productId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      throw new Error(`Error getting product: ${error.message}`);
    }
  }

  async updateProduct(productId, updateData) {
    try {
      await this.db.collection('products').doc(productId).update({
        ...updateData,
        updatedAt: new Date()
      });
      return { id: productId, ...updateData };
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  async deleteProduct(productId) {
    try {
      await this.db.collection('products').doc(productId).delete();
      return { success: true };
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  // ===== ÓRDENES =====
  async createOrder(orderData) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const docRef = await this.db.collection('orders').add({
        ...orderData,
        buyerId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending'
      });

      return { id: docRef.id, ...orderData };
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  async getOrdersByUser(userType = 'buyer') {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const field = userType === 'buyer' ? 'buyerId' : 'sellerId';
      const snapshot = await this.db.collection('orders')
        .where(field, '==', user.uid)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Error getting orders: ${error.message}`);
    }
  }

  async getOrderById(orderId) {
    try {
      const doc = await this.db.collection('orders').doc(orderId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        throw new Error('Order not found');
      }
    } catch (error) {
      throw new Error(`Error getting order: ${error.message}`);
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      await this.db.collection('orders').doc(orderId).update({
        status,
        updatedAt: new Date()
      });
      return { id: orderId, status };
    } catch (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }
  }

  // ===== CATEGORÍAS =====
  async getCategories() {
    try {
      const snapshot = await this.db.collection('categories')
        .where('isActive', '==', true)
        .orderBy('name')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Error getting categories: ${error.message}`);
    }
  }

  // ===== REVIEWS =====
  async createReview(reviewData) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const docRef = await this.db.collection('reviews').add({
        ...reviewData,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return { id: docRef.id, ...reviewData };
    } catch (error) {
      throw new Error(`Error creating review: ${error.message}`);
    }
  }

  async getReviewsByProduct(productId) {
    try {
      const snapshot = await this.db.collection('reviews')
        .where('productId', '==', productId)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Error getting reviews: ${error.message}`);
    }
  }

  // ===== STORAGE =====
  async uploadImage(file, path) {
    try {
      const storageRef = this.storage.ref();
      const fileRef = storageRef.child(path);
      const snapshot = await fileRef.put(file);
      const downloadURL = await snapshot.ref.getDownloadURL();
      return downloadURL;
    } catch (error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }
  }

  async deleteImage(path) {
    try {
      const storageRef = this.storage.ref();
      const fileRef = storageRef.child(path);
      await fileRef.delete();
      return { success: true };
    } catch (error) {
      throw new Error(`Error deleting image: ${error.message}`);
    }
  }

  // ===== UTILIDADES =====
  getErrorMessage(error) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'El email ya está en uso';
      case 'auth/weak-password':
        return 'La contraseña es muy débil';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde';
      default:
        return error.message || 'Error desconocido';
    }
  }

  // ===== LISTENERS =====
  onAuthStateChanged(callback) {
    return this.auth.onAuthStateChanged(callback);
  }

  onSnapshot(collection, callback) {
    return this.db.collection(collection).onSnapshot(callback);
  }
}

// Crear instancia global
window.firebaseService = new FirebaseService(); 