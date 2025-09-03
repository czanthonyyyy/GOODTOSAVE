/**
 * Component Loader System
 * Carga componentes HTML reutilizables de manera dinámica
 */
class ComponentLoader {
  /**
   * Carga un componente HTML desde una ruta específica
   * @param {string} selector - Selector CSS del elemento contenedor
   * @param {string} componentPath - Ruta al archivo del componente
   * @returns {Promise<boolean>} - True si se cargó exitosamente
   */
  static async loadComponent(selector, componentPath) {
    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${componentPath}`);
      }
      const html = await response.text();
      const targetElement = document.querySelector(selector);
      
      if (targetElement) {
        targetElement.innerHTML = html;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Component loading error:', error);
      return false;
    }
  }

  /**
   * Inicializa todos los componentes de la página
   */
  static async initializeComponents() {
    // Verificar si estamos usando web components
    const hasWebComponents = document.querySelector('app-header') || document.querySelector('app-footer');
    
    if (hasWebComponents) {
      console.log('Using web components, skipping HTML component loading');
      // Inicializar funcionalidad específica de componentes
      this.initializeNavigation();
      this.initializeCart();
      this.initializeNewsletter();
      return;
    }
    
    // Solo cargar componentes HTML si no hay web components
    const componentPromises = [
              this.loadComponent('#header-placeholder', '../components/header.html'),
              this.loadComponent('#footer-placeholder', '../components/footer.html')
    ];
    
    await Promise.all(componentPromises);
    
    // Inicializar funcionalidad específica de componentes
    this.initializeNavigation();
    this.initializeCart();
    this.initializeNewsletter();
  }

  /**
   * Initializes navigation functionality
   */
  static initializeNavigation() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('nav-menu-open');
        mobileToggle.classList.toggle('active');
      });
    }
    
    // Active page highlighting
    this.highlightActivePage();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar') && navMenu?.classList.contains('nav-menu-open')) {
        navMenu.classList.remove('nav-menu-open');
        mobileToggle?.classList.remove('active');
      }
    });
  }

  /**
   * Resalta la página activa en la navegación
   */
  static highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('nav-link-active');
      }
    });
  }

  /**
   * Initializes cart functionality
   */
  static initializeCart() {
    const cartToggle = document.getElementById('cart-toggle');
    if (cartToggle) {
      cartToggle.addEventListener('click', () => {
        window.ShoppingCart?.toggleCart();
      });
    }
  }

  /**
   * Initializes newsletter forms
   */
  static initializeNewsletter() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNewsletterSubmission(form);
      });
    });
  }

  /**
   * Handles newsletter form submission
   * @param {HTMLFormElement} form - Newsletter form
   */
  static handleNewsletterSubmission(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput?.value.trim();
    
    if (!email || !this.isValidEmail(email)) {
      this.showNewsletterError(form, 'Please enter a valid email');
      return;
    }
    
    // Simular envío exitoso
    this.showNewsletterSuccess(form);
    emailInput.value = '';
  }

  /**
   * Validates email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Shows newsletter error message
   * @param {HTMLFormElement} form - Form
   * @param {string} message - Error message
   */
  static showNewsletterError(form, message) {
    let errorElement = form.querySelector('.newsletter-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'newsletter-error';
      form.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 3000);
  }

  /**
   * Shows newsletter success message
   * @param {HTMLFormElement} form - Form
   */
  static showNewsletterSuccess(form) {
    let successElement = form.querySelector('.newsletter-success');
    if (!successElement) {
      successElement = document.createElement('div');
      successElement.className = 'newsletter-success';
      form.appendChild(successElement);
    }
    
    successElement.textContent = 'Thanks for subscribing!';
    successElement.style.display = 'block';
    
    setTimeout(() => {
      successElement.style.display = 'none';
    }, 3000);
  }

  /**
   * Renders a template with dynamic data
   * @param {string} template - HTML template with placeholders
   * @param {Object} data - Data for placeholders
   * @returns {string} - Rendered HTML
   */
  static renderTemplate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
  }

  /**
   * Loads and renders products dynamically
   * @param {string} containerSelector - Container selector
   * @param {Array} products - Product array
   * @param {number} limit - Limit of products to show
   */
  static async renderProducts(containerSelector, products, limit = null) {
    try {
              const response = await fetch('../components/product-card.html');
      const template = await response.text();
      
      const container = document.querySelector(containerSelector);
      if (!container) return;
      
      const productsToRender = limit ? products.slice(0, limit) : products;
      const renderedProducts = productsToRender.map(product => {
        return this.renderTemplate(template, product);
      });
      
      container.innerHTML = renderedProducts.join('');
      
      // Inicializar eventos de productos
      this.initializeProductEvents(container);
      
    } catch (error) {
      console.error('Error rendering products:', error);
    }
  }

  /**
   * Initializes product events (cart, etc.)
   * @param {HTMLElement} container - Product container
   */
  static initializeProductEvents(container) {
    // Add to cart buttons
    const addToCartButtons = container.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = button.dataset.productId;
        this.handleAddToCart(productId, button);
      });
    });

    // Quantity controls
    const quantityButtons = container.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = button.dataset.productId;
        const isPlus = button.classList.contains('quantity-btn--plus');
        this.handleQuantityChange(productId, isPlus, button);
      });
    });
  }

  /**
   * Handles add-to-cart
   * @param {string} productId - Product ID
   * @param {HTMLElement} button - Clicked button
   */
  static handleAddToCart(productId, button) {
    const quantityInput = button.closest('.product-card').querySelector('.quantity-input');
    const quantity = parseInt(quantityInput?.value || 1);
    
    // Simular agregar al carrito
    button.textContent = 'Added ✓';
    button.disabled = true;
    
    setTimeout(() => {
      button.textContent = 'Add to Cart';
      button.disabled = false;
    }, 2000);
    
    // Aquí se integraría con el sistema de carrito
    console.log(`Adding product ${productId} with quantity ${quantity}`);
  }

  /**
   * Handles quantity changes
   * @param {string} productId - Product ID
   * @param {boolean} isPlus - Increment or decrement
   * @param {HTMLElement} button - Clicked button
   */
  static handleQuantityChange(productId, isPlus, button) {
    const quantityInput = button.closest('.product-card').querySelector('.quantity-input');
    if (!quantityInput) return;
    
    let currentValue = parseInt(quantityInput.value) || 1;
    const maxValue = parseInt(quantityInput.max) || 999;
    
    if (isPlus && currentValue < maxValue) {
      currentValue++;
    } else if (!isPlus && currentValue > 1) {
      currentValue--;
    }
    
    quantityInput.value = currentValue;
  }
}

/**
 * Función para obtener la ruta correcta de autenticación según la página actual
 * @returns {string} Ruta correcta para auth.html
 */
function getAuthPath() {
    try {
        const current = window.location.pathname;
        // Normalizar: eliminar posible nombre de archivo, quedarnos con carpeta
        // y calcular ruta relativa a /public
        // Casos:
        // - /public/index.html -> auth/auth.html
        // - /public/pages/guide.html -> ../auth/auth.html
        // - /public/auth/auth.html -> auth.html
        if (current.includes('/auth/')) return 'auth.html';
        if (current.includes('/pages/') || current.includes('/marketplace/')) return '../auth/auth.html';
        return 'auth/auth.html';
    } catch (e) {
        // Fallback seguro
        return 'auth/auth.html';
    }
}

/**
 * Actualiza todos los enlaces de autenticación con la ruta correcta
 */
function updateAuthLinks() {
    const authLinks = document.querySelectorAll('a[href="auth.html"], a[href="pages/auth.html"], a[href="auth/auth.html"], a[data-auth-link]');
    
    authLinks.forEach(link => {
        link.href = getAuthPath();
    });
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    updateAuthLinks();
});

// También ejecutar cuando se carguen los web components
document.addEventListener('web-components-ready', function() {
    updateAuthLinks();
});

// Inicializar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  ComponentLoader.initializeComponents();
}); 