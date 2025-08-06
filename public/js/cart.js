/**
 * Shopping Cart System
 * Maneja toda la funcionalidad del carrito de compras
 */
class ShoppingCart {
  constructor() {
    this.items = this.loadFromStorage() || [];
    this.isOpen = false;
    this.element = null;
    this.init();
  }

  /**
   * Inicializa el carrito
   */
  init() {
    // Solo inicializar en páginas que necesitan carrito
    if (this.shouldInitializeCart()) {
      this.createCartElement();
      this.updateCartDisplay();
      this.bindEvents();
    } else {
      // Solo actualizar el contador del header
      this.updateCartCount();
    }
  }

  /**
   * Determina si el carrito debe inicializarse en esta página
   * @returns {boolean} - True si debe inicializarse
   */
  shouldInitializeCart() {
    const currentPage = window.location.pathname;
    const cartPages = [
      '/marketplace.html',
      '/payment.html',
      '/qr.html'
    ];
    
    // También inicializar si estamos en el directorio raíz y no es index.html
    if (currentPage === '/' || currentPage === '/index.html') {
      return false;
    }
    
    return cartPages.some(page => currentPage.includes(page));
  }

  /**
   * Crea el elemento del carrito si no existe
   */
  createCartElement() {
    if (!this.element) {
      this.element = document.getElementById('cart-drawer');
      if (!this.element) {
        this.element = this.createCartHTML();
        document.body.appendChild(this.element);
      }
      
      // Asegurar que el carrito esté cerrado por defecto
      this.isOpen = false;
      this.element.classList.remove('cart-open');
      
      // Asegurar que el overlay esté cerrado por defecto
      const overlay = document.getElementById('cart-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }
    }
  }

  /**
   * Crea el HTML del carrito
   * @returns {HTMLElement} - Elemento del carrito
   */
  createCartHTML() {
    const cartHTML = `
      <div class="cart-drawer" id="cart-drawer">
        <div class="cart-drawer__header">
          <h3 class="cart-drawer__title">Carrito de Compras</h3>
          <button class="cart-close-btn" id="cart-close-btn">×</button>
        </div>
        
        <div class="cart-drawer__content" id="cart-content">
          <!-- Cart items will be loaded here -->
        </div>
        
        <div class="cart-drawer__footer">
          <div class="cart-total">
            <span>Total:</span>
            <span id="cart-total">€0.00</span>
          </div>
          <div class="cart-actions">
            <button class="btn btn-outline" id="continue-shopping">Seguir Comprando</button>
            <button class="btn btn-primary" id="checkout-btn">Proceder al Pago</button>
          </div>
        </div>
      </div>
      
      <div class="cart-overlay" id="cart-overlay"></div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cartHTML;
    return tempDiv.firstElementChild;
  }

  /**
   * Agrega un producto al carrito
   * @param {Object} product - Producto a agregar
   * @param {number} quantity - Cantidad a agregar
   */
  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        title: product.title,
        price: product.discountedPrice,
        image: product.image,
        quantity: quantity,
        supplier: product.supplier,
        originalPrice: product.originalPrice
      });
    }

    this.saveToStorage();
    this.updateCartDisplay();
    this.showAddedToCartFeedback(product);
  }

  /**
   * Remueve un producto del carrito
   * @param {string|number} productId - ID del producto a remover
   */
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
    this.updateCartDisplay();
  }

  /**
   * Actualiza la cantidad de un producto
   * @param {string|number} productId - ID del producto
   * @param {number} newQuantity - Nueva cantidad
   */
  updateQuantity(productId, newQuantity) {
    const item = this.items.find(item => item.id == productId);
    if (item) {
      item.quantity = Math.max(0, newQuantity);
      if (item.quantity === 0) {
        this.removeItem(productId);
      } else {
        this.saveToStorage();
        this.updateCartDisplay();
      }
    }
  }

  /**
   * Calcula el total del carrito
   * @returns {number} - Total del carrito
   */
  calculateTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  /**
   * Calcula el total de items en el carrito
   * @returns {number} - Total de items
   */
  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Limpia el carrito
   */
  clear() {
    this.items = [];
    this.saveToStorage();
    this.updateCartDisplay();
  }

  /**
   * Guarda el carrito en localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('foodmarketplace_cart', JSON.stringify(this.items));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }

  /**
   * Carga el carrito desde localStorage
   * @returns {Array} - Items del carrito
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('foodmarketplace_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
      return [];
    }
  }

  /**
   * Actualiza la visualización del carrito
   */
  updateCartDisplay() {
    this.updateCartCount();
    if (this.shouldInitializeCart()) {
      this.renderCartItems();
      this.updateCartTotal();
    }
  }

  /**
   * Actualiza el contador de items en el header
   */
  updateCartCount() {
    const totalItems = this.getTotalItems();
    
    // Actualizar contador en el web component del header
    if (window.updateCartCount) {
      window.updateCartCount(totalItems);
    }
    
    // También actualizar contadores tradicionales si existen
    const countElements = document.querySelectorAll('#cart-count');
    countElements.forEach(element => {
      element.textContent = totalItems;
      element.style.display = totalItems > 0 ? 'block' : 'none';
    });
  }

  /**
   * Renderiza los items del carrito
   */
  renderCartItems() {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    if (this.items.length === 0) {
      cartContent.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega algunos productos para comenzar</p>
        </div>
      `;
      return;
    }

    const itemsHTML = this.items.map(item => `
      <div class="cart-item" data-product-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" class="cart-item__image">
        <div class="cart-item__details">
          <h4 class="cart-item__title">${item.title}</h4>
          <p class="cart-item__supplier">${item.supplier}</p>
          <div class="cart-item__controls">
            <div class="cart-item__quantity">
              <button class="quantity-btn quantity-btn--minus" data-product-id="${item.id}">-</button>
              <span class="quantity-value">${item.quantity}</span>
              <button class="quantity-btn quantity-btn--plus" data-product-id="${item.id}">+</button>
            </div>
            <div class="cart-item__price">€${(item.price * item.quantity).toFixed(2)}</div>
            <button class="cart-item__remove" data-product-id="${item.id}">×</button>
          </div>
        </div>
      </div>
    `).join('');

    cartContent.innerHTML = itemsHTML;
  }

  /**
   * Actualiza el total del carrito
   */
  updateCartTotal() {
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
      const total = this.calculateTotal();
      totalElement.textContent = `€${total.toFixed(2)}`;
    }
  }

  /**
   * Muestra feedback cuando se agrega un producto
   * @param {Object} product - Producto agregado
   */
  showAddedToCartFeedback(product) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span>✓ ${product.title} agregado al carrito</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  /**
   * Abre/cierra el carrito
   */
  toggleCart() {
    if (!this.shouldInitializeCart()) {
      // Si no estamos en una página con carrito, redirigir al marketplace
      window.location.href = 'pages/marketplace.html';
      return;
    }
    
    this.isOpen = !this.isOpen;
    this.element.classList.toggle('cart-open', this.isOpen);
    
    // Usar el elemento overlay correcto
    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
      overlay.classList.toggle('active', this.isOpen);
    }
  }

  /**
   * Cierra el carrito
   */
  closeCart() {
    this.isOpen = false;
    this.element.classList.remove('cart-open');
    
    // Usar el elemento overlay correcto
    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }

  /**
   * Abre el carrito
   */
  openCart() {
    if (!this.shouldInitializeCart()) {
      // Si no estamos en una página con carrito, redirigir al marketplace
      window.location.href = 'pages/marketplace.html';
      return;
    }
    
    this.isOpen = true;
    this.element.classList.add('cart-open');
    
    // Usar el elemento overlay correcto
    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
      overlay.classList.add('active');
    }
  }

  /**
   * Vincula eventos del carrito
   */
  bindEvents() {
    // Solo vincular eventos si el carrito está inicializado
    if (!this.shouldInitializeCart()) {
      return;
    }
    
    // Cerrar carrito
    const closeBtn = document.getElementById('cart-close-btn');
    const overlay = document.getElementById('cart-overlay');
    const continueBtn = document.getElementById('continue-shopping');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeCart());
    }
    
    if (overlay) {
      overlay.addEventListener('click', () => this.closeCart());
    }
    
    if (continueBtn) {
      continueBtn.addEventListener('click', () => this.closeCart());
    }

    // Checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
    }

    // Event listener para el toggle del carrito desde el web component
    document.addEventListener('cart-toggle', () => {
      this.toggleCart();
    });

    // Event listener para mostrar el carrito desde el web component
    document.addEventListener('show-cart', () => {
      this.openCart();
    });

    // Eventos delegados para items del carrito
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quantity-btn--minus')) {
        const productId = e.target.dataset.productId;
        const item = this.items.find(item => item.id == productId);
        if (item) {
          this.updateQuantity(productId, item.quantity - 1);
        }
      }
      
      if (e.target.classList.contains('quantity-btn--plus')) {
        const productId = e.target.dataset.productId;
        const item = this.items.find(item => item.id == productId);
        if (item) {
          this.updateQuantity(productId, item.quantity + 1);
        }
      }
      
      if (e.target.classList.contains('cart-item__remove')) {
        const productId = e.target.dataset.productId;
        this.removeItem(productId);
      }

      // Eventos para botones "Agregar al Carrito" en las cards de productos
      if (e.target.classList.contains('add-to-cart-btn')) {
        e.preventDefault();
        const productId = e.target.dataset.productId;
        const productCard = e.target.closest('.product-card');
        
        if (productCard) {
          const quantityInput = productCard.querySelector('.quantity-input');
          const quantity = parseInt(quantityInput?.value || 1);
          
          // Obtener datos del producto desde la card
          const product = this.getProductDataFromCard(productCard);
          
          if (product) {
            this.addItem(product, quantity);
            
            // Feedback visual
            const originalText = e.target.textContent;
            e.target.textContent = 'Agregado ✓';
            e.target.disabled = true;
            
            setTimeout(() => {
              e.target.textContent = originalText;
              e.target.disabled = false;
            }, 2000);
          }
        }
      }

      // Eventos para controles de cantidad en las cards de productos
      if (e.target.classList.contains('quantity-btn')) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
          const quantityInput = productCard.querySelector('.quantity-input');
          const isPlus = e.target.classList.contains('quantity-btn--plus');
          
          if (quantityInput) {
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
      }
    });
  }

  /**
   * Procede al checkout
   */
  proceedToCheckout() {
    if (this.items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    
    // Guardar carrito en sessionStorage para la página de pago
    sessionStorage.setItem('checkout_items', JSON.stringify(this.items));
    sessionStorage.setItem('checkout_total', this.calculateTotal().toFixed(2));
    
    // Redirigir a la página de pago
            window.location.href = 'pages/payment.html';
  }

  /**
   * Obtiene los items del carrito para checkout
   * @returns {Array} - Items del carrito
   */
  getCheckoutItems() {
    return this.items;
  }

  /**
   * Obtiene el total para checkout
   * @returns {number} - Total del carrito
   */
  getCheckoutTotal() {
    return this.calculateTotal();
  }

  /**
   * Obtiene los datos del producto desde una card del DOM
   * @param {HTMLElement} productCard - Elemento de la card del producto
   * @returns {Object|null} - Datos del producto
   */
  getProductDataFromCard(productCard) {
    try {
      const productId = productCard.dataset.productId;
      const title = productCard.querySelector('.product-card__title')?.textContent;
      const supplier = productCard.querySelector('.product-card__supplier')?.textContent;
      const image = productCard.querySelector('.product-card__image img')?.src;
      const originalPrice = parseFloat(productCard.querySelector('.product-card__price--original')?.textContent.replace('€', ''));
      const discountedPrice = parseFloat(productCard.querySelector('.product-card__price--discounted')?.textContent.replace('€', ''));
      
      if (productId && title && discountedPrice) {
        return {
          id: productId,
          title: title,
          supplier: supplier || 'Proveedor',
          image: image || '',
          originalPrice: originalPrice || discountedPrice,
          discountedPrice: discountedPrice
        };
      }
    } catch (error) {
      console.error('Error getting product data from card:', error);
    }
    
    return null;
  }
}

// Inicializar carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.ShoppingCart = new ShoppingCart();
}); 