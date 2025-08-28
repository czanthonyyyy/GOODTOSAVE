class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setLogoSrc();
        this.setupEventListeners();
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
                    font-size: 2.2rem;
                    text-decoration: none;
                    font-family: 'Inter', sans-serif;
                    flex-shrink: 0;
                }

                .logo:hover {
                    color: var(--primary-dark);
                }

                .logo img {
                    height: 64px;
                    width: auto;
                    display: block;
                }

                nav {
                    display: flex;
                    align-items: center;
                    position: relative;
                }

                .nav-menu {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    list-style: none;
                    margin: 0;
                    padding: 6px;
                    background: rgba(255, 255, 255, 0.04);
                    border-radius: 16px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
                }

                /* Indicador activo deslizante */
                .nav-indicator {
                    position: absolute;
                    height: 3px;
                    left: 0;
                    bottom: 6px;
                    width: 0;
                    border-radius: 3px;
                    background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
                    box-shadow: 0 4px 12px rgba(57,181,74,0.35);
                    transition: transform .28s cubic-bezier(.4,0,.2,1), width .28s cubic-bezier(.4,0,.2,1);
                    transform: translateX(0px);
                    pointer-events: none;
                }

                .nav-menu li {
                    position: relative;
                }

                .nav-menu a {
                    color: var(--text-primary);
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: 'Inter', sans-serif;
                    padding: 10px 18px;
                    border-radius: 12px;
                    position: relative;
                    display: block;
                    font-size: 0.92rem;
                    letter-spacing: 0.02em;
                    isolation: isolate;
                }

                .nav-menu a:hover {
                    color: var(--primary-color);
                    background: rgba(57, 181, 74, 0.1);
                    transform: translateY(-1px);
                }

                /* Fondo resaltado tipo "pill" */
                .nav-menu a::before {
                    content: '';
                    position: absolute;
                    inset: 2px;
                    border-radius: 10px;
                    background: radial-gradient(120% 120% at 50% 0%, rgba(57,181,74,0.16) 0%, rgba(46,204,113,0.12) 40%, rgba(255,255,255,0.04) 100%);
                    box-shadow: 0 6px 16px rgba(57,181,74,0.15), inset 0 0 0 1px rgba(255,255,255,0.06);
                    opacity: 0;
                    transform: translateY(4px) scale(0.96);
                    transition: opacity .25s ease, transform .25s ease;
                    z-index: -1;
                }

                /* Subrayado fino para refuerzo visual */
                .nav-menu a::after {
                    content: '';
                    position: absolute;
                    left: 16px;
                    right: 16px;
                    bottom: 7px;
                    height: 2px;
                    background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
                    opacity: 0;
                    transform: translateY(4px);
                    transition: opacity .25s ease, transform .25s ease;
                    border-radius: 2px;
                }

                .nav-menu a:hover,
                .nav-menu a:focus-visible {
                    color: #e8f5e9;
                    transform: translateY(-1px);
                }

                .nav-menu a:hover::before,
                .nav-menu a:focus-visible::before {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }

                .nav-menu a:hover::after,
                .nav-menu a:focus-visible::after {
                    opacity: .9;
                    transform: translateY(0);
                }

                .nav-menu a.active {
                    color: #e8f5e9;
                    text-shadow: 0 1px 8px rgba(57,181,74,0.35);
                }

                .nav-menu a.active::before {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    background: radial-gradient(140% 140% at 50% -10%, rgba(57,181,74,0.22) 0%, rgba(46,204,113,0.16) 40%, rgba(255,255,255,0.05) 100%);
                }

                .nav-menu a.active::after {
                    opacity: 1;
                    transform: translateY(0);
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
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-primary);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                }

                .btn-outline:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--white);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-1px);
                }

                .cart-toggle {
                    position: relative;
                    background: transparent;
                    border: 2px solid rgba(255, 255, 255, 0.1);
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

                .cart-toggle .icon {
                    display: block;
                    width: 20px;
                    height: 20px;
                    line-height: 1;
                }

                .cart-toggle:hover {
                    color: var(--primary-color);
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.2);
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
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.1);
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
                    .nav-menu {
                        display: none;
                    }
                    
                    .mobile-menu-toggle {
                        display: flex;
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
                    --primary-light: #2ecc71;
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
                        <span class="nav-indicator" id="nav-indicator"></span>
                    </nav>
                    
                    <div class="auth-buttons">
                        <button class="cart-toggle" id="cart-toggle" title="Shopping Cart" aria-label="Shopping Cart">
                            <span class="icon" aria-hidden="true">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 18C6.44772 18 6 18.4477 6 19C6 19.5523 6.44772 20 7 20C7.55228 20 8 19.5523 8 19C8 18.4477 7.55228 18 7 18Z" fill="currentColor"/>
                                    <path d="M17 18C16.4477 18 16 18.4477 16 19C16 19.5523 16.4477 20 17 20C17.5523 20 18 19.5523 18 19C18 18.4477 17.5523 18 17 18Z" fill="currentColor"/>
                                    <path d="M3 4H5L6.68 13.39C6.7717 13.9154 7.0463 14.3914 7.45406 14.7321C7.86183 15.0728 8.37583 15.2551 8.905 15.25H17.55C18.0792 15.2551 18.5932 15.0728 19.0009 14.7321C19.4087 14.3914 19.6833 13.9154 19.775 13.39L21 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
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
            
            // Determinar la ruta correcta basada en la ubicación actual
            const currentPath = window.location.pathname;
            let logoPath;
            
            if (currentPath.includes('/pages/')) {
                // Calcular profundidad dentro de /pages/ para armar la ruta relativa correcta
                const after = currentPath.split('/pages/')[1] || '';
                const depth = Math.max(0, (after.match(/\//g) || []).length); // subcarpetas dentro de pages
                const up = '../'.repeat(depth + 1); // subir a la raíz pública y llegar a /assets/
                logoPath = `${up}assets/img/GTSw.png`;
            } else if (currentPath.includes('/marketplace/')) {
                logoPath = '../assets/img/GTSw.png';
            } else if (currentPath.includes('/auth/')) {
                logoPath = '../assets/img/GTSw.png';
            } else {
                logoPath = 'assets/img/GTSw.png';
            }
            
            img.src = logoPath;
        } catch (e) {
            console.error('Error setting logo src:', e);
        }
    }

    setupEventListeners() {
        const cartToggle = this.shadowRoot.getElementById('cart-toggle');
        const mobileMenuToggle = this.shadowRoot.getElementById('mobile-menu-toggle');
        const nav = this.shadowRoot.querySelector('nav');
        const navMenu = this.shadowRoot.querySelector('.nav-menu');
        const indicator = this.shadowRoot.getElementById('nav-indicator');

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
            // Mobile menu functionality can be added here
            console.log('Mobile menu toggle clicked');
        });

        // Indicador activo: calcula posición/anchura según enlace activo
        const updateIndicator = (activeLink) => {
            if (!nav || !navMenu || !indicator || !activeLink) return;
            const menuRect = navMenu.getBoundingClientRect();
            const linkRect = activeLink.getBoundingClientRect();
            const left = linkRect.left - menuRect.left + 16; // padding lateral visual
            const width = Math.max(24, linkRect.width - 32);
            indicator.style.width = `${width}px`;
            indicator.style.transform = `translateX(${left}px)`;
        };

        const resolveActiveLink = () => {
            const links = Array.from(this.shadowRoot.querySelectorAll('.nav-menu a'));
            const current = window.location.pathname.replace(/\/index\.html$/, '/pages/index.html');
            let active = links.find(a => new URL(a.href, window.location.origin).pathname === current);
            if (!active) {
                // heurística por segmento
                active = links.find(a => current.includes(new URL(a.href, window.location.origin).pathname.replace(/\.html$/, '')));
            }
            if (!active) active = links[0];
            links.forEach(a => a.classList.toggle('active', a === active));
            updateIndicator(active);
        };

        // Inicializar al conectar
        resolveActiveLink();

        // Recalcular en resize
        const onResize = () => resolveActiveLink();
        window.addEventListener('resize', onResize);

        // Mover indicador al hover para feedback
        this.shadowRoot.querySelectorAll('.nav-menu a').forEach(a => {
            a.addEventListener('mouseenter', () => updateIndicator(a));
            a.addEventListener('mouseleave', resolveActiveLink);
            a.addEventListener('focus', () => updateIndicator(a));
            a.addEventListener('blur', resolveActiveLink);
        });

        // Método de instancia disponible para que el loader global lo invoque
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