class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--background-secondary);
                    border-bottom: 1px solid var(--text-lighter);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    box-shadow: var(--box-shadow-light);
                }

                .header-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 0;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding-left: 20px;
                    padding-right: 20px;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary-color);
                    font-weight: 600;
                    font-size: 1.5rem;
                    text-decoration: none;
                    font-family: 'Inter', sans-serif;
                }

                .logo:hover {
                    color: var(--primary-dark);
                }

                .logo img {
                    height: 32px;
                    width: auto;
                }

                .nav-menu {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .nav-menu a {
                    color: var(--text-primary);
                    font-weight: 500;
                    text-decoration: none;
                    transition: var(--transition);
                    font-family: 'Inter', sans-serif;
                }

                .nav-menu a:hover {
                    color: var(--primary-color);
                }

                .auth-buttons {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 16px;
                    border: none;
                    border-radius: var(--border-radius);
                    font-size: 0.875rem;
                    font-weight: 500;
                    text-decoration: none;
                    cursor: pointer;
                    transition: var(--transition);
                    min-height: 36px;
                    gap: 8px;
                    font-family: 'Inter', sans-serif;
                }

                .btn-primary {
                    background-color: var(--primary-color);
                    color: var(--white);
                }

                .btn-primary:hover {
                    background-color: var(--primary-dark);
                    transform: translateY(-1px);
                    box-shadow: var(--box-shadow);
                }

                .btn-outline {
                    background-color: transparent;
                    color: var(--text-primary);
                    border: 2px solid var(--text-light);
                }

                .btn-outline:hover {
                    background-color: var(--text-light);
                    color: var(--white);
                }

                .cart-toggle {
                    position: relative;
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: var(--border-radius);
                    transition: var(--transition);
                }

                .cart-toggle:hover {
                    color: var(--primary-color);
                    background-color: var(--background-light);
                }

                .cart-count {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: var(--error-color);
                    color: var(--white);
                    font-size: 0.75rem;
                    font-weight: 600;
                    padding: 2px 6px;
                    border-radius: 50%;
                    min-width: 18px;
                    text-align: center;
                    display: none;
                }

                .mobile-menu-toggle {
                    display: none;
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                }

                @media (max-width: 768px) {
                    .nav-menu {
                        display: none;
                    }
                    
                    .mobile-menu-toggle {
                        display: block;
                    }
                    
                    .auth-buttons {
                        gap: 0.5rem;
                    }
                    
                    .auth-buttons .btn {
                        padding: 6px 12px;
                        font-size: 0.8rem;
                    }
                }

                :root {
                    --background-secondary: #111111;
                    --text-primary: #767676;
                    --text-light: #909090;
                    --primary-color: #39b54a;
                    --primary-dark: #219a52;
                    --error-color: #e74c3c;
                    --white: #ffffff;
                    --background-light: #f0f7f4;
                    --border-radius: 8px;
                    --transition: all 0.3s ease;
                    --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    --box-shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
            </style>
            
            <header class="header">
                <div class="header-container">
                    <a href="index.html" class="logo">
                        <img src="assets/images/logo.svg" alt="FoodSaver Logo">
                        FoodSaver
                    </a>
                    
                    <nav>
                        <ul class="nav-menu">
                            <li><a href="index.html">Inicio</a></li>
                            <li><a href="marketplace.html">Marketplace</a></li>
                            <li><a href="about.html">Sobre Nosotros</a></li>
                            <li><a href="#contact">Contacto</a></li>
                        </ul>
                    </nav>
                    
                    <div class="auth-buttons">
                        <button class="cart-toggle" id="cart-toggle">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-count" id="cart-count">0</span>
                        </button>
                        
                        <a href="auth.html" class="btn btn-outline">Iniciar Sesión</a>
                        <a href="auth.html" class="btn btn-primary">Registrarse</a>
                        
                        <button class="mobile-menu-toggle" id="mobile-menu-toggle">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
            </header>
        `;
    }

    setupEventListeners() {
        const cartToggle = this.shadowRoot.getElementById('cart-toggle');
        const mobileMenuToggle = this.shadowRoot.getElementById('mobile-menu-toggle');

        cartToggle.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('cart-toggle', {
                bubbles: true,
                composed: true
            }));
        });

        mobileMenuToggle.addEventListener('click', () => {
            // Mobile menu functionality can be added here
            console.log('Mobile menu toggle clicked');
        });

        // Exponer método para actualizar contador del carrito
        window.updateCartCount = (count) => {
            this.updateCartCount(count);
        };
    }

    updateCartCount(count) {
        const cartCount = this.shadowRoot.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'block' : 'none';
        }
    }
}

customElements.define('app-header', AppHeader); 