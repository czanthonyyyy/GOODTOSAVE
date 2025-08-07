/**
 * Marketplace JavaScript - New Cart System
 * Works with the new app-cart web component
 */

class MarketplaceManager {
    constructor() {
        this.products = [
            {
                id: 'kings-box',
                title: "King's box",
                price: 2.50,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Burger+King"
            },
            {
                id: 'smile-enjoy',
                title: "Smile and Enjoy",
                price: 3.15,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=McDonald's"
            },
            {
                id: 'tasssty-box',
                title: "Tasssty box",
                price: 3.00,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Krispy+Kreme"
            },
            {
                id: 'taco-box',
                title: "Taco Box",
                price: 2.45,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Taco+Bell"
            },
            {
                id: 'totumas',
                title: "Totumas",
                price: 3.25,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Las+Totumas"
            },
            {
                id: 'meat-more',
                title: "Meat and more",
                price: 5.80,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Brazzeiro"
            },
            {
                id: 'full-breakfast',
                title: "Full breakfast",
                price: 4.00,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=En+La+Fonda"
            },
            {
                id: 'delicious-box',
                title: "Delicious box",
                price: 2.80,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Sabroso+Panama"
            },
            {
                id: 'maranon-box',
                title: "Marañon box",
                price: 1.60,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Marañon"
            },
            {
                id: 'charged-meal',
                title: "Charged meal",
                price: 1.45,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=La+Fonda"
            },
            {
                id: 'panamanian-box',
                title: "Panamanian box",
                price: 2.10,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=El+Motete"
            },
            {
                id: 'endless-lunch',
                title: "Endless Lunch",
                price: 3.50,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Llenos+y+Carbon"
            },
            {
                id: 'pio-pio',
                title: "Pio Pio",
                price: 1.20,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Pio+Pio"
            },
            {
                id: 'leonardo',
                title: "Leonardo",
                price: 2.90,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Leonardo"
            },
            {
                id: 'rio-oro',
                title: "Rio de oro",
                price: 6.50,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Rio+de+Oro"
            },
            {
                id: 'la-migueria',
                title: "La migueria",
                price: 2.10,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=La+Migueria"
            },
            {
                id: 'dominos-pizza',
                title: "Dominos Pizza",
                price: 3.75,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Domino's+Pizza"
            },
            {
                id: 'nacion-sushi',
                title: "Nacion Sushi",
                price: 2.80,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Nacion+Sushi"
            },
            {
                id: 'popeyes',
                title: "Popeyes",
                price: 1.20,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Popeyes"
            },
            {
                id: 'subway',
                title: "Subway",
                price: 1.20,
                image: "https://via.placeholder.com/200x160/39b54a/ffffff?text=Subway"
            }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProductButtons();
    }

    setupEventListeners() {
        // Event delegation for add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('boton-item')) {
                this.addToCart(e);
            }
        });

        // Listen for cart updates
        document.addEventListener('cart-updated', () => {
            this.updateProductButtons();
        });
    }

    addToCart(event) {
        const button = event.target;
        const item = button.closest('.item');
        
        if (!item) return;

        const productId = item.dataset.productId;
        const title = item.querySelector('.titulo-item').textContent;
        const priceText = item.querySelector('.precio-item').textContent;
        const price = parseFloat(priceText.replace('$', ''));
        const image = item.querySelector('.img-item').src;
        
        // Find product in our products array
        const product = this.products.find(p => p.id === productId);
        
        if (product) {
            // Update product with real image
            product.image = image;
            
            // Get the cart component
            const cartComponent = document.querySelector('app-cart');
            if (cartComponent) {
                cartComponent.addItem(product);
                
                // Show success feedback
                this.showAddToCartFeedback(button);
                
                // Abrir el carrito automáticamente después de 500ms
                setTimeout(() => {
                    if (cartComponent && !cartComponent.isOpen) {
                        cartComponent.openCart();
                        console.log('Carrito abierto automáticamente después de añadir producto');
                    }
                }, 500);
            }
        }
    }

    showAddToCartFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.background = '#27ae60';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 1500);
    }

    updateProductButtons() {
        const cartComponent = document.querySelector('app-cart');
        if (!cartComponent) return;

        const cartItems = cartComponent.cartItems || [];
        
        this.products.forEach(product => {
            const itemElement = document.querySelector(`[data-product-id="${product.id}"]`);
            if (itemElement) {
                const button = itemElement.querySelector('.boton-item');
                const inCart = cartItems.some(item => item.id === product.id);
                
                if (inCart) {
                    button.textContent = 'In Cart';
                    button.style.background = '#27ae60';
                    button.style.color = 'white';
                } else {
                    button.textContent = 'Add to cart';
                    button.style.background = '';
                    button.style.color = '';
                }
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MarketplaceManager();
    });
} else {
    new MarketplaceManager();
} 