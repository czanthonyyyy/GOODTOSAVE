/**
 * FoodSaver Marketplace - Main Application
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
      const response = await fetch('assets/data/products.json');
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
      case 'marketplace.html':
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
      case 'login.html':
        this.initializeLoginPage();
        break;
      case 'register.html':
        this.initializeRegisterPage();
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
    this.loadFeaturedProducts();
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
   * Carga productos destacados
   */
  async loadFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-products-grid');
    if (featuredGrid && this.products.length > 0) {
      const featuredProducts = this.products.slice(0, 4);
      await ComponentLoader.renderProducts('#featured-products-grid', featuredProducts);
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
      const response = await fetch('assets/data/team.json');
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
      window.location.href = 'qr.html';
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
   * Inicializa página de login
   */
  initializeLoginPage() {
    this.setupAuthForm('login-form');
  }

  /**
   * Inicializa página de registro
   */
  initializeRegisterPage() {
    this.setupAuthForm('register-form');
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
  handleAuthSubmission(form) {
    const submitBtn = form.querySelector('.auth-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      // Simular éxito de autenticación
      if (form.id === 'login-form') {
        window.location.href = 'marketplace.html';
      } else {
        window.location.href = 'login.html';
      }
    }, 1500);
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