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
                    z-index: 10001;
                    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow-y: auto;
                    overflow-x: hidden;
                    pointer-events: auto;
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
                    pointer-events: none;
                }

                :host(.open) .cart-overlay {
                    opacity: 1;
                    visibility: visible;
                    pointer-events: auto;
                }

                .cart-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: linear-gradient(135deg, rgba(20, 21, 21, 0.95), rgba(20, 21, 21, 0.98));
                    backdrop-filter: blur(20px);
                    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.05);
                }

                .cart-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-highlight, #ffffff);
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .cart-title::before {
                    content: '🛒';
                    font-size: 1.5rem;
                }

                .close-btn {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: var(--text-light, #cccccc);
                    font-size: 1.1rem;
                    cursor: pointer;
                    padding: 0.6rem;
                    border-radius: 50%;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                .close-btn:hover {
                    background: linear-gradient(135deg, rgba(231, 76, 60, 0.25), rgba(231, 76, 60, 0.1));
                    border-color: rgba(231, 76, 60, 0.6);
                    color: #e74c3c;
                    transform: scale(1.15);
                    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
                }

                .close-btn:active {
                    transform: scale(0.9);
                }

                .cart-content {
                    padding: 1.5rem;
                    pointer-events: auto;
                    position: relative;
                    z-index: 10002;
                }

                .cart-items {
                    margin-bottom: 2rem;
                }

                .cart-item {
                    display: grid;
                    grid-template-columns: 55px 1fr auto;
                    grid-template-rows: auto auto;
                    gap: 1rem;
                    padding: 1.25rem;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
                    backdrop-filter: blur(15px);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .cart-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(57, 181, 74, 0.05), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                }

                .cart-item:hover::before {
                    opacity: 1;
                }

                .cart-item:hover {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
                    border-color: rgba(57, 181, 74, 0.3);
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 0 20px rgba(57, 181, 74, 0.1);
                }

                .item-image {
                    width: 55px;
                    height: 55px;
                    border-radius: 12px;
                    object-fit: cover;
                    border: 2px solid rgba(255, 255, 255, 0.15);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                    grid-column: 1;
                    grid-row: 1 / span 2;
                }

                .cart-item:hover .item-image {
                    border-color: rgba(57, 181, 74, 0.4);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3), 0 0 10px rgba(57, 181, 74, 0.2);
                }

                .item-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    justify-content: center;
                    grid-column: 2;
                    grid-row: 1;
                }

                .item-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--text-highlight, #ffffff);
                    margin: 0;
                    line-height: 1.2;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                }

                .item-price {
                    font-size: 1rem;
                    color: var(--primary-color, #39b54a);
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }

                .item-price::before {
                    content: '$';
                    font-size: 1rem;
                    opacity: 0.9;
                }

                .item-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    align-items: flex-end;
                    justify-content: center;
                    grid-column: 3;
                    grid-row: 1 / span 2;
                }

                .item-quantity {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
                    padding: 0.5rem;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    align-self: flex-end;
                }

                .quantity-btn {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: var(--text-light, #cccccc);
                    width: 28px;
                    height: 28px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    font-weight: 700;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: auto;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                }

                .quantity-btn:hover {
                    background: linear-gradient(135deg, var(--primary-color, #39b54a), #2ecc71);
                    color: white;
                    transform: scale(1.15);
                    box-shadow: 0 4px 12px rgba(57, 181, 74, 0.3);
                    border-color: rgba(57, 181, 74, 0.5);
                }

                .quantity-btn:active {
                    transform: scale(0.9);
                }

                .quantity-display {
                    min-width: 35px;
                    text-align: center;
                    color: var(--text-highlight, #ffffff);
                    font-weight: 700;
                    font-size: 1rem;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                }

                .remove-btn {
                    background: linear-gradient(135deg, rgba(231, 76, 60, 0.15), rgba(231, 76, 60, 0.05));
                    border: 1px solid rgba(231, 76, 60, 0.3);
                    color: #e74c3c;
                    padding: 0.4rem 0.8rem;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    font-weight: 600;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: auto;
                    white-space: nowrap;
                    align-self: flex-end;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .remove-btn:hover {
                    background: linear-gradient(135deg, #e74c3c, #c0392b);
                    color: white;
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 6px 16px rgba(231, 76, 60, 0.4);
                    border-color: rgba(231, 76, 60, 0.6);
                }

                .remove-btn:active {
                    transform: translateY(0px) scale(0.95);
                }

                .cart-summary {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 1.5rem;
                    background: linear-gradient(135deg, rgba(20, 21, 21, 0.95), rgba(20, 21, 21, 0.98));
                    margin: 0 -1.5rem -1.5rem -1.5rem;
                    padding: 1.5rem;
                    border-radius: 16px 16px 0 0;
                    backdrop-filter: blur(20px);
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    color: var(--text-secondary, #cccccc);
                    font-size: 1rem;
                    padding: 0.5rem 0;
                }

                .summary-row:last-of-type {
                    margin-bottom: 0;
                }

                .summary-total {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: var(--text-highlight, #ffffff);
                    border-top: 2px solid rgba(255, 255, 255, 0.1);
                    padding-top: 1.5rem;
                    margin-top: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .summary-total span:last-child {
                    color: var(--primary-color, #39b54a);
                    font-size: 1.6rem;
                }

                .checkout-btn {
                    width: 100%;
                    background: linear-gradient(135deg, var(--primary-color, #39b54a), var(--primary-light, #2ecc71));
                    color: white;
                    border: none;
                    padding: 1rem;
                    border-radius: 14px;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 1.25rem;
                    pointer-events: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .checkout-btn::before {
                    content: '💳';
                    font-size: 1.2rem;
                }

                .checkout-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(57, 181, 74, 0.4);
                    background: linear-gradient(135deg, #2ecc71, #27ae60);
                }

                .checkout-btn:active {
                    transform: translateY(-1px);
                }

                .checkout-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    background: rgba(255, 255, 255, 0.1);
                }

                .empty-cart {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: var(--text-secondary, #cccccc);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }

                .empty-cart::before {
                    content: '🛒';
                    font-size: 4rem;
                    opacity: 0.3;
                    animation: float 3s ease-in-out infinite;
                }

                .empty-cart p {
                    margin: 0;
                    font-size: 1.2rem;
                    font-weight: 500;
                    color: var(--text-light, #cccccc);
                }

                .empty-cart .subtitle {
                    font-size: 1rem;
                    opacity: 0.7;
                    margin-top: 0.5rem;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                @media (max-width: 768px) {
                    :host {
                        width: 100%;
                        right: -100%;
                    }
                    
                    .cart-item {
                        grid-template-columns: 45px 1fr auto;
                        gap: 0.75rem;
                        padding: 1rem;
                    }
                    
                    .item-image {
                        width: 45px;
                        height: 45px;
                    }
                    
                    .item-title {
                        font-size: 1rem;
                    }
                    
                    .item-price {
                        font-size: 0.9rem;
                    }
                    
                    .item-controls {
                        gap: 0.5rem;
                    }
                    
                    .quantity-btn {
                        width: 24px;
                        height: 24px;
                        font-size: 0.9rem;
                    }
                    
                    .remove-btn {
                        padding: 0.3rem 0.5rem;
                        font-size: 0.75rem;
                    }
                    
                    .cart-header {
                        padding: 1.25rem;
                    }
                    
                    .cart-title {
                        font-size: 1.25rem;
                    }
                    
                    .cart-content {
                        padding: 1.25rem;
                    }
                    
                    .cart-summary {
                        padding: 1.25rem;
                        margin: 0 -1.25rem -1.25rem -1.25rem;
                    }
                }

                /* Scrollbar styling */
                :host::-webkit-scrollbar {
                    width: 6px;
                }

                :host::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }

                :host::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                }

                :host::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
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
                    <p>Your cart is empty</p>
                    <p class="subtitle">Add some items to get started!</p>
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
                <div class="item-controls">
                    <div class="item-quantity">
                        <button class="quantity-btn minus-btn" data-item-id="${item.id}">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn plus-btn" data-item-id="${item.id}">+</button>
                    </div>
                    <button class="remove-btn" data-item-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('');
    }

    renderCartSummary() {
        if (this.cartItems.length === 0) {
            return '';
        }

        const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.04; // 4% tax
        const total = subtotal + tax;

        return `
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (4%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="checkout-btn">
                Proceed to Checkout
            </button>
        `;
    }

    attachEventListeners() {
        const closeBtn = this.shadowRoot.getElementById('closeCart');
        const overlay = this.shadowRoot.querySelector('.cart-overlay');

        closeBtn.addEventListener('click', () => this.closeCart());
        overlay.addEventListener('click', () => this.closeCart());
        
        // Event delegation para los botones del carrito
        this.shadowRoot.addEventListener('click', (e) => {
            const target = e.target;
            
            // Botones de cantidad
            if (target.classList.contains('quantity-btn')) {
                const itemId = target.dataset.itemId;
                if (itemId) {
                    const change = target.classList.contains('minus-btn') ? -1 : 1;
                    this.updateQuantity(itemId, change);
                }
            }
            
            // Botón de eliminar
            if (target.classList.contains('remove-btn')) {
                const itemId = target.dataset.itemId;
                if (itemId) {
                    this.removeItem(itemId);
                }
            }
            
            // Botón de checkout
            if (target.classList.contains('checkout-btn')) {
                this.checkout();
            }
        });
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
        
        // Buscar el botón del carrito en el shadow DOM del header
        const headerComponent = document.querySelector('app-header');
        if (headerComponent && headerComponent.shadowRoot) {
            const cartToggle = headerComponent.shadowRoot.querySelector('.cart-toggle');
            if (cartToggle) {
                const countElement = cartToggle.querySelector('.cart-count');
                if (countElement) {
                    countElement.textContent = totalItems;
                    countElement.style.display = totalItems > 0 ? 'block' : 'none';
                }
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
        window.location.href = 'pages/payment.html';
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