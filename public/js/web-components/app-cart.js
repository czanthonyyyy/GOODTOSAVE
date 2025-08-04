class AppCart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.isOpen = false;
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
        this.updateCartCount();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 0;
                    right: -400px;
                    width: 400px;
                    height: 100vh;
                    background: rgba(20, 21, 21, 0.95);
                    backdrop-filter: blur(20px);
                    border-left: 1px solid rgba(255, 255, 255, 0.1);
                    z-index: 10000;
                    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow-y: auto;
                }

                :host(.open) {
                    right: 0;
                }

                .cart-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 9999;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                :host(.open) .cart-overlay {
                    opacity: 1;
                    visibility: visible;
                }

                .cart-header {
                    padding: 2rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .cart-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--text-highlight, #ffffff);
                    margin: 0;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-light, #cccccc);
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }

                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-highlight, #ffffff);
                }

                .cart-content {
                    padding: 2rem;
                }

                .cart-items {
                    margin-bottom: 2rem;
                }

                .cart-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    margin-bottom: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                }

                .item-image {
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                    object-fit: cover;
                }

                .item-details {
                    flex: 1;
                }

                .item-title {
                    font-size: 1rem;
                    font-weight: 500;
                    color: var(--text-highlight, #ffffff);
                    margin: 0 0 0.25rem 0;
                }

                .item-price {
                    font-size: 0.9rem;
                    color: var(--primary-color, #39b54a);
                    font-weight: 600;
                }

                .item-quantity {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .quantity-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: var(--text-light, #cccccc);
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    transition: all 0.3s ease;
                }

                .quantity-btn:hover {
                    background: var(--primary-color, #39b54a);
                    color: white;
                }

                .quantity-display {
                    min-width: 30px;
                    text-align: center;
                    color: var(--text-highlight, #ffffff);
                    font-weight: 500;
                }

                .remove-btn {
                    background: rgba(231, 76, 60, 0.1);
                    border: 1px solid rgba(231, 76, 60, 0.3);
                    color: #e74c3c;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    transition: all 0.3s ease;
                }

                .remove-btn:hover {
                    background: #e74c3c;
                    color: white;
                }

                .cart-summary {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 2rem;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    color: var(--text-secondary, #cccccc);
                }

                .summary-total {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: var(--text-highlight, #ffffff);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 1rem;
                }

                .checkout-btn {
                    width: 100%;
                    background: linear-gradient(135deg, var(--primary-color, #39b54a), var(--primary-light, #2ecc71));
                    color: white;
                    border: none;
                    padding: 1rem;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 1rem;
                }

                .checkout-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(57, 181, 74, 0.3);
                }

                .checkout-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .empty-cart {
                    text-align: center;
                    padding: 3rem 2rem;
                    color: var(--text-secondary, #cccccc);
                }

                .empty-cart i {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                .empty-cart p {
                    margin: 0;
                    font-size: 1.1rem;
                }

                @media (max-width: 768px) {
                    :host {
                        width: 100%;
                        right: -100%;
                    }
                }
            </style>

            <div class="cart-overlay"></div>
            <div class="cart-header">
                <h2 class="cart-title">Shopping Cart</h2>
                <button class="close-btn" id="closeCart">×</button>
            </div>
            <div class="cart-content">
                <div class="cart-items" id="cartItems">
                    ${this.renderCartItems()}
                </div>
                <div class="cart-summary" id="cartSummary">
                    ${this.renderCartSummary()}
                </div>
            </div>
        `;
    }

    renderCartItems() {
        if (this.cartItems.length === 0) {
            return `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        }

        return this.cartItems.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="item-image">
                <div class="item-details">
                    <h3 class="item-title">${item.title}</h3>
                    <p class="item-price">$${item.price}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn" onclick="this.getRootNode().host.updateQuantity('${item.id}', -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="this.getRootNode().host.updateQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="this.getRootNode().host.removeItem('${item.id}')">Remove</button>
            </div>
        `).join('');
    }

    renderCartSummary() {
        if (this.cartItems.length === 0) {
            return '';
        }

        const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;

        return `
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (10%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="checkout-btn" onclick="this.getRootNode().host.checkout()">
                Proceed to Checkout
            </button>
        `;
    }

    attachEventListeners() {
        const closeBtn = this.shadowRoot.getElementById('closeCart');
        const overlay = this.shadowRoot.querySelector('.cart-overlay');

        closeBtn.addEventListener('click', () => this.closeCart());
        overlay.addEventListener('click', () => this.closeCart());
    }

    openCart() {
        this.isOpen = true;
        this.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        this.isOpen = false;
        this.classList.remove('open');
        document.body.style.overflow = '';
    }

    addItem(product) {
        const existingItem = this.cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.render();
        
        // Emit event for cart update
        document.dispatchEvent(new CustomEvent('cart-updated', {
            detail: { cartItems: this.cartItems }
        }));
    }

    updateQuantity(itemId, change) {
        const item = this.cartItems.find(item => item.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(itemId);
            } else {
                this.saveCart();
                this.updateCartCount();
                this.render();
                
                // Emit event for cart update
                document.dispatchEvent(new CustomEvent('cart-updated', {
                    detail: { cartItems: this.cartItems }
                }));
            }
        }
    }

    removeItem(itemId) {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartCount();
        this.render();
        
        // Emit event for cart update
        document.dispatchEvent(new CustomEvent('cart-updated', {
            detail: { cartItems: this.cartItems }
        }));
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    updateCartCount() {
        const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const cartToggle = document.querySelector('.cart-toggle');
        if (cartToggle) {
            const countElement = cartToggle.querySelector('.cart-count');
            if (countElement) {
                countElement.textContent = totalItems;
                countElement.style.display = totalItems > 0 ? 'block' : 'none';
            }
        }
    }

    checkout() {
        if (this.cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Save cart data for payment page
        localStorage.setItem('checkoutItems', JSON.stringify(this.cartItems));
        
        // Navigate to payment page
        window.location.href = 'payment.html';
    }

    // Public method to be called from outside
    toggleCart() {
        if (this.isOpen) {
            this.closeCart();
        } else {
            this.openCart();
        }
    }
}

customElements.define('app-cart', AppCart); 