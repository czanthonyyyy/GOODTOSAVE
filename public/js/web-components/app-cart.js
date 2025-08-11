class AppCart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // Cargar desde cualquiera de las dos claves para compatibilidad
        const itemsA = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const itemsB = JSON.parse(localStorage.getItem('foodmarketplace_cart') || '[]');
        // Normalizar estructura: itemsB puede tener campos distintos
        const normalizedB = itemsB.map(it => ({
            id: it.id,
            title: it.title,
            price: it.price ?? it.discountedPrice ?? 0,
            image: it.image || '',
            quantity: it.quantity ?? 1
        }));
        this.cartItems = (itemsA && itemsA.length ? itemsA : normalizedB) || [];
        this.isOpen = false;
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
        this.updateCartCount();
        
        // Asegurar que los event listeners se mantengan después de re-renderizar
        this.setupPersistentEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 0;
                    right: -450px;
                    width: 450px;
                    height: 100vh;
                    background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%);
                    backdrop-filter: blur(10px);
                    border-left: 1px solid rgba(255, 255, 255, 0.08);
                    z-index: 10001;
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    overflow-y: auto;
                    overflow-x: hidden;
                    pointer-events: auto;
                    box-shadow: -20px 0 60px rgba(0, 0, 0, 0.6);
                }

                :host(.open) {
                    right: 0;
                    box-shadow: -25px 0 80px rgba(0, 0, 0, 0.8);
                }

                .cart-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: linear-gradient(135deg, rgba(15, 20, 25, 0.8), rgba(26, 31, 46, 0.6));
                    z-index: 9999;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    pointer-events: none;
                    backdrop-filter: blur(10px);
                }

                :host(.open) .cart-overlay {
                    opacity: 1;
                    visibility: visible;
                    pointer-events: auto;
                }

                .cart-header {
                    padding: 2rem 2rem 1.5rem 2rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
                    position: relative;
                    overflow: hidden;
                    z-index: 10003;
                }

                .cart-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent 0%, rgba(64, 224, 208, 0.3) 50%, transparent 100%);
                }

                .cart-title {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #ffffff;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    letter-spacing: -0.02em;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                    position: relative;
                    z-index: 10004;
                }

                .cart-title::before {
                    content: '🛒';
                    font-size: 1.75rem;
                    filter: drop-shadow(0 2px 8px rgba(64, 224, 208, 0.3));
                }

                .close-btn {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: #ffffff;
                    font-size: 1.75rem;
                    font-weight: 300;
                    cursor: pointer;
                    padding: 0.75rem;
                    border-radius: 16px;
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    user-select: none;
                    position: relative;
                    overflow: hidden;
                    z-index: 10004;
                }

                .close-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transition: left 0.5s ease;
                }

                .close-btn:hover::before {
                    left: 100%;
                }

                .close-btn:hover {
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%);
                    border-color: rgba(239, 68, 68, 0.5);
                    color: #fca5a5;
                    transform: scale(1.1) rotate(90deg);
                    box-shadow: 0 8px 30px rgba(239, 68, 68, 0.4);
                }

                .close-btn:active {
                    transform: scale(0.95) rotate(90deg);
                }

                .close-btn:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(64, 224, 208, 0.5);
                }

                .cart-content {
                    padding: 2rem;
                    pointer-events: auto;
                    position: relative;
                    z-index: 10002;
                }

                .cart-items {
                    margin-bottom: 2.5rem;
                }

                .cart-item {
                    display: grid;
                    grid-template-columns: 70px 1fr auto;
                    grid-template-rows: auto auto;
                    gap: 1.25rem;
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    border-radius: 20px;
                    margin-bottom: 1.25rem;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
                    backdrop-filter: blur(5px);
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                }

                .cart-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(64, 224, 208, 0.03) 0%, transparent 100%);
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    pointer-events: none;
                }

                .cart-item::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent 0%, rgba(64, 224, 208, 0.2) 50%, transparent 100%);
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }

                .cart-item:hover::before {
                    opacity: 1;
                }

                .cart-item:hover::after {
                    opacity: 1;
                }

                .cart-item:hover {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
                    border-color: rgba(64, 224, 208, 0.2);
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(64, 224, 208, 0.1);
                }

                .item-image {
                    width: 70px;
                    height: 70px;
                    border-radius: 16px;
                    object-fit: cover;
                    border: 2px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                    transition: all 0.4s ease;
                    grid-column: 1;
                    grid-row: 1 / span 2;
                    position: relative;
                    overflow: hidden;
                }

                .item-image::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(64, 224, 208, 0.1) 0%, transparent 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .cart-item:hover .item-image {
                    border-color: rgba(64, 224, 208, 0.3);
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 0 20px rgba(64, 224, 208, 0.2);
                    transform: scale(1.05);
                }

                .cart-item:hover .item-image::after {
                    opacity: 1;
                }

                .item-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    justify-content: center;
                    grid-column: 2;
                    grid-row: 1;
                }

                .item-title {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0;
                    line-height: 1.3;
                    letter-spacing: -0.01em;
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
                }

                .item-price {
                    font-size: 1.1rem;
                    color: #10b981;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    letter-spacing: -0.01em;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                }

                .item-price::before {
                    content: '$';
                    font-size: 1rem;
                    opacity: 0.9;
                }

                .item-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: flex-end;
                    justify-content: center;
                    grid-column: 3;
                    grid-row: 1 / span 2;
                }

                .item-quantity {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
                    padding: 0.75rem;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(15px);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    align-self: flex-end;
                    position: relative;
                    overflow: hidden;
                }

                .item-quantity::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(64, 224, 208, 0.05) 0%, transparent 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .item-quantity:hover::before {
                    opacity: 1;
                }

                .quantity-btn {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    color: #e0e7ff;
                    width: 32px;
                    height: 32px;
                    border-radius: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                    font-weight: 700;
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    pointer-events: auto;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    position: relative;
                    overflow: hidden;
                }

                .quantity-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transition: left 0.5s ease;
                }

                .quantity-btn:hover::before {
                    left: 100%;
                }

                .quantity-btn:hover {
                    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
                    color: white;
                    transform: scale(1.15);
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
                    border-color: rgba(16, 185, 129, 0.5);
                }

                .quantity-btn:active {
                    transform: scale(0.9);
                }

                .quantity-display {
                    min-width: 40px;
                    text-align: center;
                    color: #ffffff;
                    font-weight: 800;
                    font-size: 1.1rem;
                    letter-spacing: -0.01em;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                }

                .remove-btn {
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.03) 100%);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #fca5a5;
                    padding: 0.6rem 1rem;
                    border-radius: 14px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    font-weight: 600;
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    pointer-events: auto;
                    white-space: nowrap;
                    align-self: flex-end;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    position: relative;
                    overflow: hidden;
                }

                .remove-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), transparent);
                    transition: left 0.5s ease;
                }

                .remove-btn:hover::before {
                    left: 100%;
                }

                .remove-btn:hover {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: white;
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 8px 30px rgba(239, 68, 68, 0.4);
                    border-color: rgba(239, 68, 68, 0.5);
                }

                .remove-btn:active {
                    transform: translateY(0px) scale(0.95);
                }

                .cart-summary {
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                    padding-top: 2rem;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
                    margin: 0 -2rem -2rem -2rem;
                    padding: 2rem;
                    border-radius: 24px 24px 0 0;
                    backdrop-filter: blur(5px);
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
                    position: relative;
                    overflow: hidden;
                }

                .cart-summary::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent 0%, rgba(64, 224, 208, 0.2) 50%, transparent 100%);
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1.25rem;
                    color: #a1a1aa;
                    font-size: 1rem;
                    padding: 0.75rem 0;
                    font-weight: 500;
                    letter-spacing: 0.01em;
                }

                .summary-row:last-of-type {
                    margin-bottom: 0;
                }

                .summary-total {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #ffffff;
                    border-top: 2px solid rgba(255, 255, 255, 0.06);
                    padding-top: 1.75rem;
                    margin-top: 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    letter-spacing: -0.02em;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }

                .summary-total span:last-child {
                    color: #10b981;
                    font-size: 1.8rem;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }

                .checkout-btn {
                    width: 100%;
                    background: linear-gradient(135deg, #10b981 0%, #34d399 50%, #10b981 100%);
                    color: white;
                    border: none;
                    padding: 1.25rem;
                    border-radius: 18px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    margin-top: 1.5rem;
                    pointer-events: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 8px 30px rgba(16, 185, 129, 0.3);
                }

                .checkout-btn::before {
                    content: '💳';
                    font-size: 1.3rem;
                    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
                }

                .checkout-btn::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s ease;
                }

                .checkout-btn:hover::after {
                    left: 100%;
                }

                .checkout-btn:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 50px rgba(16, 185, 129, 0.5);
                    background: linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%);
                }

                .checkout-btn:active {
                    transform: translateY(-2px);
                }

                .checkout-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    background: rgba(255, 255, 255, 0.1);
                }

                .empty-cart {
                    text-align: center;
                    padding: 5rem 2rem;
                    color: #a1a1aa;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                }

                .empty-cart::before {
                    content: '🛒';
                    font-size: 5rem;
                    opacity: 0.2;
                    animation: float 4s ease-in-out infinite;
                    filter: drop-shadow(0 4px 20px rgba(64, 224, 208, 0.1));
                }

                .empty-cart p {
                    margin: 0;
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #ffffff;
                    letter-spacing: -0.01em;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }

                .empty-cart .subtitle {
                    font-size: 1.1rem;
                    opacity: 0.7;
                    margin-top: 0.5rem;
                    color: #a1a1aa;
                    font-weight: 400;
                }

                @keyframes float {
                    0%, 100% { 
                        transform: translateY(0px) rotate(0deg); 
                    }
                    50% { 
                        transform: translateY(-15px) rotate(5deg); 
                    }
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .cart-item {
                    animation: slideIn 0.5s ease-out;
                }

                @media (max-width: 768px) {
                    :host {
                        width: 100%;
                        right: -100%;
                    }
                    
                    .cart-item {
                        grid-template-columns: 60px 1fr auto;
                        gap: 1rem;
                        padding: 1.25rem;
                    }
                    
                    .item-image {
                        width: 60px;
                        height: 60px;
                    }
                    
                    .item-title {
                        font-size: 1.1rem;
                    }
                    
                    .item-price {
                        font-size: 1rem;
                    }
                    
                    .item-controls {
                        gap: 0.75rem;
                    }
                    
                    .quantity-btn {
                        width: 28px;
                        height: 28px;
                        font-size: 1rem;
                    }
                    
                    .remove-btn {
                        padding: 0.5rem 0.75rem;
                        font-size: 0.8rem;
                    }
                    
                    .cart-header {
                        padding: 1.5rem 1.5rem 1.25rem 1.5rem;
                    }
                    
                    .cart-title {
                        font-size: 1.5rem;
                    }
                    
                    .cart-content {
                        padding: 1.5rem;
                    }
                    
                    .cart-summary {
                        padding: 1.5rem;
                        margin: 0 -1.5rem -1.5rem -1.5rem;
                    }
                }

                /* Scrollbar styling */
                :host::-webkit-scrollbar {
                    width: 8px;
                }

                :host::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 4px;
                }

                :host::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
                    border-radius: 4px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                :host::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, rgba(64, 224, 208, 0.2) 0%, rgba(64, 224, 208, 0.1) 100%);
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
                    <p class="item-price">${item.price.toFixed(2)}</p>
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
        // Main event delegation for all cart events
        this.shadowRoot.addEventListener('click', (e) => {
            const target = e.target;
            
            // Close button - multiple selectors for compatibility
            if (target.id === 'closeCart' || 
                target.classList.contains('close-btn') || 
                target.closest('#closeCart') || 
                target.closest('.close-btn')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close cart button clicked');
                this.closeCart();
                return;
            }
            
            // Overlay click to close
            if (target.classList.contains('cart-overlay')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Cart overlay clicked');
                this.closeCart();
                return;
            }
            
            // Quantity buttons
            if (target.classList.contains('quantity-btn')) {
                const itemId = target.dataset.itemId;
                if (itemId) {
                    const change = target.classList.contains('minus-btn') ? -1 : 1;
                    this.updateQuantity(itemId, change);
                }
            }
            
            // Remove button
            if (target.classList.contains('remove-btn')) {
                const itemId = target.dataset.itemId;
                if (itemId) {
                    this.removeItem(itemId);
                }
            }
            
            // Checkout button
            if (target.classList.contains('checkout-btn')) {
                this.checkout();
            }
        });

        // Event listener for cart toggle from header
        document.addEventListener('cart-toggle', () => {
            this.toggleCart();
        });

        // Event listener to show cart
        document.addEventListener('show-cart', () => {
            this.openCart();
        });

        // Event listener to close with Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeCart();
            }
        });
    }

    openCart() {
        console.log('Opening cart...');
        this.isOpen = true;
        this.classList.add('open');
        
        // Asegurar que el overlay se active
        const overlay = this.shadowRoot.querySelector('.cart-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
        
        // Do not block body scroll to allow catalog interaction
        // document.body.style.overflow = 'hidden';
        
        console.log('Cart opened');
    }

    closeCart() {
        console.log('Closing cart...');
        
        // Forzar el estado cerrado
        this.isOpen = false;
        this.classList.remove('open');
        
        // Ensure overlay closes too
        const overlay = this.shadowRoot.querySelector('.cart-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Emit close event
        document.dispatchEvent(new CustomEvent('cart-closed'));
        
        console.log('Cart closed successfully');
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
        
        // Emit specific product-added event
        document.dispatchEvent(new CustomEvent('product-added', {
            detail: { product, cartItems: this.cartItems }
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
        // Guardar en ambas claves para compatibilidad
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        try {
            const legacy = this.cartItems.map(it => ({
                id: it.id,
                title: it.title,
                price: it.price,
                image: it.image,
                quantity: it.quantity,
                discountedPrice: it.price,
                supplier: it.supplier || 'Proveedor',
                originalPrice: it.price
            }));
            localStorage.setItem('foodmarketplace_cart', JSON.stringify(legacy));
        } catch (e) { /* ignore */ }
    }

    updateCartCount() {
        const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        // Use global header updater for both header variants
        if (typeof window.updateCartCount === 'function') {
            window.updateCartCount(totalItems);
        }
    }

    checkout() {
        if (this.cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Save cart data for payment page
        localStorage.setItem('checkoutItems', JSON.stringify(this.cartItems));
        
        // Use the global navigation function
        if (window.navigateToPayment) {
            window.navigateToPayment();
        } else {
            // Fallback to direct navigation
            window.location.href = 'pages/payment.html';
        }
    }

    setupPersistentEventListeners() {
        // Observer to detect changes in shadow DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Reconnect event listeners if necessary
                    const closeBtn = this.shadowRoot.getElementById('closeCart');
                    if (closeBtn && !closeBtn.hasAttribute('data-listener-attached')) {
                        closeBtn.setAttribute('data-listener-attached', 'true');
                        closeBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        console.log('Close cart button clicked (persistent)');
                            this.closeCart();
                        });
                    }
                }
            });
        });

        observer.observe(this.shadowRoot, {
            childList: true,
            subtree: true
        });

        // Method to force reinitialization of close button
        this.forceReinitializeCloseButton = () => {
            const closeBtn = this.shadowRoot.getElementById('closeCart');
            if (closeBtn) {
                // Remover listeners existentes
                closeBtn.replaceWith(closeBtn.cloneNode(true));
                
                // Obtener el nuevo botón
                const newCloseBtn = this.shadowRoot.getElementById('closeCart');
                if (newCloseBtn) {
                    newCloseBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Close button re-initialized');
                        this.closeCart();
                    });
                }
            }
        };
    }

    // Public method to be called from outside
    toggleCart() {
        if (this.isOpen) {
            this.closeCart();
        } else {
            this.openCart();
        }
    }

    // Public method to close cart from outside
    forceClose() {
        console.log('Forcing cart close...');
        this.closeCart();
    }

    // Public method to reinitialize close button
    reinitializeCloseButton() {
        console.log('Reinitializing close button...');
        if (this.forceReinitializeCloseButton) {
            this.forceReinitializeCloseButton();
        }
    }
}

customElements.define('app-cart', AppCart); 