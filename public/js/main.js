/**
 * Good to Save Marketplace - Main Application
 * Maneja toda la funcionalidad principal de la aplicación
 */
class FoodMarketplaceApp {
  constructor() {
    this.initialized = false;
    this.cart = null;
    this.products = [];
    this.currentUser = null;
    this.currentPage = this.getCurrentPage();
  }

  /**
   * Inicializa la aplicación
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Esperar a que los web components estén listos
      await this.waitForWebComponents();
      
      // Cargar componentes primero
      await ComponentLoader.initializeComponents();
      
      // Inicializar sistemas principales
      this.cart = window.ShoppingCart;
      await this.loadProducts();
      
      // Inicializar funcionalidad específica de la página
      this.initializeCurrentPage();
      
      // Configurar eventos globales
      this.setupGlobalEventListeners();
      
      this.initialized = true;
      console.log('FoodMarketplace App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }

  /**
   * Espera a que los web components estén listos
   */
  async waitForWebComponents() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('web-components-ready', resolve, { once: true });
      } else {
        // Si el DOM ya está listo, esperar un poco para que los componentes se carguen
        setTimeout(resolve, 100);
      }
    });
  }

  /**
   * Carga los productos desde el archivo JSON
   */
  async loadProducts() {
    try {
              const response = await fetch('../assets/data/products.json');
      const data = await response.json();
      this.products = data.products || [];
    } catch (error) {
      console.error('Failed to load products:', error);
      this.products = [];
    }
  }

  /**
   * Obtiene la página actual
   * @returns {string} - Nombre de la página actual
   */
  getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  /**
   * Inicializa la funcionalidad específica de la página actual
   */
  initializeCurrentPage() {
    switch(this.currentPage) {
      case 'index.html':
        this.initializeHomePage();
        break;
              case 'marketplace/marketplace.html':
        this.initializeMarketplacePage();
        break;
      case 'about.html':
        this.initializeAboutPage();
        break;
      case 'payment.html':
        this.initializePaymentPage();
        break;
      case 'qr.html':
        this.initializeQRPage();
        break;
      case 'auth.html':
        this.initializeAuthPage();
        break;
    }
  }

  /**
   * Configura eventos globales de la aplicación
   */
  setupGlobalEventListeners() {
    // Manejar clicks globales
    document.addEventListener('click', this.handleGlobalClick.bind(this));
    
    // Manejar envíos de formularios
    document.addEventListener('submit', this.handleFormSubmission.bind(this));
    
    // Efectos de scroll
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  /**
   * Inicializa la página principal
   */
  initializeHomePage() {
    this.setupHeroAnimations();
    this.setupCounterAnimations();
    this.setupTestimonials();
  }

  /**
   * Configura animaciones del hero
   */
  setupHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroActions = document.querySelector('.hero-actions');
    
    if (heroTitle) {
      setTimeout(() => heroTitle.classList.add('fade-in'), 100);
    }
    if (heroSubtitle) {
      setTimeout(() => heroSubtitle.classList.add('fade-in'), 300);
    }
    if (heroActions) {
      setTimeout(() => heroActions.classList.add('fade-in'), 500);
    }
  }



  /**
   * Configura animaciones de contadores
   */
  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-target]');
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current).toLocaleString();
      }, 16);
    };

    // Observar contadores cuando entren en viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    counters.forEach(counter => observer.observe(counter));
  }

  /**
   * Configura testimonios
   */
  setupTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('fade-in');
      }, index * 200);
    });
  }

  /**
   * Inicializa la página del marketplace
   */
  initializeMarketplacePage() {
    // No cargar productos dinámicamente ya que tenemos cards estáticas
    // this.renderProducts();
    this.setupFiltering();
    this.setupSearch();
    this.setupSorting();
    this.setupViewOptions();
  }

  /**
   * Renderiza productos en el marketplace
   */
  async renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid && this.products.length > 0) {
      await ComponentLoader.renderProducts('#products-grid', this.products);
      this.updateResultsCount();
    }
  }

  /**
   * Configura sistema de filtros
   */
  setupFiltering() {
    // Filtros de categoría
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.applyFilters();
      });
    });

    // Filtro de precio
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
      priceRange.addEventListener('input', (e) => {
        document.getElementById('price-value').textContent = `€${e.target.value}`;
        this.applyFilters();
      });
    }

    // Otros filtros
    const expiryFilter = document.getElementById('expiry-filter');
    const locationFilter = document.getElementById('location-filter');
    
    [expiryFilter, locationFilter].forEach(filter => {
      if (filter) {
        filter.addEventListener('change', () => this.applyFilters());
      }
    });
  }

  /**
   * Aplica filtros a los productos
   */
  applyFilters() {
    const activeCategory = document.querySelector('.category-tab.active')?.dataset.category;
    const maxPrice = document.getElementById('price-range')?.value || 50;
    const expiryFilter = document.getElementById('expiry-filter')?.value;
    const locationFilter = document.getElementById('location-filter')?.value;

    let filteredProducts = this.products.filter(product => {
      // Filtro de categoría
      if (activeCategory && activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }

      // Filtro de precio
      if (product.discountedPrice > maxPrice) {
        return false;
      }

      // Filtro de vencimiento
      if (expiryFilter && expiryFilter !== 'all') {
        switch(expiryFilter) {
          case 'today':
            if (product.expiresIn > 1) return false;
            break;
          case 'week':
            if (product.expiresIn > 7) return false;
            break;
          case 'month':
            if (product.expiresIn > 30) return false;
            break;
        }
      }

      // Filtro de ubicación
      if (locationFilter && locationFilter !== 'all' && product.location !== locationFilter) {
        return false;
      }

      return true;
    });

    this.renderFilteredProducts(filteredProducts);
  }

  /**
   * Renderiza productos filtrados
   * @param {Array} products - Productos filtrados
   */
  async renderFilteredProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-state');
    const loadingState = document.getElementById('loading-state');

    if (loadingState) {
      loadingState.style.display = 'none';
    }

    if (products.length === 0) {
      if (productsGrid) productsGrid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
    } else {
      if (productsGrid) productsGrid.style.display = 'grid';
      if (emptyState) emptyState.style.display = 'none';
      await ComponentLoader.renderProducts('#products-grid', products);
    }

    this.updateResultsCount(products.length);
  }

  /**
   * Actualiza el contador de resultados
   * @param {number} count - Número de productos
   */
  updateResultsCount(count = null) {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
      const total = count !== null ? count : this.products.length;
      resultsCount.textContent = total;
    }
  }

  /**
   * Configura búsqueda
   */
  setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let searchTimeout;
      
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 300);
      });
    }
  }

  /**
   * Realiza búsqueda de productos
   * @param {string} query - Término de búsqueda
   */
  performSearch(query) {
    if (!query.trim()) {
      this.applyFilters();
      return;
    }

    const searchResults = this.products.filter(product => {
      const searchTerm = query.toLowerCase();
      return (
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.supplier.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    });

    this.renderFilteredProducts(searchResults);
  }

  /**
   * Configura opciones de ordenamiento
   */
  setupSorting() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this.applySorting();
      });
    }
  }

  /**
   * Aplica ordenamiento a los productos
   */
  applySorting() {
    const sortValue = document.getElementById('sort-select')?.value;
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid || !sortValue) return;

    let sortedProducts = [...this.products];

    switch(sortValue) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case 'expiry':
        sortedProducts.sort((a, b) => a.expiresIn - b.expiresIn);
        break;
      case 'discount':
        sortedProducts.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
    }

    ComponentLoader.renderProducts('#products-grid', sortedProducts);
  }

  /**
   * Configura opciones de vista
   */
  setupViewOptions() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('products-grid');
    
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        viewButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const view = btn.dataset.view;
        if (productsGrid) {
          productsGrid.className = `products-grid products-grid--${view}`;
        }
      });
    });
  }

  /**
   * Inicializa la página About
   */
  initializeAboutPage() {
    this.loadTeamMembers();
    this.setupCounterAnimations();
  }

  /**
   * Carga miembros del equipo
   */
  async loadTeamMembers() {
    try {
              const response = await fetch('../assets/data/team.json');
      const data = await response.json();
      const teamGrid = document.getElementById('team-grid');
      
      if (teamGrid && data.team) {
        const teamHTML = data.team.map(member => `
          <div class="team-member">
            <div class="team-member__image">
              <img src="${member.image}" alt="${member.name}" loading="lazy">
            </div>
            <div class="team-member__info">
              <h3 class="team-member__name">${member.name}</h3>
              <p class="team-member__role">${member.role}</p>
              <p class="team-member__bio">${member.bio}</p>
              <div class="team-member__social">
                <a href="${member.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
                <a href="mailto:${member.email}">Email</a>
              </div>
            </div>
          </div>
        `).join('');
        
        teamGrid.innerHTML = teamHTML;
      }
    } catch (error) {
      console.error('Failed to load team members:', error);
    }
  }

  /**
   * Inicializa la página de pago
   */
  initializePaymentPage() {
    this.loadOrderSummary();
    this.setupPaymentForm();
  }

  /**
   * Carga resumen del pedido
   */
  loadOrderSummary() {
    const checkoutItems = sessionStorage.getItem('checkout_items');
    const checkoutTotal = sessionStorage.getItem('checkout_total');
    
    if (checkoutItems && checkoutTotal) {
      const items = JSON.parse(checkoutItems);
      const total = parseFloat(checkoutTotal);
      
      this.renderOrderSummary(items, total);
    }
  }

  /**
   * Renderiza resumen del pedido
   * @param {Array} items - Items del pedido
   * @param {number} total - Total del pedido
   */
  renderOrderSummary(items, total) {
    const orderItems = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total-amount');
    
    if (orderItems) {
      const itemsHTML = items.map(item => `
        <div class="order-item">
          <img src="${item.image}" alt="${item.title}" class="order-item__image">
          <div class="order-item__details">
            <h4 class="order-item__title">${item.title}</h4>
            <p class="order-item__supplier">${item.supplier}</p>
            <div class="order-item__quantity">Cantidad: ${item.quantity}</div>
          </div>
          <div class="order-item__price">€${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      `).join('');
      
      orderItems.innerHTML = itemsHTML;
    }
    
    const subtotal = total;
    const tax = subtotal * 0.21; // 21% IVA
    const finalTotal = subtotal + tax;
    
    if (subtotalElement) subtotalElement.textContent = `€${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `€${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `€${finalTotal.toFixed(2)}`;
  }

  /**
   * Configura formulario de pago
   */
  setupPaymentForm() {
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
      paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePaymentSubmission();
      });
    }
  }

  /**
   * Maneja envío del formulario de pago
   */
  handlePaymentSubmission() {
    // Simular procesamiento de pago
    const submitBtn = document.getElementById('payment-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      // Simular éxito de pago
              window.location.href = 'pages/qr.html';
    }, 2000);
  }

  /**
   * Inicializa la página QR
   */
  initializeQRPage() {
    this.generateQRCode();
    this.setupQRDownload();
  }

  /**
   * Genera código QR
   */
  generateQRCode() {
    const qrContainer = document.getElementById('qr-code-container');
    if (qrContainer && window.QRCode) {
      const orderData = {
        orderId: 'FS-2024-001234',
        customerName: 'Usuario Ejemplo',
        totalAmount: '€24.50',
        pickupLocation: 'Mercado Central',
        pickupTime: '14:00 - 18:00'
      };
      
      const qrData = JSON.stringify(orderData);
      
      new QRCode(qrContainer, {
        text: qrData,
        width: 256,
        height: 256,
        colorDark: '#2D5A27',
        colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }

  /**
   * Configura descarga de QR
   */
  setupQRDownload() {
    const downloadBtn = document.getElementById('download-qr-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const canvas = document.querySelector('#qr-code-container canvas');
        if (canvas) {
          const link = document.createElement('a');
          link.download = 'order-qr.png';
          link.href = canvas.toDataURL();
          link.click();
        }
      });
    }
  }

  /**
   * Inicializa página de autenticación
   */
  initializeAuthPage() {
    this.setupAuthForm('signinForm');
    this.setupAuthForm('signupForm');
    this.setupPasswordValidation();
  }

  /**
   * Configura formulario de autenticación
   * @param {string} formId - ID del formulario
   */
  setupAuthForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAuthSubmission(form);
      });
    }
  }

  /**
   * Maneja envío de formulario de autenticación
   * @param {HTMLFormElement} form - Formulario
   */
  async handleAuthSubmission(form) {
    // Verificar que Firebase esté disponible
    if (!window.firebaseAuthService) {
      console.error('Firebase Auth Service no está disponible');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    try {
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
      submitBtn.disabled = true;
      
      if (form.id === 'signinForm') {
        await this.handleSignIn(form);
      } else if (form.id === 'signupForm') {
        await this.handleSignUp(form);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      this.showAuthError(error.message);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  /**
   * Maneja inicio de sesión
   * @param {HTMLFormElement} form - Formulario de inicio de sesión
   */
  async handleSignIn(form) {
    const email = form.querySelector('#signin-email').value;
    const password = form.querySelector('#signin-password').value;

    try {
      const user = await window.firebaseAuthService.signIn(email, password);
      console.log('Usuario autenticado:', user);
      
      // Guardar información del usuario en localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
      
      this.showAuthSuccess('Inicio de sesión exitoso');
      // Redirección eliminada para evitar navegación automática desde main.js
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Maneja registro de usuario
   * @param {HTMLFormElement} form - Formulario de registro
   */
  async handleSignUp(form) {
    const formData = {
      firstName: form.querySelector('#signup-firstname').value,
      lastName: form.querySelector('#signup-lastname').value,
      email: form.querySelector('#signup-email').value,
      password: form.querySelector('#signup-password').value,
      phone: form.querySelector('#signup-phone').value,
      accountType: form.querySelector('#signup-account-type').value,
      location: form.querySelector('#signup-location').value
    };

    try {
      const user = await window.firebaseAuthService.signUp(formData);
      console.log('Usuario registrado:', user);
      
      // Guardar información del usuario en localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
      
      this.showAuthSuccess('Registro exitoso');
      // Redirección eliminada para evitar navegación automática desde main.js
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Muestra mensaje de error de autenticación
   * @param {string} message - Mensaje de error
   */
  showAuthError(message) {
    let errorDiv = document.getElementById('auth-error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.id = 'auth-error-message';
      errorDiv.className = 'auth-error-message';
      document.body.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #ff4444;
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  }

  /**
   * Muestra mensaje de éxito de autenticación
   * @param {string} message - Mensaje de éxito
   */
  showAuthSuccess(message) {
    let successDiv = document.getElementById('auth-success-message');
    if (!successDiv) {
      successDiv = document.createElement('div');
      successDiv.id = 'auth-success-message';
      successDiv.className = 'auth-success-message';
      document.body.appendChild(successDiv);
    }
    
    successDiv.textContent = message;
    successDiv.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #4CAF50;
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    setTimeout(() => {
      successDiv.style.display = 'none';
    }, 3000);
  }

  /**
   * Configura validación de contraseña
   */
  setupPasswordValidation() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      passwordInput.addEventListener('input', (e) => {
        this.validatePassword(e.target.value);
      });
    }
  }

  /**
   * Valida contraseña
   * @param {string} password - Contraseña a validar
   */
  validatePassword(password) {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    
    Object.keys(requirements).forEach(req => {
      const element = document.getElementById(`req-${req}`);
      if (element) {
        const icon = element.querySelector('.requirement-icon');
        if (requirements[req]) {
          icon.textContent = '✅';
          element.classList.add('requirement-met');
        } else {
          icon.textContent = '⭕';
          element.classList.remove('requirement-met');
        }
      }
    });
  }

  /**
   * Maneja clicks globales
   * @param {Event} e - Evento de click
   */
  handleGlobalClick(e) {
    // Cerrar modales al hacer click fuera
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  }

  /**
   * Maneja envíos de formularios globales
   * @param {Event} e - Evento de submit
   */
  handleFormSubmission(e) {
    // Validación básica de formularios
    const form = e.target;
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      } else {
        field.classList.remove('error');
      }
    });
    
    if (!isValid) {
      e.preventDefault();
    }
  }

  /**
   * Maneja efectos de scroll
   */
  handleScroll() {
    const header = document.querySelector('.main-header');
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }
  }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const app = new FoodMarketplaceApp();
  app.initialize();
}); 

// ===== SISTEMA DE GESTIÓN DE DATOS CON CACHE =====
class GTSDataManager {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
        this.baseURL = window.location.origin; // URL base dinámica
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        this.requestQueue = new Map();
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    init() {
        // Escuchar cambios de conectividad
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processQueue();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });

        // Limpiar cache expirado cada 10 minutos
        setInterval(() => {
            this.cleanExpiredCache();
        }, 10 * 60 * 1000);
    }

    // Obtener datos con cache
    async getData(endpoint, options = {}) {
        const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
        
        // Verificar cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        // Si no hay conexión, devolver cache expirado si existe
        if (!this.isOnline) {
            const expiredCache = this.cache.get(cacheKey);
            if (expiredCache) {
                console.warn('Usando cache expirado por falta de conexión');
                return expiredCache.data;
            }
            throw new Error('Sin conexión a internet');
        }

        try {
            const data = await this.fetchWithRetry(endpoint, options);
            
            // Guardar en cache
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
            
            // Si hay cache expirado, usarlo como fallback
            const expiredCache = this.cache.get(cacheKey);
            if (expiredCache) {
                console.warn('Usando cache expirado como fallback');
                return expiredCache.data;
            }
            
            throw error;
        }
    }

    // Fetch con reintentos y cola de requests
    async fetchWithRetry(endpoint, options, attempt = 1) {
        const requestId = `${endpoint}-${Date.now()}`;
        
        // Si ya hay un request en curso para este endpoint, esperar
        if (this.requestQueue.has(endpoint)) {
            return this.requestQueue.get(endpoint);
        }

        const requestPromise = this._fetchWithRetry(endpoint, options, attempt);
        this.requestQueue.set(endpoint, requestPromise);
        
        try {
            const result = await requestPromise;
            return result;
        } finally {
            this.requestQueue.delete(endpoint);
        }
    }

    async _fetchWithRetry(endpoint, options, attempt = 1) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            if (attempt < this.retryAttempts) {
                await this.delay(this.retryDelay * attempt);
                return this._fetchWithRetry(endpoint, options, attempt + 1);
            }
            throw error;
        }
    }

    // Enviar datos
    async postData(endpoint, data, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    ...options.headers
                },
                body: JSON.stringify(data),
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            // Invalidar cache relacionado
            this.invalidateCache(endpoint);
            
            return result;
        } catch (error) {
            console.error(`Error posting data to ${endpoint}:`, error);
            throw error;
        }
    }

    // Actualizar datos
    async putData(endpoint, data, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    ...options.headers
                },
                body: JSON.stringify(data),
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            // Invalidar cache relacionado
            this.invalidateCache(endpoint);
            
            return result;
        } catch (error) {
            console.error(`Error updating data at ${endpoint}:`, error);
            throw error;
        }
    }

    // Eliminar datos
    async deleteData(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Invalidar cache relacionado
            this.invalidateCache(endpoint);
            
            return true;
        } catch (error) {
            console.error(`Error deleting data at ${endpoint}:`, error);
            throw error;
        }
    }

    // Invalidar cache
    invalidateCache(pattern) {
        for (const [key] of this.cache.entries()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }

    // Limpiar cache
    clearCache() {
        this.cache.clear();
    }

    // Limpiar cache expirado
    cleanExpiredCache() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.cacheTimeout) {
                this.cache.delete(key);
            }
        }
    }

    // Procesar cola de requests
    async processQueue() {
        for (const [endpoint, promise] of this.requestQueue.entries()) {
            try {
                await promise;
            } catch (error) {
                console.error(`Error processing queued request for ${endpoint}:`, error);
            }
        }
    }

    // Delay helper
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Obtener token de autenticación
    getAuthToken() {
        return localStorage.getItem('gts-auth-token') || '';
    }

    // Verificar estado de la conexión
    isConnected() {
        return this.isOnline;
    }

    // Obtener estadísticas del cache
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            timestamp: Date.now()
        };
    }
}

// Instancia global del gestor de datos
const gtsData = new GTSDataManager();

// Agregar a la ventana global para acceso desde otros scripts
window.gtsData = gtsData;

// ===== SISTEMA DE NOTIFICACIONES CORPORATIVAS =====
class GTSNotificationSystem {
    constructor() {
        this.container = this.createContainer();
        this.notifications = new Map();
        this.counter = 0;
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        
        this.init();
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'gts-notifications';
        container.className = 'gts-notifications-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
        return container;
    }

    init() {
        // Agregar estilos CSS si no existen
        if (!document.getElementById('gts-notifications-styles')) {
            this.addStyles();
        }
    }

    addStyles() {
        const style = document.createElement('style');
        style.id = 'gts-notifications-styles';
        style.textContent = `
            .gts-notifications-container {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .gts-notification {
                background: var(--gts-light, #ffffff);
                border-radius: var(--border-radius, 8px);
                box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
                padding: 1rem;
                margin-bottom: 0.5rem;
                border-left: 4px solid var(--gts-primary, #39b54a);
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: auto;
                max-height: 0;
                overflow: hidden;
            }
            
            .gts-notification.show {
                transform: translateX(0);
                opacity: 1;
                max-height: 200px;
            }
            
            .gts-notification.hide {
                transform: translateX(100%);
                opacity: 0;
                max-height: 0;
            }
            
            .gts-notification-content {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 0.75rem;
            }
            
            .gts-notification-message {
                color: var(--gts-dark, #0f1419);
                font-size: 0.875rem;
                line-height: 1.4;
                flex: 1;
            }
            
            .gts-notification-close {
                background: none;
                border: none;
                color: var(--text-muted, #a0a0a0);
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }
            
            .gts-notification-close:hover {
                background: rgba(0, 0, 0, 0.05);
                color: var(--gts-dark, #0f1419);
            }
            
            .gts-notification.success {
                border-left-color: var(--gts-primary, #39b54a);
            }
            
            .gts-notification.error {
                border-left-color: var(--error-color, #e74c3c);
            }
            
            .gts-notification.warning {
                border-left-color: var(--warning-color, #f39c12);
            }
            
            .gts-notification.info {
                border-left-color: var(--gts-secondary, #2ecc71);
            }
            
            .gts-notification-icon {
                width: 20px;
                height: 20px;
                margin-right: 0.5rem;
                flex-shrink: 0;
            }
            
            .gts-notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: var(--gts-primary, #39b54a);
                width: 100%;
                transform-origin: left;
                animation: gtsNotificationProgress linear forwards;
            }
            
            @keyframes gtsNotificationProgress {
                from { transform: scaleX(1); }
                to { transform: scaleX(0); }
            }
            
            @media (max-width: 768px) {
                .gts-notifications-container {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
                
                .gts-notification {
                    margin-bottom: 0.25rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    show(message, type = 'info', duration = this.defaultDuration) {
        const id = ++this.counter;
        const notification = this.createNotification(message, type, id);
        
        // Limitar número de notificaciones
        if (this.notifications.size >= this.maxNotifications) {
            const oldestId = Array.from(this.notifications.keys())[0];
            this.hide(oldestId);
        }
        
        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        // Animación de entrada
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-remover
        if (duration > 0) {
            setTimeout(() => {
                this.hide(id);
            }, duration);
        }

        return id;
    }

    createNotification(message, type, id) {
        const notification = document.createElement('div');
        notification.className = `gts-notification ${type}`;
        notification.innerHTML = `
            <div class="gts-notification-content">
                <div class="gts-notification-icon">
                    ${this.getIconForType(type)}
                </div>
                <span class="gts-notification-message">${message}</span>
                <button class="gts-notification-close" onclick="window.gtsNotifications.hide(${id})" aria-label="Cerrar notificación">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="gts-notification-progress" style="animation-duration: ${this.defaultDuration}ms;"></div>
        `;

        return notification;
    }

    getIconForType(type) {
        const icons = {
            success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>`,
            error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`,
            warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>`,
            info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`
        };
        
        return icons[type] || icons.info;
    }

    hide(id) {
        const notification = this.notifications.get(id);
        if (notification) {
            notification.classList.add('hide');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                this.notifications.delete(id);
            }, 300);
        }
    }

    // Métodos de conveniencia
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    // Limpiar todas las notificaciones
    clearAll() {
        for (const [id] of this.notifications.entries()) {
            this.hide(id);
        }
    }

    // Obtener estadísticas
    getStats() {
        return {
            total: this.counter,
            active: this.notifications.size,
            maxNotifications: this.maxNotifications
        };
    }
}

// Instancia global del sistema de notificaciones
const gtsNotifications = new GTSNotificationSystem();

// Agregar a la ventana global para acceso desde otros scripts
window.gtsNotifications = gtsNotifications;

// ===== SISTEMA DE LAZY LOADING Y OPTIMIZACIÓN DE RENDIMIENTO =====
class GTSLazyLoader {
    constructor() {
        this.observer = null;
        this.elements = new Set();
        this.imageCache = new Map();
        this.componentCache = new Map();
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    rootMargin: '50px',
                    threshold: 0.1
                }
            );
        }
        
        // Inicializar lazy loading para elementos existentes
        this.initExistingElements();
    }

    initExistingElements() {
        // Lazy load para imágenes existentes
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.observe(img));

        // Lazy load para backgrounds existentes
        const backgrounds = document.querySelectorAll('[data-background]');
        backgrounds.forEach(el => this.observe(el));

        // Lazy load para componentes existentes
        const components = document.querySelectorAll('[data-lazy-component]');
        components.forEach(el => this.observe(el));
    }

    observe(element) {
        if (this.observer) {
            this.observer.observe(element);
            this.elements.add(element);
        } else {
            // Fallback para navegadores antiguos
            this.loadElement(element);
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadElement(entry.target);
                this.observer.unobserve(entry.target);
                this.elements.delete(entry.target);
            }
        });
    }

    loadElement(element) {
        // Lazy load de imágenes
        if (element.dataset.src) {
            this.loadImage(element);
        }

        // Lazy load de backgrounds
        if (element.dataset.background) {
            this.loadBackground(element);
        }

        // Lazy load de componentes
        if (element.dataset.lazyComponent) {
            this.loadComponent(element);
        }

        // Disparar evento personalizado
        element.dispatchEvent(new CustomEvent('gts-lazy-loaded'));
    }

    loadImage(imgElement) {
        const src = imgElement.dataset.src;
        
        // Verificar cache
        if (this.imageCache.has(src)) {
            imgElement.src = this.imageCache.get(src);
            imgElement.classList.add('gts-loaded');
            return;
        }

        // Precargar imagen
        const tempImg = new Image();
        tempImg.onload = () => {
            imgElement.src = src;
            imgElement.classList.add('gts-loaded');
            this.imageCache.set(src, src);
            
            // Aplicar animación de entrada
            imgElement.classList.add('gts-animate-fade-in-scale');
        };
        
        tempImg.onerror = () => {
            console.warn(`Error loading image: ${src}`);
            // Cargar imagen de fallback si existe
            if (imgElement.dataset.fallback) {
                imgElement.src = imgElement.dataset.fallback;
            }
        };
        
        tempImg.src = src;
    }

    loadBackground(element) {
        const background = element.dataset.background;
        
        // Verificar cache
        if (this.imageCache.has(background)) {
            element.style.backgroundImage = `url(${background})`;
            element.classList.add('gts-loaded');
            return;
        }

        // Precargar imagen de background
        const tempImg = new Image();
        tempImg.onload = () => {
            element.style.backgroundImage = `url(${background})`;
            element.classList.add('gts-loaded');
            this.imageCache.set(background, background);
            
            // Aplicar animación de entrada
            element.classList.add('gts-animate-fade-in-scale');
        };
        
        tempImg.onerror = () => {
            console.warn(`Error loading background: ${background}`);
            if (element.dataset.fallback) {
                element.style.backgroundImage = `url(${element.dataset.fallback})`;
            }
        };
        
        tempImg.src = background;
    }

    loadComponent(element) {
        const componentName = element.dataset.lazyComponent;
        
        // Verificar cache de componentes
        if (this.componentCache.has(componentName)) {
            this.renderComponent(element, this.componentCache.get(componentName));
            return;
        }

        // Cargar componente dinámicamente
        this.loadComponentScript(componentName).then(component => {
            this.componentCache.set(componentName, component);
            this.renderComponent(element, component);
        }).catch(error => {
            console.error(`Error loading component: ${componentName}`, error);
        });
    }

    async loadComponentScript(componentName) {
        // Cargar script del componente
        const script = document.createElement('script');
        script.src = `../components/${componentName}.js`;
        
        return new Promise((resolve, reject) => {
            script.onload = () => {
                // El componente se registra automáticamente
                resolve(componentName);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    renderComponent(element, componentName) {
        // Crear instancia del componente
        const component = document.createElement(componentName);
        
        // Copiar atributos del elemento original
        Array.from(element.attributes).forEach(attr => {
            if (attr.name !== 'data-lazy-component') {
                component.setAttribute(attr.name, attr.value);
            }
        });
        
        // Reemplazar elemento original
        element.parentNode.replaceChild(component, element);
        component.classList.add('gts-loaded');
    }

    // Precargar elementos importantes
    preload(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => this.loadElement(element));
    }

    // Precargar imágenes específicas
    preloadImages(urls) {
        urls.forEach(url => {
            if (!this.imageCache.has(url)) {
                const img = new Image();
                img.onload = () => this.imageCache.set(url, url);
                img.src = url;
            }
        });
    }

    // Limpiar cache
    clearCache() {
        this.imageCache.clear();
        this.componentCache.clear();
    }

    // Obtener estadísticas
    getStats() {
        return {
            observedElements: this.elements.size,
            cachedImages: this.imageCache.size,
            cachedComponents: this.componentCache.size
        };
    }

    // Optimizar rendimiento
    optimize() {
        // Reducir la frecuencia de observación en dispositivos lentos
        if ('connection' in navigator && navigator.connection.effectiveType === 'slow-2g') {
            this.observer.rootMargin = '100px';
        }
        
        // Limpiar cache si es muy grande
        if (this.imageCache.size > 100) {
            const entries = Array.from(this.imageCache.entries());
            const toRemove = entries.slice(0, 50);
            toRemove.forEach(([key]) => this.imageCache.delete(key));
        }
    }
}

// Instancia global del lazy loader
const gtsLazyLoader = new GTSLazyLoader();

// Agregar a la ventana global para acceso desde otros scripts
window.gtsLazyLoader = gtsLazyLoader;

// Inicializar lazy loading cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    gtsLazyLoader.initExistingElements();
});

// ===== SISTEMA DE TEMAS CORPORATIVOS =====
class GTSThemeManager {
    constructor() {
        this.themes = {
            light: {
                '--gts-bg-primary': '#ffffff',
                '--gts-bg-secondary': '#f8f9fa',
                '--gts-bg-tertiary': '#e9ecef',
                '--gts-text-primary': '#1a1a1a',
                '--gts-text-secondary': '#6c757d',
                '--gts-text-muted': '#a0a0a0',
                '--gts-border': '#dee2e6',
                '--gts-border-light': '#e9ecef',
                '--gts-shadow': '0 2px 8px rgba(0,0,0,0.1)',
                '--gts-shadow-lg': '0 10px 25px rgba(0,0,0,0.15)',
                '--gts-card-bg': '#ffffff',
                '--gts-card-border': '#e9ecef',
                '--gts-input-bg': '#ffffff',
                '--gts-input-border': '#ced4da',
                '--gts-button-bg': '#39b54a',
                '--gts-button-text': '#ffffff',
                '--gts-button-hover': '#2ecc71'
            },
            dark: {
                '--gts-bg-primary': '#0f1419',
                '--gts-bg-secondary': '#1a1f2e',
                '--gts-bg-tertiary': '#2d3748',
                '--gts-text-primary': '#ffffff',
                '--gts-text-secondary': '#a0a0a0',
                '--gts-text-muted': '#6c757d',
                '--gts-border': '#2d3748',
                '--gts-border-light': '#4a5568',
                '--gts-shadow': '0 2px 8px rgba(0,0,0,0.3)',
                '--gts-shadow-lg': '0 10px 25px rgba(0,0,0,0.4)',
                '--gts-card-bg': '#1a1f2e',
                '--gts-card-border': '#2d3748',
                '--gts-input-bg': '#2d3748',
                '--gts-input-border': '#4a5568',
                '--gts-button-bg': '#39b54a',
                '--gts-button-text': '#ffffff',
                '--gts-button-hover': '#2ecc71'
            },
            corporate: {
                '--gts-bg-primary': '#f8f9fa',
                '--gts-bg-secondary': '#e9ecef',
                '--gts-bg-tertiary': '#dee2e6',
                '--gts-text-primary': '#212529',
                '--gts-text-secondary': '#495057',
                '--gts-text-muted': '#6c757d',
                '--gts-border': '#dee2e6',
                '--gts-border-light': '#e9ecef',
                '--gts-shadow': '0 4px 12px rgba(0,0,0,0.15)',
                '--gts-shadow-lg': '0 8px 25px rgba(0,0,0,0.2)',
                '--gts-card-bg': '#ffffff',
                '--gts-card-border': '#dee2e6',
                '--gts-input-bg': '#ffffff',
                '--gts-input-border': '#ced4da',
                '--gts-button-bg': '#39b54a',
                '--gts-button-text': '#ffffff',
                '--gts-button-hover': '#2ecc71'
            },
            highContrast: {
                '--gts-bg-primary': '#000000',
                '--gts-bg-secondary': '#1a1a1a',
                '--gts-bg-tertiary': '#333333',
                '--gts-text-primary': '#ffffff',
                '--gts-text-secondary': '#ffff00',
                '--gts-text-muted': '#00ff00',
                '--gts-border': '#ffff00',
                '--gts-border-light': '#00ff00',
                '--gts-shadow': '0 0 0 2px #ffff00',
                '--gts-shadow-lg': '0 0 0 4px #ffff00',
                '--gts-card-bg': '#000000',
                '--gts-card-border': '#ffff00',
                '--gts-input-bg': '#000000',
                '--gts-input-border': '#ffff00',
                '--gts-button-bg': '#ffff00',
                '--gts-button-text': '#000000',
                '--gts-button-hover': '#ffffff'
            }
        };
        
        this.currentTheme = this.getStoredTheme() || 'dark';
        this.userPreference = this.getUserPreference();
        this.systemPreference = this.getSystemPreference();
        
        this.init();
    }

    init() {
        // Aplicar tema inicial
        this.applyTheme(this.currentTheme);
        
        // Escuchar cambios de preferencia del sistema
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                this.systemPreference = e.matches ? 'dark' : 'light';
                if (this.userPreference === 'auto') {
                    this.applyTheme(this.systemPreference);
                }
            });
        }
        
        // Crear selector de temas si no existe
        this.createThemeSelector();
    }

    createThemeSelector() {
        // Solo crear si no existe ya
        if (document.getElementById('gts-theme-selector')) return;
        
        const selector = document.createElement('div');
        selector.id = 'gts-theme-selector';
        selector.className = 'gts-theme-selector';
        selector.innerHTML = `
            <button class="gts-theme-toggle" aria-label="Cambiar tema">
                <svg class="gts-theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            </button>
            <div class="gts-theme-dropdown" style="display: none;">
                <button class="gts-theme-option" data-theme="light">Claro</button>
                <button class="gts-theme-option" data-theme="dark">Oscuro</button>
                <button class="gts-theme-option" data-theme="corporate">Corporativo</button>
                <button class="gts-theme-option" data-theme="highContrast">Alto Contraste</button>
                <button class="gts-theme-option" data-theme="auto">Automático</button>
            </div>
        `;
        
        // Agregar estilos
        this.addThemeSelectorStyles();
        
        // Agregar al header si existe
        const header = document.querySelector('app-header, app-header-auth, .header');
        if (header) {
            const authButtons = header.querySelector('.auth-buttons');
            if (authButtons) {
                authButtons.appendChild(selector);
            } else {
                header.appendChild(selector);
            }
        } else {
            // Agregar al body si no hay header
            document.body.appendChild(selector);
        }
        
        // Event listeners
        this.setupThemeSelectorEvents(selector);
    }

    addThemeSelectorStyles() {
        if (document.getElementById('gts-theme-selector-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'gts-theme-selector-styles';
        style.textContent = `
            .gts-theme-selector {
                position: relative;
                display: inline-block;
            }
            
            .gts-theme-toggle {
                background: none;
                border: none;
                color: var(--gts-text-primary);
                cursor: pointer;
                padding: 0.5rem;
                border-radius: var(--border-radius);
                transition: all var(--transition-normal);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .gts-theme-toggle:hover {
                background: var(--gts-bg-secondary);
                transform: scale(1.1);
            }
            
            .gts-theme-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--gts-card-bg);
                border: 1px solid var(--gts-border);
                border-radius: var(--border-radius);
                box-shadow: var(--gts-shadow-lg);
                padding: 0.5rem;
                min-width: 150px;
                z-index: 1000;
                margin-top: 0.5rem;
            }
            
            .gts-theme-option {
                display: block;
                width: 100%;
                padding: 0.5rem 1rem;
                background: none;
                border: none;
                color: var(--gts-text-primary);
                cursor: pointer;
                text-align: left;
                border-radius: var(--border-radius);
                transition: all var(--transition-normal);
            }
            
            .gts-theme-option:hover {
                background: var(--gts-bg-secondary);
            }
            
            .gts-theme-option.active {
                background: var(--gts-primary);
                color: var(--gts-light);
            }
            
            .gts-theme-icon {
                transition: transform var(--transition-normal);
            }
            
            .gts-theme-toggle:hover .gts-theme-icon {
                transform: rotate(180deg);
            }
        `;
        document.head.appendChild(style);
    }

    setupThemeSelectorEvents(selector) {
        const toggle = selector.querySelector('.gts-theme-toggle');
        const dropdown = selector.querySelector('.gts-theme-dropdown');
        const options = selector.querySelectorAll('.gts-theme-option');
        
        // Toggle dropdown
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = dropdown.style.display !== 'none';
            dropdown.style.display = isVisible ? 'none' : 'block';
        });
        
        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', () => {
            dropdown.style.display = 'none';
        });
        
        // Seleccionar tema
        options.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.setTheme(theme);
                dropdown.style.display = 'none';
                
                // Actualizar estado activo
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
        
        // Marcar opción activa
        const activeOption = selector.querySelector(`[data-theme="${this.currentTheme}"]`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        Object.entries(theme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });

        this.currentTheme = themeName;
        this.storeTheme(themeName);
        
        // Actualizar atributo del body
        document.body.setAttribute('data-theme', themeName);
        
        // Disparar evento de cambio de tema
        document.dispatchEvent(new CustomEvent('gts-theme-changed', {
            detail: { theme: themeName }
        }));
    }

    setTheme(themeName) {
        if (themeName === 'auto') {
            this.userPreference = 'auto';
            this.applyTheme(this.systemPreference);
        } else {
            this.userPreference = themeName;
            this.applyTheme(themeName);
        }
        
        this.storeUserPreference(this.userPreference);
    }

    getStoredTheme() {
        return localStorage.getItem('gts-theme');
    }

    storeTheme(theme) {
        localStorage.setItem('gts-theme', theme);
    }

    getUserPreference() {
        return localStorage.getItem('gts-user-theme-preference') || 'auto';
    }

    storeUserPreference(preference) {
        localStorage.setItem('gts-user-theme-preference', preference);
    }

    getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    getThemeDisplayName(themeName) {
        const names = {
            light: 'Claro',
            dark: 'Oscuro',
            corporate: 'Corporativo',
            highContrast: 'Alto Contraste',
            auto: 'Automático'
        };
        return names[themeName] || themeName;
    }

    toggleTheme() {
        const themes = Object.keys(this.themes);
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }

    getAvailableThemes() {
        return Object.keys(this.themes);
    }

    // Obtener tema actual
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Verificar si es tema oscuro
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    // Verificar si es tema de alto contraste
    isHighContrast() {
        return this.currentTheme === 'highContrast';
    }
}

// Instancia global del gestor de temas
const gtsTheme = new GTSThemeManager();

// Agregar a la ventana global para acceso desde otros scripts
window.gtsTheme = gtsTheme;

// ===== FACTORY PARA CREAR COMPONENTES DEL MARKETPLACE =====
class GTSComponentFactory {
    constructor() {
        this.registeredComponents = new Map();
        this.componentTemplates = new Map();
        this.init();
    }

    init() {
        // Registrar componentes básicos
        this.registerBasicComponents();
        
        // Cargar templates de componentes
        this.loadComponentTemplates();
    }

    registerBasicComponents() {
        // Componente de tarjeta de producto
        this.registerComponent('product-card', {
            create: (data) => this.createProductCard(data),
            template: 'product-card-template',
            styles: 'product-card-styles'
        });

        // Componente de filtro
        this.registerComponent('filter-button', {
            create: (data) => this.createFilterButton(data),
            template: 'filter-button-template',
            styles: 'filter-button-styles'
        });

        // Componente de barra de búsqueda
        this.registerComponent('search-bar', {
            create: (data) => this.createSearchBar(data),
            template: 'search-bar-template',
            styles: 'search-bar-styles'
        });

        // Componente de paginación
        this.registerComponent('pagination', {
            create: (data) => this.createPagination(data),
            template: 'pagination-template',
            styles: 'pagination-styles'
        });

        // Componente de modal
        this.registerComponent('modal', {
            create: (data) => this.createModal(data),
            template: 'modal-template',
            styles: 'modal-styles'
        });
    }

    registerComponent(name, config) {
        this.registeredComponents.set(name, config);
    }

    createComponent(name, data = {}) {
        const componentConfig = this.registeredComponents.get(name);
        if (!componentConfig) {
            console.warn(`Componente no registrado: ${name}`);
            return null;
        }

        try {
            return componentConfig.create(data);
        } catch (error) {
            console.error(`Error creando componente ${name}:`, error);
            return null;
        }
    }

    // Factory para crear tarjeta de producto
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'gts-product-card gts-card gts-hover-lift';
        card.setAttribute('data-product-id', product.id);
        card.setAttribute('data-category', product.category || 'general');
        
        card.innerHTML = `
            <div class="gts-product-card-image">
                <img src="${product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCA4MEgxMjBWMTAwSDgwVjgwWiIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K'}" 
                     alt="${product.title}" 
                     class="gts-product-image gts-transition-transform"
                     loading="lazy">
                ${product.discount ? `<div class="gts-product-badge gts-product-discount">-${product.discount}%</div>` : ''}
                ${product.isNew ? `<div class="gts-product-badge gts-product-new">Nuevo</div>` : ''}
            </div>
            <div class="gts-product-card-content">
                <h3 class="gts-product-title">${product.title}</h3>
                <div class="gts-product-meta">
                    ${product.category ? `<span class="gts-product-category">${product.category}</span>` : ''}
                    ${product.rating ? `<div class="gts-product-rating">
                        <span class="gts-stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
                        <span class="gts-rating-text">(${product.rating})</span>
                    </div>` : ''}
                </div>
                <div class="gts-product-price">
                    <span class="gts-price-current">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice && product.originalPrice > product.price ? 
                        `<span class="gts-price-original">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="gts-product-button gts-btn gts-btn-primary gts-transition-all" 
                        onclick="window.gtsCart.addToCart('${product.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12l2 2 4-4"></path>
                        <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
                        <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
                        <path d="M9 12l2 2 4-4"></path>
                    </svg>
                    Agregar al carrito
                </button>
            </div>
        `;

        // Agregar animación de entrada
        card.classList.add('gts-animate-fade-in-up');
        
        // Event listeners
        this.addProductCardEvents(card, product);
        
        return card;
    }

    addProductCardEvents(card, product) {
        // Hover effects
        const image = card.querySelector('.gts-product-image');
        if (image) {
            card.addEventListener('mouseenter', () => {
                image.classList.add('gts-hover-scale');
            });
            
            card.addEventListener('mouseleave', () => {
                image.classList.remove('gts-hover-scale');
            });
        }

        // Click para ver detalles
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.gts-product-button')) {
                this.showProductDetails(product);
            }
        });
    }

    // Factory para crear botón de filtro
    createFilterButton(filterData) {
        const button = document.createElement('button');
        button.className = `gts-filter-btn ${filterData.isActive ? 'gts-active' : ''}`;
        button.setAttribute('data-category', filterData.category);
        button.setAttribute('data-filter-type', filterData.type || 'category');
        
        button.innerHTML = `
            ${filterData.icon ? `<i class="gts-filter-icon">${filterData.icon}</i>` : ''}
            <span class="gts-filter-text">${filterData.label}</span>
            ${filterData.count ? `<span class="gts-filter-count">(${filterData.count})</span>` : ''}
        `;
        
        // Event listeners
        button.addEventListener('click', () => {
            this.handleFilterClick(filterData);
        });
        
        return button;
    }

    // Factory para crear barra de búsqueda
    createSearchBar(config = {}) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'gts-search-container';
        searchContainer.innerHTML = `
            <div class="gts-search">
                <div class="gts-search-input-wrapper">
                    <svg class="gts-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input type="text" 
                           class="gts-search-input" 
                           placeholder="${config.placeholder || 'Buscar productos...'}"
                           aria-label="Buscar productos">
                    <button class="gts-search-clear" type="button" aria-label="Limpiar búsqueda" style="display: none;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <button class="gts-search-button gts-btn gts-btn-primary" type="submit">
                    Buscar
                </button>
            </div>
            ${config.showSuggestions ? '<div class="gts-search-suggestions"></div>' : ''}
        `;
        
        // Event listeners
        this.addSearchBarEvents(searchContainer, config);
        
        return searchContainer;
    }

    addSearchBarEvents(searchContainer, config) {
        const input = searchContainer.querySelector('.gts-search-input');
        const clearBtn = searchContainer.querySelector('.gts-search-clear');
        const suggestions = searchContainer.querySelector('.gts-search-suggestions');
        
        // Input events
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Mostrar/ocultar botón de limpiar
            clearBtn.style.display = query ? 'block' : 'none';
            
            // Mostrar sugerencias si está habilitado
            if (config.showSuggestions && query.length > 2) {
                this.showSearchSuggestions(query, suggestions);
            } else if (suggestions) {
                suggestions.innerHTML = '';
            }
            
            // Disparar evento de búsqueda
            searchContainer.dispatchEvent(new CustomEvent('gts-search-input', {
                detail: { query, config }
            }));
        });
        
        // Botón de limpiar
        clearBtn.addEventListener('click', () => {
            input.value = '';
            input.focus();
            clearBtn.style.display = 'none';
            if (suggestions) suggestions.innerHTML = '';
        });
        
        // Submit
        searchContainer.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = input.value.trim();
            if (query) {
                this.performSearch(query, config);
            }
        });
    }

    // Factory para crear paginación
    createPagination(paginationData) {
        const pagination = document.createElement('div');
        pagination.className = 'gts-pagination';
        
        const { currentPage, totalPages, totalItems, itemsPerPage } = paginationData;
        
        pagination.innerHTML = `
            <div class="gts-pagination-info">
                <span class="gts-pagination-text">
                    Mostrando ${((currentPage - 1) * itemsPerPage) + 1} - ${Math.min(currentPage * itemsPerPage, totalItems)} de ${totalItems} resultados
                </span>
            </div>
            <div class="gts-pagination-controls">
                <button class="gts-pagination-btn gts-pagination-prev" ${currentPage === 1 ? 'disabled' : ''}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15,18 9,12 15,6"></polyline>
                    </svg>
                    Anterior
                </button>
                
                <div class="gts-pagination-pages">
                    ${this.generatePageNumbers(currentPage, totalPages)}
                </div>
                
                <button class="gts-pagination-btn gts-pagination-next" ${currentPage === totalPages ? 'disabled' : ''}>
                    Siguiente
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                </button>
            </div>
        `;
        
        // Event listeners
        this.addPaginationEvents(pagination, paginationData);
        
        return pagination;
    }

    generatePageNumbers(currentPage, totalPages) {
        let pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages.map(page => {
            if (page === '...') {
                return '<span class="gts-pagination-ellipsis">...</span>';
            }
            return `<button class="gts-pagination-page ${page === currentPage ? 'gts-active' : ''}" data-page="${page}">${page}</button>`;
        }).join('');
    }

    addPaginationEvents(pagination, paginationData) {
        const prevBtn = pagination.querySelector('.gts-pagination-prev');
        const nextBtn = pagination.querySelector('.gts-pagination-next');
        const pages = pagination.querySelectorAll('.gts-pagination-page');
        
        // Botones de navegación
        prevBtn.addEventListener('click', () => {
            if (paginationData.currentPage > 1) {
                this.goToPage(paginationData.currentPage - 1);
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (paginationData.currentPage < paginationData.totalPages) {
                this.goToPage(paginationData.currentPage + 1);
            }
        });
        
        // Páginas específicas
        pages.forEach(pageBtn => {
            pageBtn.addEventListener('click', () => {
                const page = parseInt(pageBtn.dataset.page);
                this.goToPage(page);
            });
        });
    }

    // Factory para crear modal
    createModal(modalData) {
        const modal = document.createElement('div');
        modal.className = 'gts-modal';
        modal.setAttribute('data-modal-id', modalData.id || 'gts-modal');
        
        modal.innerHTML = `
            <div class="gts-modal-overlay"></div>
            <div class="gts-modal-container">
                <div class="gts-modal-header">
                    <h3 class="gts-modal-title">${modalData.title || 'Modal'}</h3>
                    <button class="gts-modal-close" aria-label="Cerrar modal">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="gts-modal-body">
                    ${modalData.content || ''}
                </div>
                ${modalData.footer ? `
                    <div class="gts-modal-footer">
                        ${modalData.footer}
                    </div>
                ` : ''}
            </div>
        `;
        
        // Event listeners
        this.addModalEvents(modal, modalData);
        
        return modal;
    }

    addModalEvents(modal, modalData) {
        const overlay = modal.querySelector('.gts-modal-overlay');
        const closeBtn = modal.querySelector('.gts-modal-close');
        const container = modal.querySelector('.gts-modal-container');
        
        // Cerrar modal
        const closeModal = () => {
            modal.classList.add('gts-modal-closing');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
                // Disparar evento de cierre
                document.dispatchEvent(new CustomEvent('gts-modal-closed', {
                    detail: { modalId: modalData.id }
                }));
            }, 300);
        };
        
        // Event listeners para cerrar
        overlay.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('gts-modal-open')) {
                closeModal();
            }
        });
        
        // Prevenir cierre al hacer clic en el contenido
        container.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Abrir modal
        setTimeout(() => {
            modal.classList.add('gts-modal-open');
        }, 10);
    }

    // Métodos de utilidad
    handleFilterClick(filterData) {
        // Disparar evento de filtro
        document.dispatchEvent(new CustomEvent('gts-filter-changed', {
            detail: filterData
        }));
    }

    showProductDetails(product) {
        // Crear modal con detalles del producto
        const modalData = {
            id: 'product-details',
            title: product.title,
            content: `
                <div class="gts-product-details">
                    <img src="${product.image}" alt="${product.title}" class="gts-product-detail-image">
                    <div class="gts-product-detail-info">
                        <h4>${product.title}</h4>
                        <p class="gts-product-description">${product.description || 'Sin descripción disponible.'}</p>
                        <div class="gts-product-price">$${product.price.toFixed(2)}</div>
                        <button class="gts-btn gts-btn-primary" onclick="window.gtsCart.addToCart('${product.id}')">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            `
        };
        
        const modal = this.createModal(modalData);
        document.body.appendChild(modal);
    }

    showSearchSuggestions(query, suggestionsContainer) {
        // Implementar lógica de sugerencias
        const suggestions = this.getSearchSuggestions(query);
        
        suggestionsContainer.innerHTML = suggestions.map(suggestion => `
            <div class="gts-search-suggestion" onclick="this.selectSuggestion('${suggestion}')">
                ${suggestion}
            </div>
        `).join('');
    }

    getSearchSuggestions(query) {
        // Implementar lógica de sugerencias basada en productos
        // Por ahora retornamos sugerencias de ejemplo
        return [
            `${query} comida`,
            `${query} restaurante`,
            `${query} delivery`
        ];
    }

    performSearch(query, config) {
        // Disparar evento de búsqueda
        document.dispatchEvent(new CustomEvent('gts-search-performed', {
            detail: { query, config }
        }));
    }

    goToPage(page) {
        // Disparar evento de cambio de página
        document.dispatchEvent(new CustomEvent('gts-page-changed', {
            detail: { page }
        }));
    }

    loadComponentTemplates() {
        // Cargar templates desde archivos o definir inline
        // Por ahora los templates están inline en los métodos create
    }
}

// Instancia global del factory de componentes
const gtsComponentFactory = new GTSComponentFactory();

// Agregar a la ventana global para acceso desde otros scripts
window.gtsComponentFactory = gtsComponentFactory;

// ===== SISTEMA DE MÉTRICAS Y ANALYTICS =====
class GTSAnalytics {
    constructor() {
        this.events = [];
        this.sessionStart = Date.now();
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.pageViews = [];
        this.userInteractions = [];
        this.performanceMetrics = {};
        this.config = {
            enableTracking: true,
            enableConsoleLog: false,
            maxEvents: 1000,
            batchSize: 10,
            flushInterval: 30000 // 30 segundos
        };
        
        this.init();
    }

    init() {
        if (!this.config.enableTracking) return;
        
        // Trackear eventos de página
        this.trackPageView();
        
        // Trackear interacciones del usuario
        this.setupUserInteractionTracking();
        
        // Trackear rendimiento
        this.setupPerformanceTracking();
        
        // Trackear errores
        this.setupErrorTracking();
        
        // Trackear cambios de conectividad
        this.setupConnectivityTracking();
        
        // Configurar envío en lotes
        this.setupBatchSending();
        
        // Trackear eventos de la aplicación
        this.setupAppEventTracking();
    }

    generateSessionId() {
        return 'gts-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    getUserId() {
        let userId = localStorage.getItem('gts-user-id');
        if (!userId) {
            userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('gts-user-id', userId);
        }
        return userId;
    }

    trackEvent(eventName, properties = {}) {
        if (!this.config.enableTracking) return;
        
        const event = {
            id: this.generateEventId(),
            name: eventName,
            properties,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        this.events.push(event);
        
        // Limitar número de eventos en memoria
        if (this.events.length > this.config.maxEvents) {
            this.events = this.events.slice(-this.config.maxEvents);
        }
        
        // Enviar a analytics externos si están disponibles
        this.sendToExternalAnalytics(event);
        
        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('gts-analytics-event', {
            detail: event
        }));
        
        // Log en consola si está habilitado
        if (this.config.enableConsoleLog) {
            console.log('GTS Analytics Event:', event);
        }
        
        return event.id;
    }

    generateEventId() {
        return 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    trackPageView() {
        const pageData = {
            page_title: document.title,
            page_url: window.location.href,
            referrer: document.referrer,
            load_time: this.getPageLoadTime()
        };
        
        this.trackEvent('page_view', pageData);
        
        // Agregar a historial de páginas
        this.pageViews.push({
            ...pageData,
            timestamp: Date.now()
        });
    }

    setupUserInteractionTracking() {
        // Trackear clics en productos
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Productos
            if (target.closest('.gts-product-card, .item')) {
                const productCard = target.closest('.gts-product-card, .item');
                const productId = productCard.dataset.productId;
                const productTitle = productCard.querySelector('.gts-product-title, .titulo-item')?.textContent;
                
                this.trackEvent('product_click', {
                    product_id: productId,
                    product_title: productTitle,
                    click_position: this.getClickPosition(e),
                    element_type: 'product_card'
                });
            }
            
            // Botones de carrito
            if (target.closest('.gts-product-button, .boton-item')) {
                const button = target.closest('.gts-product-button, .boton-item');
                const productId = button.closest('[data-product-id]')?.dataset.productId;
                
                this.trackEvent('add_to_cart_click', {
                    product_id: productId,
                    button_text: button.textContent.trim(),
                    click_position: this.getClickPosition(e)
                });
            }
            
            // Filtros
            if (target.closest('.gts-filter-btn, .filter-pill')) {
                const filter = target.closest('.gts-filter-btn, .filter-pill');
                const category = filter.dataset.category;
                
                this.trackEvent('filter_click', {
                    filter_category: category,
                    filter_text: filter.textContent.trim(),
                    click_position: this.getClickPosition(e)
                });
            }
            
            // Búsquedas
            if (target.closest('.gts-search-button, .search-btn')) {
                const searchInput = document.querySelector('.gts-search-input, #product-search');
                if (searchInput) {
                    this.trackEvent('search_submit', {
                        search_query: searchInput.value.trim(),
                        click_position: this.getClickPosition(e)
                    });
                }
            }
        });

        // Trackear búsquedas en tiempo real
        document.addEventListener('input', (e) => {
            if (e.target.matches('.gts-search-input, #product-search')) {
                const query = e.target.value.trim();
                if (query.length > 2) {
                    this.trackEvent('search_input', {
                        search_term: query,
                        search_length: query.length
                    });
                }
            }
        });

        // Trackear scroll
        let scrollTimeout;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                this.trackEvent('scroll_depth', {
                    scroll_percentage: scrollDepth,
                    scroll_position: window.scrollY
                });
            }, 100);
        });

        // Trackear tiempo en página
        let timeOnPage = 0;
        setInterval(() => {
            timeOnPage += 10;
            if (timeOnPage % 30 === 0) { // Cada 30 segundos
                this.trackEvent('time_on_page', {
                    seconds: timeOnPage,
                    page: window.location.pathname
                });
            }
        }, 10000);
    }

    setupPerformanceTracking() {
        // Métricas de carga de página
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    const metrics = {
                        load_time: perfData.loadEventEnd - perfData.loadEventStart,
                        dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        first_paint: this.getFirstPaint(),
                        first_contentful_paint: this.getFirstContentfulPaint(),
                        largest_contentful_paint: this.getLargestContentfulPaint(),
                        cumulative_layout_shift: this.getCumulativeLayoutShift()
                    };
                    
                    this.performanceMetrics = metrics;
                    this.trackEvent('page_performance', metrics);
                }
            });
        }
        
        // Métricas de recursos
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'resource') {
                        this.trackEvent('resource_load', {
                            resource_name: entry.name,
                            resource_type: entry.initiatorType,
                            duration: entry.duration,
                            size: entry.transferSize
                        });
                    }
                });
            });
            
            try {
                resourceObserver.observe({ entryTypes: ['resource'] });
            } catch (e) {
                console.warn('PerformanceObserver not supported');
            }
        }
    }

    setupErrorTracking() {
        // Errores de JavaScript
        window.addEventListener('error', (e) => {
            this.trackEvent('javascript_error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error?.stack || e.error?.message || 'Unknown error'
            });
        });

        // Errores de promesas rechazadas
        window.addEventListener('unhandledrejection', (e) => {
            this.trackEvent('promise_rejection', {
                reason: e.reason?.message || e.reason || 'Unknown reason',
                promise: e.promise
            });
        });

        // Errores de recursos
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                this.trackEvent('resource_error', {
                    resource_type: e.target.tagName,
                    resource_src: e.target.src || e.target.href,
                    error_type: 'resource_load_failed'
                });
            }
        }, true);
    }

    setupConnectivityTracking() {
        // Cambios de conectividad
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            this.trackEvent('connection_info', {
                effective_type: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                save_data: connection.saveData
            });
            
            connection.addEventListener('change', () => {
                this.trackEvent('connection_change', {
                    effective_type: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt
                });
            });
        }
        
        // Estado online/offline
        window.addEventListener('online', () => {
            this.trackEvent('connection_status', { status: 'online' });
        });
        
        window.addEventListener('offline', () => {
            this.trackEvent('connection_status', { status: 'offline' });
        });
    }

    setupAppEventTracking() {
        // Eventos del carrito
        document.addEventListener('cart-updated', (e) => {
            this.trackEvent('cart_updated', {
                cart_items: e.detail.itemCount,
                cart_total: e.detail.total,
                action: e.detail.action
            });
        });

        // Eventos de autenticación
        document.addEventListener('user-auth-changed', (e) => {
            this.trackEvent('auth_status_changed', {
                action: e.detail.action,
                user_id: e.detail.user?.uid || 'anonymous'
            });
        });

        // Eventos de tema
        document.addEventListener('gts-theme-changed', (e) => {
            this.trackEvent('theme_changed', {
                theme: e.detail.theme,
                previous_theme: this.getCurrentTheme()
            });
        });

        // Eventos de filtros
        document.addEventListener('gts-filter-changed', (e) => {
            this.trackEvent('filter_applied', {
                filter_type: e.detail.type,
                filter_value: e.detail.category,
                filter_label: e.detail.label
            });
        });

        // Eventos de búsqueda
        document.addEventListener('gts-search-performed', (e) => {
            this.trackEvent('search_performed', {
                query: e.detail.query,
                results_count: this.getSearchResultsCount()
            });
        });
    }

    setupBatchSending() {
        // Enviar eventos en lotes cada cierto tiempo
        setInterval(() => {
            this.flushEvents();
        }, this.config.flushInterval);
        
        // Enviar eventos antes de que el usuario abandone la página
        window.addEventListener('beforeunload', () => {
            this.flushEvents(true);
        });
    }

    flushEvents(immediate = false) {
        if (this.events.length === 0) return;
        
        const eventsToSend = this.events.splice(0, this.config.batchSize);
        
        // Enviar a servidor (implementar según necesidades)
        this.sendEventsToServer(eventsToSend);
        
        // Enviar a Google Analytics si está disponible
        if (typeof gtag !== 'undefined') {
            eventsToSend.forEach(event => {
                gtag('event', event.name, {
                    ...event.properties,
                    event_category: 'GTS',
                    event_label: event.page,
                    value: event.timestamp
                });
            });
        }
    }

    sendEventsToServer(events) {
        // Implementar envío a servidor propio
        if (window.gtsData) {
            try {
                window.gtsData.postData('/api/analytics/events', { events });
            } catch (error) {
                console.warn('No se pudieron enviar eventos al servidor:', error);
            }
        }
    }

    sendToExternalAnalytics(event) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', event.name, {
                ...event.properties,
                event_category: 'GTS',
                event_label: event.page,
                value: event.timestamp
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', event.name, event.properties);
        }
        
        // Hotjar
        if (window.hj) {
            window.hj('event', event.name);
        }
    }

    // Métodos de utilidad
    getClickPosition(event) {
        return {
            x: event.clientX,
            y: event.clientY,
            page_x: event.pageX,
            page_y: event.pageY
        };
    }

    getPageLoadTime() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            return perfData ? perfData.loadEventEnd - perfData.loadEventStart : 0;
        }
        return 0;
    }

    getFirstPaint() {
        if ('PerformanceObserver' in window) {
            const paintEntries = performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
            return firstPaint ? firstPaint.startTime : 0;
        }
        return 0;
    }

    getFirstContentfulPaint() {
        if ('PerformanceObserver' in window) {
            const paintEntries = performance.getEntriesByType('paint');
            const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            return fcp ? fcp.startTime : 0;
        }
        return 0;
    }

    getLargestContentfulPaint() {
        if ('PerformanceObserver' in window) {
            const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
            const lcp = lcpEntries[lcpEntries.length - 1];
            return lcp ? lcp.startTime : 0;
        }
        return 0;
    }

    getCumulativeLayoutShift() {
        if ('PerformanceObserver' in window) {
            const clsEntries = performance.getEntriesByType('layout-shift');
            return clsEntries.reduce((sum, entry) => sum + entry.value, 0);
        }
        return 0;
    }

    getCurrentTheme() {
        return window.gtsTheme ? window.gtsTheme.getCurrentTheme() : 'unknown';
    }

    getSearchResultsCount() {
        // Implementar según la estructura de la página
        const results = document.querySelectorAll('.gts-product-card, .item');
        return results.length;
    }

    // Métodos de conveniencia
    trackProductView(productId, productTitle) {
        return this.trackEvent('product_view', {
            product_id: productId,
            product_title: productTitle
        });
    }

    trackPurchase(orderData) {
        return this.trackEvent('purchase', {
            order_id: orderData.orderId,
            total: orderData.total,
            items: orderData.items,
            currency: orderData.currency || 'USD'
        });
    }

    trackUserRegistration(userData) {
        return this.trackEvent('user_registration', {
            user_id: userData.uid,
            method: userData.method || 'email'
        });
    }

    trackUserLogin(userData) {
        return this.trackEvent('user_login', {
            user_id: userData.uid,
            method: userData.method || 'email'
        });
    }

    // Obtener estadísticas
    getStats() {
        return {
            totalEvents: this.events.length,
            sessionDuration: Date.now() - this.sessionStart,
            pageViews: this.pageViews.length,
            userInteractions: this.userInteractions.length,
            performanceMetrics: this.performanceMetrics,
            sessionId: this.sessionId,
            userId: this.userId
        };
    }

    // Exportar datos
    exportData() {
        return {
            events: this.events,
            pageViews: this.pageViews,
            userInteractions: this.userInteractions,
            performanceMetrics: this.performanceMetrics,
            stats: this.getStats()
        };
    }

    // Limpiar datos
    clearData() {
        this.events = [];
        this.pageViews = [];
        this.userInteractions = [];
        this.performanceMetrics = {};
    }

    // Configurar analytics
    configure(config) {
        this.config = { ...this.config, ...config };
    }
}

// Instancia global del sistema de analytics
const gtsAnalytics = new GTSAnalytics();

// Agregar a la ventana global para acceso desde otros scripts
window.gtsAnalytics = gtsAnalytics; 