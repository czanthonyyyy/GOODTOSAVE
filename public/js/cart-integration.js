/**
 * Cart Integration Script
 * Maneja la integración entre el carrito y el marketplace
 */

class CartIntegration {
    constructor() {
        this.init();
    }

    init() {
        // Esperar a que los web components estén listos
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupCartIntegration();
            });
        } else {
            this.setupCartIntegration();
        }
    }

    setupCartIntegration() {
        // Asegurar que el carrito esté disponible
        this.ensureCartComponent();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Actualizar contador inicial
        this.updateCartCount();
    }

    ensureCartComponent() {
        if (!document.querySelector('app-cart')) {
            const appCart = document.createElement('app-cart');
            document.body.appendChild(appCart);
        }
    }

    setupEventListeners() {
        // Event listener para el toggle del carrito desde el header
        document.addEventListener('cart-toggle', () => {
            const cartComponent = document.querySelector('app-cart');
            if (cartComponent) {
                cartComponent.toggleCart();
            }
        });

        // Event listener para mostrar el carrito
        document.addEventListener('show-cart', () => {
            const cartComponent = document.querySelector('app-cart');
            if (cartComponent) {
                cartComponent.openCart();
                // Re-inicializar el botón de cerrar después de abrir
                setTimeout(() => {
                    this.reinitializeCloseButton();
                }, 100);
            }
        });

        // Event listener para cerrar el carrito
        document.addEventListener('close-cart', () => {
            const cartComponent = document.querySelector('app-cart');
            if (cartComponent) {
                cartComponent.closeCart();
            }
        });

        // Event listener para actualizaciones del carrito
        document.addEventListener('cart-updated', () => {
            this.updateCartCount();
        });

        // Event listener para producto añadido - abrir carrito automáticamente
        document.addEventListener('product-added', (e) => {
            const cartComponent = document.querySelector('app-cart');
            if (cartComponent && !cartComponent.isOpen) {
                // Abrir el carrito después de 500ms
                setTimeout(() => {
                    if (cartComponent && !cartComponent.isOpen) {
                        cartComponent.openCart();
                        console.log('Carrito abierto automáticamente desde integración');
                    }
                }, 500);
            }
        });

        // Event listener global para cerrar el carrito con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const cartComponent = document.querySelector('app-cart');
                if (cartComponent && cartComponent.isOpen) {
                    cartComponent.closeCart();
                }
            }
        });
    }

    updateCartCount() {
        const cartComponent = document.querySelector('app-cart');
        if (cartComponent && cartComponent.cartItems) {
            const totalItems = cartComponent.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            
            // Actualizar contador en el header
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
    }

    // Método para agregar productos al carrito desde el marketplace
    addToCart(product) {
        const cartComponent = document.querySelector('app-cart');
        if (cartComponent) {
            cartComponent.addItem(product);
            return true;
        }
        return false;
    }

    // Método para obtener los items del carrito
    getCartItems() {
        const cartComponent = document.querySelector('app-cart');
        if (cartComponent) {
            return cartComponent.cartItems || [];
        }
        return [];
    }

    // Método para limpiar el carrito
    clearCart() {
        const cartComponent = document.querySelector('app-cart');
        if (cartComponent) {
            cartComponent.cartItems = [];
            cartComponent.saveCart();
            cartComponent.updateCartCount();
            cartComponent.render();
        }
    }

    // Método para re-inicializar el botón de cerrar
    reinitializeCloseButton() {
        const cartComponent = document.querySelector('app-cart');
        if (cartComponent && cartComponent.reinitializeCloseButton) {
            cartComponent.reinitializeCloseButton();
        }
    }

    // Método para forzar el cierre del carrito
    forceCloseCart() {
        const cartComponent = document.querySelector('app-cart');
        if (cartComponent) {
            cartComponent.forceClose();
        }
    }

    // Helper function to navigate to payment page with proper path resolution
    navigateToPayment() {
        const currentPath = window.location.pathname;
        let paymentPath;
        
        if (currentPath.includes('/pages/')) {
            // If we're already in the pages directory
            paymentPath = 'payment.html';
        } else if (currentPath.includes('/public/')) {
            // If we're in the public directory
            paymentPath = 'pages/payment.html';
        } else {
            // Default case - try relative to current location
            paymentPath = './pages/payment.html';
        }
        
        console.log('Navigating to payment page:', paymentPath);
        window.location.href = paymentPath;
    }
}

// Global function for payment navigation
window.navigateToPayment = function() {
    const currentPath = window.location.pathname;
    let paymentPath;
    
    // Detect the current location and set appropriate path
    if (currentPath.includes('/pages/')) {
        paymentPath = 'payment.html';
    } else if (currentPath.includes('/public/')) {
        paymentPath = 'pages/payment.html';
    } else if (currentPath === '/' || currentPath === '/index.html') {
        paymentPath = 'pages/payment.html';
    } else {
        // Try multiple fallback paths
        const possiblePaths = [
            './pages/payment.html',
            '../pages/payment.html',
            'pages/payment.html',
            '/pages/payment.html'
        ];
        
        // For now, use the most common case
        paymentPath = 'pages/payment.html';
    }
    
    console.log('Navigating to payment page:', paymentPath);
    window.location.href = paymentPath;
};

// Inicializar la integración del carrito
window.cartIntegration = new CartIntegration(); 