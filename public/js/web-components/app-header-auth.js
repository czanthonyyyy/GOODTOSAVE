class AppHeaderAuth extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setLogoSrc();
    this.populateUser();
    this.setupEventListeners();
    this.syncThemeButton();
    // Aplicar contador inicial del carrito
    try {
      const initial = (typeof window.__cartCount === 'number') ? window.__cartCount : this.readCartCountFromStorage();
      this.updateCartCount(initial);
    } catch (e) {}
  }

  getStoredUser() {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  getUserDisplayName(user) {
    if (!user) return 'Guest';
    if (user.displayName && user.displayName.trim()) return user.displayName.trim();
    if (user.email) return user.email.split('@')[0];
    return 'User';
  }

  getUserInitials(nameLike) {
    const str = (nameLike || '').trim();
    if (!str) return 'U';
    const parts = str.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; background-color: var(--background-secondary); border-bottom: 1px solid var(--text-lighter); position: sticky; top: 0; z-index: 1000; box-shadow: var(--box-shadow-light); width: 100%; }
        * { box-sizing: border-box; }
        .header { width: 100%; display: block; }
        .header-container { display: flex; align-items: center; justify-content: space-between; padding: 1rem 20px; max-width: 1200px; margin: 0 auto; width: 100%; }
        .logo { display: flex; align-items: center; gap: .5rem; color: var(--primary-color); font-weight: 600; font-size: 1.5rem; text-decoration: none; font-family: 'Inter', sans-serif; }
        .logo:hover { color: var(--primary-dark); }
        .logo img { height: 32px; width: auto; display: block; }
        nav { display: flex; align-items: center; }
        .nav-menu { display: flex; align-items: center; gap: 0; list-style: none; margin: 0; padding: 4px; background: var(--surface-translucent); border-radius: 12px; backdrop-filter: blur(10px); border: 1px solid var(--surface-border); }
        .nav-menu a { color: var(--text-primary); font-weight: 500; text-decoration: none; transition: all .3s cubic-bezier(.4,0,.2,1); font-family: 'Inter', sans-serif; padding: 12px 20px; border-radius: 8px; position: relative; display: block; font-size: .9rem; letter-spacing: .025em; }
        .nav-menu a:hover { color: var(--primary-color); background: rgba(57,181,74,.1); transform: translateY(-1px); }
        .auth-area { display: flex; gap: 1rem; align-items: center; }
        .theme-toggle { position: relative; background: transparent; border: 2px solid var(--surface-border); color: var(--text-primary); font-size: 1.1rem; cursor: pointer; padding: 8px 10px; border-radius: 8px; transition: all .3s cubic-bezier(.4,0,.2,1); display:inline-flex; align-items:center; gap:.5rem; }
        .theme-toggle:hover { color: var(--primary-color); background: var(--surface-translucent); border-color: var(--surface-border); transform: translateY(-1px); }
        .theme-toggle .icon { font-style: normal; }
        .cart-toggle { position: relative; background: transparent; border: 2px solid var(--surface-border); color: var(--text-primary); font-size: 1.1rem; cursor: pointer; padding: 8px; border-radius: 8px; transition: all .3s cubic-bezier(.4,0,.2,1); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .cart-toggle:hover { color: var(--primary-color); background: var(--surface-translucent); border-color: var(--surface-border); transform: translateY(-1px); }
        .cart-count { position: absolute; top: -6px; right: -6px; background: linear-gradient(135deg, var(--error-color) 0%, #ff6b6b 100%); color: var(--white); font-size: .7rem; font-weight: 700; padding: 3px 6px; border-radius: 12px; min-width: 20px; text-align: center; display: none; box-shadow: 0 2px 8px rgba(231,76,60,.4); border: 2px solid var(--white); }
        .cart-count { transform-origin: center; transition: transform 0.2s ease; }
        @keyframes cart-bump { 0% { transform: scale(1);} 30% { transform: scale(1.25);} 60% { transform: scale(0.9);} 100% { transform: scale(1);} }
        .cart-count.bump { animation: cart-bump 300ms ease; }
        .profile { position: relative; }
        .profile-button { display: inline-flex; align-items: center; gap: .6rem; padding: 6px 10px; border-radius: 10px; border: 2px solid var(--surface-border); background: var(--surface-translucent); color: var(--text-primary); cursor: pointer; font-family: 'Inter', sans-serif; transition: all .3s cubic-bezier(.4,0,.2,1); }
        .profile-button:hover { background: var(--surface-hover); color: var(--text-on-elevated); border-color: var(--surface-border); transform: translateY(-1px); }
        .avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: .9rem; letter-spacing: .02em; }
        .name { color: var(--text-primary); font-weight: 600; font-size: .9rem; }
        .chev { width: 14px; height: 14px; opacity: .8; }
        .menu { position: absolute; top: calc(100% + 8px); right: 0; background: var(--surface-elevated); border: 1px solid var(--surface-elevated-border); border-radius: 12px; box-shadow: var(--box-shadow-light); min-width: 200px; padding: 8px; display: none; }
        .menu.show { display: block; }
        .menu-item { display: flex; align-items: center; gap: .6rem; padding: 10px 12px; color: var(--text-on-elevated); text-decoration: none; border-radius: 8px; cursor: pointer; }
        .menu-item:hover { background: var(--surface-hover); color: var(--text-on-elevated); }
        @media (max-width: 768px) {
          .name { display: none; }
        }
      </style>
      <header class="header">
        <div class="header-container">
                          <a href="../pages/index.html" class="logo"><img id="site-logo" src="" alt="Good to Save Logo"/></a>
          <nav>
            <ul class="nav-menu">
                              <li><a href="../pages/index.html">Home</a></li>
                              <li><a href="../marketplace/marketplace.html">Marketplace</a></li>
                              <li><a href="../pages/about.html">About Us</a></li>
                              <li><a href="../pages/contact.html">Contact</a></li>
            </ul>
          </nav>
          <div class="auth-area">
            <button class="theme-toggle" id="theme-toggle" title="Cambiar tema">
              <span class="icon" id="theme-icon">🌙</span>
              <span class="label" id="theme-label">Dark</span>
            </button>
            <button class="cart-toggle" id="cart-toggle" title="Shopping Cart">
              <i class="fas fa-shopping-cart">🛒</i>
              <span class="cart-count" id="cart-count">0</span>
            </button>
            <button class="mobile-menu-toggle" id="mobile-menu-toggle">
              <i class="fas fa-bars"></i>
            </button>
            <div class="profile">
              <button class="profile-button" id="profile-button" title="Account">
                <span class="avatar" id="avatar">U</span>
                <span class="name" id="user-name">User</span>
                <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div class="menu" id="profile-menu">
                <a class="menu-item" id="menu-profile"><span>My Profile</span></a>
                <a class="menu-item" id="menu-orders"><span>My Orders</span></a>
                <div style="height:1px;background:rgba(255,255,255,.08);margin:6px 0;"></div>
                <a class="menu-item" id="menu-logout"><span>Log out</span></a>
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  setLogoSrc() {
    try {
      const img = this.shadowRoot.getElementById('site-logo');
      if (!img) return;
      const current = window.location.pathname;
      const base = (current.includes('/pages/') || current.includes('/marketplace/') || current.includes('/auth/')) ? '../' : '';
      const logo = base + 'assets/img/GTSw.png';
      img.src = logo;
    } catch (e) {}
  }

  populateUser() {
    const user = this.getStoredUser();
    const displayName = this.getUserDisplayName(user);
    const avatar = this.shadowRoot.getElementById('avatar');
    const nameEl = this.shadowRoot.getElementById('user-name');
    if (avatar) avatar.textContent = this.getUserInitials(displayName);
    if (nameEl) nameEl.textContent = displayName;
  }

  setupEventListeners() {
    const cartToggle = this.shadowRoot.getElementById('cart-toggle');
    const themeToggle = this.shadowRoot.getElementById('theme-toggle');
    const mobileMenuToggle = this.shadowRoot.getElementById('mobile-menu-toggle');
    const navMenu = this.shadowRoot.querySelector('.nav-menu');
    const profileBtn = this.shadowRoot.getElementById('profile-button');
    const menu = this.shadowRoot.getElementById('profile-menu');
    const logout = this.shadowRoot.getElementById('menu-logout');
    const profile = this.shadowRoot.getElementById('menu-profile');
    const orders = this.shadowRoot.getElementById('menu-orders');

    cartToggle?.addEventListener('click', () => {
      const cartComponent = document.querySelector('app-cart');
      if (cartComponent?.toggleCart) cartComponent.toggleCart();
      else document.dispatchEvent(new CustomEvent('cart-toggle'));
    });

    profileBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      menu?.classList.toggle('show');
    });

    mobileMenuToggle?.addEventListener('click', () => {
      navMenu?.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!this.shadowRoot.contains(e.target)) {
        menu?.classList.remove('show');
      }
    });

    profile?.addEventListener('click', () => {
      // Ir al dashboard de usuario
                      window.location.href = '../pages/dashboard.html';
    });

    orders?.addEventListener('click', () => {
      // Placeholder: por ahora ir al marketplace o futura página de pedidos
              window.location.href = '../marketplace/marketplace.html';
    });

    logout?.addEventListener('click', async () => {
      try {
        if (window.firebaseAuthService?.signOut) {
          await window.firebaseAuthService.signOut();
        }
      } catch (e) {}
      localStorage.removeItem('user');
      // Recargar o llevar a home
      window.location.href = 'index.html';
    });

    themeToggle?.addEventListener('click', () => {
      if (window.ThemeManager) {
        window.ThemeManager.toggle();
      } else {
        const isLight = document.documentElement.classList.toggle('light-theme');
        try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) {}
        document.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: isLight ? 'light' : 'dark' } }));
      }
    });

    document.addEventListener('theme-changed', () => { this.syncThemeButton(); this.setLogoSrc(); });

    // Exponer método para actualizar contador del carrito
    this.updateCartCount = (count) => {
      const cartCount = this.shadowRoot.getElementById('cart-count');
      if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'block' : 'none';
        if (count > 0) {
          cartCount.classList.remove('bump');
          void cartCount.offsetWidth;
          cartCount.classList.add('bump');
        }
      }
    };
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

  readCartCountFromStorage() {
    try {
      const raw = localStorage.getItem('foodmarketplace_cart');
      if (!raw) return 0;
      const items = JSON.parse(raw) || [];
      return items.reduce((acc, it) => acc + (it.quantity || 0), 0);
    } catch (e) { return 0; }
  }
}

customElements.define('app-header-auth', AppHeaderAuth);
