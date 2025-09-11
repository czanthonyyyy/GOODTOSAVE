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
    // Apply initial cart counter
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
        .logo img { height: 100px; width: auto; display: block; }
        nav { display: flex; align-items: center; }
        .nav-menu { display: flex; align-items: center; gap: 0; list-style: none; margin: 0; padding: 4px; background: rgba(255,255,255,.05); border-radius: 12px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.1); }
        .nav-menu a { color: var(--text-primary); font-weight: 500; text-decoration: none; transition: all .3s cubic-bezier(.4,0,.2,1); font-family: 'Inter', sans-serif; padding: 12px 20px; border-radius: 8px; position: relative; display: block; font-size: .9rem; letter-spacing: .025em; }
        .nav-menu a:hover { color: var(--primary-color); background: rgba(57,181,74,.1); transform: translateY(-1px); }
        .auth-area { display: flex; gap: 1rem; align-items: center; }
        .logout-btn { display: inline-flex; align-items: center; gap: .5rem; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,.12); background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%); color: var(--white); font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif; transition: all .3s cubic-bezier(.4,0,.2,1); }
        .logout-btn:hover { background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(57,181,74,.35); }
        .cart-toggle { position: relative; background: transparent; border: 2px solid rgba(255,255,255,.1); color: var(--text-primary); font-size: 1.1rem; cursor: pointer; padding: 8px; border-radius: 8px; transition: all .3s cubic-bezier(.4,0,.2,1); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .cart-toggle:hover { color: var(--primary-color); background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.2); transform: translateY(-1px); }
        .cart-count { position: absolute; top: -6px; right: -6px; background: linear-gradient(135deg, var(--error-color) 0%, #ff6b6b 100%); color: var(--white); font-size: .7rem; font-weight: 700; padding: 3px 6px; border-radius: 12px; min-width: 20px; text-align: center; display: none; box-shadow: 0 2px 8px rgba(231,76,60,.4); border: 2px solid var(--white); }
        .cart-count { transform-origin: center; transition: transform 0.2s ease; }
        @keyframes cart-bump { 0% { transform: scale(1);} 30% { transform: scale(1.25);} 60% { transform: scale(0.9);} 100% { transform: scale(1);} }
        .cart-count.bump { animation: cart-bump 300ms ease; }
        .profile { position: relative; }
        .profile-button { display: inline-flex; align-items: center; gap: .6rem; padding: 6px 10px; border-radius: 10px; border: 2px solid rgba(255,255,255,.1); background: rgba(255,255,255,.05); color: var(--text-primary); cursor: pointer; font-family: 'Inter', sans-serif; transition: all .3s cubic-bezier(.4,0,.2,1); }
        .profile-button:hover { background: rgba(255,255,255,.1); color: var(--white); border-color: rgba(255,255,255,.2); transform: translateY(-1px); }
        .avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: .9rem; letter-spacing: .02em; }
        .name { color: var(--text-primary); font-weight: 600; font-size: .9rem; }
        .chev { width: 14px; height: 14px; opacity: .8; }
        .menu { position: absolute; top: calc(100% + 8px); right: 0; background: #1a1a1a; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.25); min-width: 200px; padding: 8px; display: none; }
        .menu.show { display: block; }
        .menu-item { display: flex; align-items: center; gap: .6rem; padding: 10px 12px; color: var(--text-primary); text-decoration: none; border-radius: 8px; cursor: pointer; }
        .menu-item:hover { background: rgba(255,255,255,.06); color: var(--white); }
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
            <button class="logout-btn" id="logout-visible" title="Log out">Log out</button>
          </div>
        </div>
      </header>
    `;
  }

  setLogoSrc() {
    try {
      const img = this.shadowRoot.getElementById('site-logo');
      if (!img) return;
      const inPages = window.location.pathname.includes('/pages/');
      const src = (inPages ? '../' : '') + 'assets/img/GTSw.png';
      img.src = src;
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
    const profileBtn = this.shadowRoot.getElementById('profile-button');
    const menu = this.shadowRoot.getElementById('profile-menu');
    const logout = this.shadowRoot.getElementById('menu-logout');
    const logoutVisible = this.shadowRoot.getElementById('logout-visible');
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

    document.addEventListener('click', (e) => {
      if (!this.shadowRoot.contains(e.target)) {
        menu?.classList.remove('show');
      }
    });

    profile?.addEventListener('click', async () => {
      try {
        const role = await window.RolesHelper?.getCurrentUserRole?.();
        if (role === 'provider') {
          window.location.href = '../pages/provider-dashboard.html';
          return;
        }
      } catch (e) {}
      // If not a provider or on error, go to homepage
      window.location.href = '../pages/index.html';
    });

    orders?.addEventListener('click', () => {
      // Placeholder: for now go to marketplace or future orders page
      window.location.href = '../marketplace/marketplace.html';
    });

    const doLogout = async () => {
      try {
        if (window.firebaseAuthService?.signOut) {
          await window.firebaseAuthService.signOut();
        }
      } catch (e) {}
      localStorage.removeItem('user');
      // Reload or go to home
      window.location.href = 'index.html';
    };
    logout?.addEventListener('click', doLogout);
    logoutVisible?.addEventListener('click', doLogout);

    // Expose method to update cart counter
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
