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
    const componentPromises = [
      this.loadComponent('#header-placeholder', 'components/header.html'),
      this.loadComponent('#footer-placeholder', 'components/footer.html')
    ];
    
    await Promise.all(componentPromises);
    
    // Inicializar funcionalidad específica de componentes
    this.initializeNavigation();
    this.initializeCart();
    this.initializeNewsletter();
  }

  /**
   * Inicializa la funcionalidad de navegación
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
   * Inicializa la funcionalidad del carrito
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
   * Inicializa los formularios de newsletter
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
   * Maneja el envío de formularios de newsletter
   * @param {HTMLFormElement} form - Formulario de newsletter
   */
  static handleNewsletterSubmission(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput?.value.trim();
    
    if (!email || !this.isValidEmail(email)) {
      this.showNewsletterError(form, 'Por favor ingresa un email válido');
      return;
    }
    
    // Simular envío exitoso
    this.showNewsletterSuccess(form);
    emailInput.value = '';
  }

  /**
   * Valida formato de email
   * @param {string} email - Email a validar
   * @returns {boolean} - True si es válido
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Muestra mensaje de error en newsletter
   * @param {HTMLFormElement} form - Formulario
   * @param {string} message - Mensaje de error
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
   * Muestra mensaje de éxito en newsletter
   * @param {HTMLFormElement} form - Formulario
   */
  static showNewsletterSuccess(form) {
    let successElement = form.querySelector('.newsletter-success');
    if (!successElement) {
      successElement = document.createElement('div');
      successElement.className = 'newsletter-success';
      form.appendChild(successElement);
    }
    
    successElement.textContent = '¡Gracias por suscribirte!';
    successElement.style.display = 'block';
    
    setTimeout(() => {
      successElement.style.display = 'none';
    }, 3000);
  }

  /**
   * Renderiza un template con datos dinámicos
   * @param {string} template - Template HTML con placeholders
   * @param {Object} data - Datos para reemplazar placeholders
   * @returns {string} - HTML renderizado
   */
  static renderTemplate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
  }

  /**
   * Carga y renderiza productos dinámicamente
   * @param {string} containerSelector - Selector del contenedor
   * @param {Array} products - Array de productos
   * @param {number} limit - Límite de productos a mostrar
   */
  static async renderProducts(containerSelector, products, limit = null) {
    try {
      const response = await fetch('components/product-card.html');
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
   * Inicializa eventos de productos (carrito, etc.)
   * @param {HTMLElement} container - Contenedor de productos
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
   * Maneja agregar productos al carrito
   * @param {string} productId - ID del producto
   * @param {HTMLElement} button - Botón clickeado
   */
  static handleAddToCart(productId, button) {
    const quantityInput = button.closest('.product-card').querySelector('.quantity-input');
    const quantity = parseInt(quantityInput?.value || 1);
    
    // Simular agregar al carrito
    button.textContent = 'Agregado ✓';
    button.disabled = true;
    
    setTimeout(() => {
      button.textContent = 'Agregar al Carrito';
      button.disabled = false;
    }, 2000);
    
    // Aquí se integraría con el sistema de carrito
    console.log(`Adding product ${productId} with quantity ${quantity}`);
  }

  /**
   * Maneja cambios en cantidad de productos
   * @param {string} productId - ID del producto
   * @param {boolean} isPlus - Si es incremento o decremento
   * @param {HTMLElement} button - Botón clickeado
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

// Inicializar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  ComponentLoader.initializeComponents();
}); 