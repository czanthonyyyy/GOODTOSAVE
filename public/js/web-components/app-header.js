class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setLogoSrc();
        this.setupEventListeners();
        this.syncThemeButton();
        // Aplicar contador inicial del carrito
        try {
            const initial = (typeof window.__cartCount === 'number') ? window.__cartCount : this.readCartCountFromStorage();
            this.updateCartCount(initial);
        } catch (e) {}
    }

    readCartCountFromStorage() {
        try {
            const raw = localStorage.getItem('foodmarketplace_cart');
            if (!raw) return 0;
            const items = JSON.parse(raw) || [];
            return items.reduce((acc, it) => acc + (it.quantity || 0), 0);
        } catch (e) { return 0; }
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
                    width: 100%;
                }

                .header {
                    width: 100%;
                    display: block;
                }

                * {
                    box-sizing: border-box;
                }

                .header-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                    box-sizing: border-box;
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
                    flex-shrink: 0;
                }

                .logo:hover {
                    color: var(--primary-dark);
                }

                .logo img {
                    height: 32px;
                    width: auto;
                    display: block;
                }

                nav {
                    display: flex;
                    align-items: center;
                }

                .nav-menu {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    list-style: none;
                    margin: 0;
                    padding: 4px;
                    background: var(--surface-translucent);
                    border-radius: 12px;
                    backdrop-filter: blur(10px);
                    border: 1px solid var(--surface-border);
                }

                .nav-menu li {
                    position: relative;
                }

                .nav-menu a {
                    color: var(--text-primary);
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: 'Inter', sans-serif;
                    padding: 12px 20px;
                    border-radius: 8px;
                    position: relative;
                    display: block;
                    font-size: 0.9rem;
                    letter-spacing: 0.025em;
                }

                .nav-menu a:hover {
                    color: var(--primary-color);
                    background: rgba(57, 181, 74, 0.1);
                    transform: translateY(-1px);
                }

                .nav-menu a::before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
                    transition: all 0.3s ease;
                    transform: translateX(-50%);
                    border-radius: 1px;
                }

                .nav-menu a:hover::before {
                    width: 80%;
                }

                .nav-menu a.active {
                    color: var(--primary-color);
                    background: rgba(57, 181, 74, 0.15);
                    box-shadow: 0 2px 8px rgba(57, 181, 74, 0.2);
                }

                .nav-menu a.active::before {
                    width: 80%;
                }

                .auth-buttons {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .theme-toggle {
                    position: relative;
                    background: transparent;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    color: var(--text-primary);
                    font-size: 1.1rem;
                    cursor: pointer;
                    padding: 8px 10px;
                    border-radius: 8px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    min-height: 40px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .theme-toggle:hover {
                    color: var(--primary-color);
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-1px);
                }

                .theme-toggle .icon { font-style: normal; }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 10px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    min-height: 40px;
                    gap: 8px;
                    font-family: 'Inter', sans-serif;
                    letter-spacing: 0.025em;
                    position: relative;
                    overflow: hidden;
                }

                .btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                }

                .btn:hover::before {
                    left: 100%;
                }

                .btn-primary {
                    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
                    color: var(--white);
                    box-shadow: 0 4px 15px rgba(57, 181, 74, 0.3);
                }

                .btn-primary:hover {
                    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(57, 181, 74, 0.4);
                }

                .btn-outline {
                    background: var(--surface-translucent);
                    color: var(--text-primary);
                    border: 2px solid var(--surface-border);
                    backdrop-filter: blur(10px);
                }

                .btn-outline:hover {
                    background: var(--surface-hover);
                    color: var(--text-on-elevated);
                    border-color: var(--surface-border);
                    transform: translateY(-1px);
                }

                .cart-toggle {
                    position: relative;
                    background: transparent;
                    border: 2px solid var(--surface-border);
                    color: var(--text-primary);
                    font-size: 1.1rem;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    min-width: 40px;
                    min-height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                }

                .cart-toggle i {
                    display: block;
                    font-size: 1.1rem;
                    line-height: 1;
                    font-style: normal;
                }

                /* Fallback para cuando Font Awesome no se carga */
                .cart-toggle i:empty::before {
                    content: "🛒";
                    font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
                }

                .cart-toggle:hover {
                    color: var(--primary-color);
                    background: var(--surface-translucent);
                    border-color: var(--surface-border);
                    transform: translateY(-1px);
                }

                .cart-count {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    background: linear-gradient(135deg, var(--error-color) 0%, #ff6b6b 100%);
                    color: var(--white);
                    font-size: 0.7rem;
                    font-weight: 700;
                    padding: 3px 6px;
                    border-radius: 12px;
                    min-width: 20px;
                    text-align: center;
                    display: none;
                    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.4);
                    border: 2px solid var(--white);
                    transform-origin: center;
                    transition: transform 0.2s ease;
                }

                @keyframes cart-bump {
                    0% { transform: scale(1); }
                    30% { transform: scale(1.25); }
                    60% { transform: scale(0.9); }
                    100% { transform: scale(1); }
                }

                .cart-count.bump {
                    animation: cart-bump 300ms ease;
                }

                .mobile-menu-toggle {
                    display: none;
                    background: var(--surface-translucent);
                    border: 2px solid var(--surface-border);
                    color: var(--text-primary);
                    font-size: 1.3rem;
                    cursor: pointer;
                    padding: 10px;
                    border-radius: 10px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(10px);
                    min-width: 44px;
                    min-height: 44px;
                    align-items: center;
                    justify-content: center;
                }

                /* Ocultar cualquier elemento que no debería estar visible */
                .header-container > *:not(.logo):not(nav):not(.auth-buttons) {
                    display: none !important;
                }

                /* Asegurar que el botón del carrito se muestre correctamente */
                .cart-toggle {
                    display: flex !important;
                }

                /* Ocultar el botón del carrito si no hay ícono */
                .cart-toggle:empty {
                    display: none !important;
                }

                .mobile-menu-toggle:hover {
                    color: var(--primary-color);
                    background: rgba(57, 181, 74, 0.1);
                    border-color: rgba(57, 181, 74, 0.3);
                    transform: translateY(-1px);
                }

                @media (max-width: 768px) {
                    .nav-menu { display: none; }
                    
                    .mobile-menu-toggle { display: flex; }
                    
                    .auth-buttons {
                        gap: 0.5rem;
                    }
                    
                    .auth-buttons .btn {
                        padding: 6px 12px;
                        font-size: 0.8rem;
                    }

                    /* Mobile dropdown menu */
                    .nav-menu.open {
                        display: flex;
                        flex-direction: column;
                        position: fixed;
                        top: 64px;
                        left: 16px;
                        right: 16px;
                        padding: 8px;
                        gap: 6px;
                        background: var(--background-secondary);
                        border: 1px solid var(--surface-border);
                        border-radius: 12px;
                        box-shadow: var(--box-shadow-light);
                        z-index: 1001;
                    }
                    .nav-menu.open a { padding: 12px 14px; }
                }

                /* Variables se heredan del documento. */
            </style>
            
            <header class="header">
                <div class="header-container">
                    <a href="../pages/index.html" class="logo">
                        <img id="site-logo" src="" alt="Good to Save Logo" />
                    </a>
                    
                    <nav>
                        <ul class="nav-menu">
                                                    <li><a href="../pages/index.html">Home</a></li>
                        <li><a href="../marketplace/marketplace.html">Marketplace</a></li>
                        <li><a href="../pages/about.html">About Us</a></li>
                        <li><a href="../pages/contact.html">Contact</a></li>
                        </ul>
                    </nav>
                    
                    <div class="auth-buttons">
                        <button class="theme-toggle" id="theme-toggle" title="Cambiar tema">
                            <span class="icon" id="theme-icon">🌙</span>
                            <span class="label" id="theme-label">Dark</span>
                        </button>
                        <button class="cart-toggle" id="cart-toggle" title="Shopping Cart">
                            <i class="fas fa-shopping-cart">🛒</i>
                            <span class="cart-count" id="cart-count">0</span>
                        </button>
                        
                        <a href="../auth/auth.html" class="btn btn-primary" data-auth-link>Login or Register</a>
                        
                        <button class="mobile-menu-toggle" id="mobile-menu-toggle">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
            </header>
        `;
    }

    setLogoSrc() {
        try {
            const img = this.shadowRoot.getElementById('site-logo');
            if (!img) return;
            const currentPath = window.location.pathname;
            const base = (currentPath.includes('/marketplace/') || currentPath.includes('/pages/') || currentPath.includes('/auth/')) ? '../' : '';
            const logo = base + 'assets/img/GTSw.png';
            img.src = logo;
        } catch (e) {
            console.error('Error setting logo src:', e);
        }
    }

    setupEventListeners() {
        const cartToggle = this.shadowRoot.getElementById('cart-toggle');
        const mobileMenuToggle = this.shadowRoot.getElementById('mobile-menu-toggle');
        const themeToggle = this.shadowRoot.getElementById('theme-toggle');
        const navMenu = this.shadowRoot.querySelector('.nav-menu');

        cartToggle.addEventListener('click', () => {
            const cartComponent = document.querySelector('app-cart');
            if (cartComponent) {
                cartComponent.toggleCart();
            } else {
                // Si no existe el componente del carrito, emitir evento
                document.dispatchEvent(new CustomEvent('cart-toggle'));
            }
        });

        mobileMenuToggle.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.toggle('open');
            }
        });

        themeToggle.addEventListener('click', () => {
            if (window.ThemeManager) {
                window.ThemeManager.toggle();
            } else {
                // Fallback simple si ThemeManager no está disponible
                const isLight = document.documentElement.classList.toggle('light-theme');
                try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) {}
                document.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: isLight ? 'light' : 'dark' } }));
            }
        });

        document.addEventListener('theme-changed', () => { this.syncThemeButton(); this.setLogoSrc(); });

        // Método de instancia disponible para que el loader global lo invoque
    }

    syncThemeButton() {
        const icon = this.shadowRoot?.getElementById('theme-icon');
        const label = this.shadowRoot?.getElementById('theme-label');
        const theme = (window.ThemeManager?.getTheme && window.ThemeManager.getTheme()) || (document.documentElement.classList.contains('light-theme') ? 'light' : 'dark');
        if (icon && label) {
            if (theme === 'light') {
                icon.textContent = '☀️';
                label.textContent = 'Light';
            } else {
                icon.textContent = '🌙';
                label.textContent = 'Dark';
            }
        }
    }

    updateCartCount(count) {
        const cartCount = this.shadowRoot.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'block' : 'none';
            if (count > 0) {
                cartCount.classList.remove('bump');
                // reflow para reiniciar animación
                void cartCount.offsetWidth;
                cartCount.classList.add('bump');
            }
        }
    }
}

customElements.define('app-header', AppHeader); 