const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authService = require('./services/auth');
const databaseService = require('./services/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===== RUTAS DE AUTENTICACIÓN =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const userData = req.body;
    const user = await authService.createUser(userData);
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    const user = await authService.verifyToken(token);
    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/api/auth/send-verification', authService.authenticateUser, async (req, res) => {
  try {
    await authService.sendEmailVerification(req.user.uid);
    res.json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/send-password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    await authService.sendPasswordResetEmail(email);
    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== RUTAS DE USUARIOS =====
app.get('/api/users/profile', authService.authenticateUser, async (req, res) => {
  try {
    const user = await authService.getUserByUid(req.user.uid);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/users/profile', authService.authenticateUser, async (req, res) => {
  try {
    const updatedUser = await authService.updateUser(req.user.uid, req.body);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/users/profile', authService.authenticateUser, async (req, res) => {
  try {
    await authService.deleteUser(req.user.uid);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== RUTAS DE PRODUCTOS =====
app.post('/api/products', authService.authenticateUser, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      sellerId: req.user.uid
    };
    const product = await databaseService.createProduct(productData);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const filters = req.query;
    const products = await databaseService.getProducts(filters);
    res.json({ success: true, products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await databaseService.getProductById(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.put('/api/products/:id', authService.authenticateUser, async (req, res) => {
  try {
    const product = await databaseService.getProductById(req.params.id);
    
    // Verificar que el usuario es el vendedor o admin
    if (product.sellerId !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const updatedProduct = await databaseService.updateProduct(req.params.id, req.body);
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/products/:id', authService.authenticateUser, async (req, res) => {
  try {
    const product = await databaseService.getProductById(req.params.id);
    
    // Verificar que el usuario es el vendedor o admin
    if (product.sellerId !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    await databaseService.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== RUTAS DE ÓRDENES =====
app.post('/api/orders', authService.authenticateUser, async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      buyerId: req.user.uid
    };
    const order = await databaseService.createOrder(orderData);
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders', authService.authenticateUser, async (req, res) => {
  try {
    const userType = req.query.userType || 'buyer';
    const orders = await databaseService.getOrdersByUser(req.user.uid, userType);
    res.json({ success: true, orders });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders/:id', authService.authenticateUser, async (req, res) => {
  try {
    const order = await databaseService.getOrderById(req.params.id);
    
    // Verificar que el usuario tiene acceso a la orden
    if (order.buyerId !== req.user.uid && order.sellerId !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.put('/api/orders/:id/status', authService.authenticateUser, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await databaseService.getOrderById(req.params.id);
    
    // Solo el vendedor o admin puede cambiar el estado
    if (order.sellerId !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const updatedOrder = await databaseService.updateOrderStatus(req.params.id, status);
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== RUTAS DE CATEGORÍAS =====
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await databaseService.getCategories();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== RUTAS DE REVIEWS =====
app.post('/api/reviews', authService.authenticateUser, async (req, res) => {
  try {
    const reviewData = {
      ...req.body,
      userId: req.user.uid
    };
    const review = await databaseService.createReview(reviewData);
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/products/:productId/reviews', async (req, res) => {
  try {
    const reviews = await databaseService.getReviewsByProduct(req.params.productId);
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== RUTAS DE ESTADÍSTICAS =====
app.get('/api/stats', authService.authenticateUser, authService.requireRole(['admin']), async (req, res) => {
  try {
    const stats = await databaseService.getStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===== RUTA DE SALUD =====
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'GTS API is running',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 GTS API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app; 