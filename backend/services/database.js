const { db } = require('../config/firebase-admin');

class DatabaseService {
  constructor() {
    this.db = db;
  }

  // ===== USUARIOS =====
  async createUser(userData) {
    try {
      const userRef = await this.db.collection('users').add({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });
      return { id: userRef.id, ...userData };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getUserById(userId) {
    try {
      const userDoc = await this.db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      throw new Error(`Error getting user: ${error.message}`);
    }
  }

  async updateUser(userId, updateData) {
    try {
      await this.db.collection('users').doc(userId).update({
        ...updateData,
        updatedAt: new Date()
      });
      return { id: userId, ...updateData };
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async deleteUser(userId) {
    try {
      await this.db.collection('users').doc(userId).delete();
      return { success: true };
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // ===== PRODUCTOS =====
  async createProduct(productData) {
    try {
      const productRef = await this.db.collection('products').add({
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: 'available'
      });
      return { id: productRef.id, ...productData };
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  async getProductById(productId) {
    try {
      const productDoc = await this.db.collection('products').doc(productId).get();
      if (!productDoc.exists) {
        throw new Error('Product not found');
      }
      return { id: productDoc.id, ...productDoc.data() };
    } catch (error) {
      throw new Error(`Error getting product: ${error.message}`);
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
      const orderRef = await this.db.collection('orders').add({
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending'
      });
      return { id: orderRef.id, ...orderData };
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  async getOrderById(orderId) {
    try {
      const orderDoc = await this.db.collection('orders').doc(orderId).get();
      if (!orderDoc.exists) {
        throw new Error('Order not found');
      }
      return { id: orderDoc.id, ...orderDoc.data() };
    } catch (error) {
      throw new Error(`Error getting order: ${error.message}`);
    }
  }

  async getOrdersByUser(userId, userType = 'buyer') {
    try {
      const field = userType === 'buyer' ? 'buyerId' : 'sellerId';
      const snapshot = await this.db.collection('orders')
        .where(field, '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Error getting orders: ${error.message}`);
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
      const reviewRef = await this.db.collection('reviews').add({
        ...reviewData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: reviewRef.id, ...reviewData };
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

  // ===== UTILIDADES =====
  async getStats() {
    try {
      const stats = {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
      };

      // Contar usuarios
      const usersSnapshot = await this.db.collection('users').get();
      stats.totalUsers = usersSnapshot.size;

      // Contar productos activos
      const productsSnapshot = await this.db.collection('products')
        .where('isActive', '==', true)
        .get();
      stats.totalProducts = productsSnapshot.size;

      // Contar órdenes y calcular ingresos
      const ordersSnapshot = await this.db.collection('orders').get();
      stats.totalOrders = ordersSnapshot.size;
      
      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        if (order.status === 'completed' && order.total) {
          stats.totalRevenue += order.total;
        }
      });

      return stats;
    } catch (error) {
      throw new Error(`Error getting stats: ${error.message}`);
    }
  }
}

module.exports = new DatabaseService(); 