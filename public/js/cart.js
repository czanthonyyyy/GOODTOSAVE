/**
 * Shopping Cart System
 * Handles all shopping cart functionality
 */
class ShoppingCart {
  constructor() {
    this.items = this.loadFromStorage() || [];
    this.isOpen = false;
    this.element = null;
    this.init();
  }

  /**
   * Initializes the cart
   */
  init() {
    // Only initialize on pages that need the cart
    if (this.shouldInitializeCart()) {
      this.createCartElement();
      this.updateCartDisplay();
      this.bindEvents();
    } else {
      // Only update header count
      this.updateCartCount();
    }
  }

  /**
   * Determines if the cart should be initialized on this page
   * @returns {boolean} - True if it should initialize
   */
  shouldInitializeCart() {
    const currentPage = window.location.pathname;
    const cartPages = [
      '/marketplace.html',
      '/payment.html',
      '/qr.html'
    ];
    
    // Also initialize if in root and not index.html
    if (currentPage === '/' || currentPage === '/index.html') {
      return false;
    }
    
    return cartPages.some(page => currentPage.includes(page));
  }

  /**
   * Creates the cart element if it doesn't exist
   */
  createCartElement() {
    if (!this.element) {
      this.element = document.getElementById('cart-drawer');
      if (!this.element) {
        this.element = this.createCartHTML();
        document.body.appendChild(this.element);
      }
      
      // Ensure the cart is closed by default
      this.isOpen = false;
      this.element.classList.remove('cart-open');
      
      // Ensure the overlay is closed by default
      const overlay = document.getElementById('cart-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }
    }
  }

  /**
   * Creates cart HTML
   * @returns {HTMLElement} - Cart element
   */
  createCartHTML() {
    const cartHTML = `
      <div class="cart-drawer" id="cart-drawer">
        <div class="cart-drawer__header">
          <h3 class="cart-drawer__title">Shopping Cart</h3>
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
            <button class="btn btn-outline" id="continue-shopping">Continue Shopping</button>
            <button class="btn btn-primary" id="checkout-btn">Proceed to Payment</button>
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
   * Adds a product to the cart
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add
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
   * Removes a product from the cart
   * @param {string|number} productId - Product ID to remove
   */
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
    this.updateCartDisplay();
  }

  /**
   * Updates a product quantity
   * @param {string|number} productId - Product ID
   * @param {number} newQuantity - New quantity
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
   * Calculates cart total
   * @returns {number} - Cart total
   */
  calculateTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  /**
   * Calculates total items in cart
   * @returns {number} - Total items
   */
  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Clears the cart
   */
  clear() {
    this.items = [];
    this.saveToStorage();
    this.updateCartDisplay();
  }

  /**
   * Saves cart to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('foodmarketplace_cart', JSON.stringify(this.items));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }

  /**
   * Loads cart from localStorage
   * @returns {Array} - Cart items
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
   * Updates cart UI
   */
  updateCartDisplay() {
    this.updateCartCount();
    if (this.shouldInitializeCart()) {
      this.renderCartItems();
      this.updateCartTotal();
    }
  }

  /**
   * Updates the item count in header
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
   * Renders cart items
   */
  renderCartItems() {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    if (this.items.length === 0) {
      cartContent.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started</p>
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
   * Updates cart total
   */
  updateCartTotal() {
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
      const total = this.calculateTotal();
      totalElement.textContent = `€${total.toFixed(2)}`;
    }
  }

  /**
   * Shows feedback when a product is added
   * @param {Object} product - Added product
   */
  showAddedToCartFeedback(product) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span>✓ ${product.title} added to cart</span>
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
   * Toggles the cart
   */
  toggleCart() {
    if (!this.shouldInitializeCart()) {
      // If we're not on a cart page, don't redirect; just warn
      console.warn('The cart is not available on this page');
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
   * Closes the cart
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
   * Opens the cart
   */
  openCart() {
    if (!this.shouldInitializeCart()) {
      // If we're not on a cart page, don't redirect; just warn
      console.warn('The cart is not available on this page');
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
   * Binds cart events
   */
  bindEvents() {
    // Only bind if cart is initialized
    if (!this.shouldInitializeCart()) {
      return;
    }
    
    // Close cart
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

    // Event listener for toggle from web component
    document.addEventListener('cart-toggle', () => {
      this.toggleCart();
    });

    // Event listener to show the cart from web component
    document.addEventListener('show-cart', () => {
      this.openCart();
    });

    // Delegated events for cart items
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

      // Events for "Add to Cart" buttons in product cards
      if (e.target.classList.contains('add-to-cart-btn')) {
        e.preventDefault();
        const productId = e.target.dataset.productId;
        const productCard = e.target.closest('.product-card');
        
        if (productCard) {
          const quantityInput = productCard.querySelector('.quantity-input');
          const quantity = parseInt(quantityInput?.value || 1);
          
          // Get product data from the card
          const product = this.getProductDataFromCard(productCard);
          
          if (product) {
            this.addItem(product, quantity);
            
            // Visual feedback
            const originalText = e.target.textContent;
             e.target.textContent = 'Added ✓';
            e.target.disabled = true;
            
            setTimeout(() => {
              e.target.textContent = originalText;
              e.target.disabled = false;
            }, 2000);
          }
        }
      }

      // Events for quantity controls in product cards
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
    * Proceeds to checkout
   */
  proceedToCheckout() {
    if (this.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    // Guardar carrito en sessionStorage para la página de pago
    sessionStorage.setItem('checkout_items', JSON.stringify(this.items));
    sessionStorage.setItem('checkout_total', this.calculateTotal().toFixed(2));
    
    // Redirigir a la página de pago
            // Use the global navigation function
        if (window.navigateToPayment) {
            window.navigateToPayment();
        } else {
            // Fallback to direct navigation
            window.location.href = 'pages/payment.html';
        }
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