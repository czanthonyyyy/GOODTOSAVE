// Load and register web components
class WebComponentsLoader {
    constructor() {
        this.componentsLoaded = false;
    }

    async loadComponents() {
        if (this.componentsLoaded) return;

        try {
            console.log('Starting web components load...');
            
            // Detect proper base when served under /public
            const publicBase = (function(){
                try { return window.location.pathname.includes('/public/') ? '/public' : ''; } catch(e) { return ''; }
            })();

            // Load header component
            console.log('Loading app-header.js...');
            await this.loadScript(publicBase + '/components/web-components/app-header.js');
            console.log('app-header.js loaded successfully');
            
            // Load authenticated header
            console.log('Loading app-header-auth.js...');
            await this.loadScript(publicBase + '/components/web-components/app-header-auth.js');
            console.log('app-header-auth.js loaded successfully');
            
            // Load footer component
            console.log('Loading app-footer.js...');
            await this.loadScript(publicBase + '/components/web-components/app-footer.js');
            console.log('app-footer.js loaded successfully');
            
            // Load cart component
            console.log('Loading app-cart.js...');
            await this.loadScript(publicBase + '/components/web-components/app-cart.js');
            console.log('app-cart.js loaded successfully');
            
            this.componentsLoaded = true;
            console.log('Web components loaded successfully');
            
            // Emit event when components are ready
            document.dispatchEvent(new CustomEvent('web-components-ready'));
            console.log('Event web-components-ready dispatched');
            
        } catch (error) {
            console.error('Error loading web components:', error);
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                console.log(`Script loaded successfully: ${src}`);
                resolve();
            };
            script.onerror = (error) => {
                console.error(`Error loading script: ${src}`, error);
                reject(error);
            };
            document.head.appendChild(script);
        });
    }
}

// Initialize components loader
const componentsLoader = new WebComponentsLoader();

// Load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        componentsLoader.loadComponents().then(() => {
            initializeWebComponents();
        });
    });
} else {
    componentsLoader.loadComponents().then(() => {
        initializeWebComponents();
    });
}

// Function to initialize components on a page
function initializeWebComponents() {
    console.log('Initializing web components...');
    
    // Replace existing header with the appropriate web component
    const existingHeader = document.querySelector('header.main-header');
    if (existingHeader) {
        console.log('Replacing existing header');
        // Force public header across the site
        const headerEl = document.createElement('app-header');
        existingHeader.parentNode.replaceChild(headerEl, existingHeader);
        // Initialize cart count with stored data
        const initCount = typeof window.__cartCount === 'number' ? window.__cartCount : getStoredCartCount();
        if (typeof headerEl.updateCartCount === 'function') headerEl.updateCartCount(initCount);
    }

    // If a header exists, ensure it is the public header
    const headerComponents = document.querySelectorAll('app-header, app-header-auth');
    if (headerComponents.length > 0) {
        const desiredTag = 'app-header';
        headerComponents.forEach((el) => {
            if (el.tagName.toLowerCase() !== desiredTag) {
                const replacement = document.createElement(desiredTag);
                el.parentNode.replaceChild(replacement, el);
                // Initialize cart count with stored data
                const initCount = typeof window.__cartCount === 'number' ? window.__cartCount : getStoredCartCount();
                if (typeof replacement.updateCartCount === 'function') replacement.updateCartCount(initCount);
            }
        });
    } else {
        // If none present, insert one at the start of the body as a fallback
        const headerEl = document.createElement('app-header');
        document.body.insertBefore(headerEl, document.body.firstChild);
        // Initialize cart count with stored data
        const initCount = typeof window.__cartCount === 'number' ? window.__cartCount : getStoredCartCount();
        if (typeof headerEl.updateCartCount === 'function') headerEl.updateCartCount(initCount);
    }

    // Replace or insert footer web component on all pages
    const existingFooter = document.querySelector('footer.main-footer');
    if (existingFooter) {
        console.log('Replacing existing footer');
        const appFooter = document.createElement('app-footer');
        existingFooter.parentNode.replaceChild(appFooter, existingFooter);
    }

    // If no <app-footer> is present, append one at the end of body
    if (!document.querySelector('app-footer')) {
        console.log('Adding app-footer');
        const appFooter = document.createElement('app-footer');
        document.body.appendChild(appFooter);
    }

    // Add cart if not present
    if (!document.querySelector('app-cart')) {
        console.log('Adding app-cart');
        const appCart = document.createElement('app-cart');
        document.body.appendChild(appCart);
        
        // Ensure cart is closed by default
        setTimeout(() => {
            if (appCart.classList.contains('open')) {
                appCart.classList.remove('open');
            }
        }, 100);
    }

    // Configure event listeners for the components
    setupComponentEventListeners();
    
    console.log('Web components initialized');
}

// Configure event listeners for the web components
function setupComponentEventListeners() {
// Event listener for cart toggle
    document.addEventListener('cart-toggle', (event) => {
        console.log('Cart toggle fired');
        if (typeof window.toggleCart === 'function') {
            window.toggleCart();
        } else {
            document.dispatchEvent(new CustomEvent('show-cart'));
        }
    });

// Event listener for newsletter subscription
    document.addEventListener('newsletter-subscribe', (event) => {
        console.log('New newsletter subscription:', event.detail.email);
        // For example, send the data to a server
    });
}

// Helper to read stored user
function getStoredUser() {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

// Helper to read cart count from localStorage
function getStoredCartCount() {
    try {
        const raw = localStorage.getItem('foodmarketplace_cart');
        if (!raw) return 0;
        const items = JSON.parse(raw) || [];
        return items.reduce((acc, it) => acc + (it.quantity || 0), 0);
    } catch (e) {
        return 0;
    }
}

// Function to update cart count from any script
function updateCartCount(count) {
    // Save last global value for headers that mount later
    window.__cartCount = count;

    // Find public or authenticated header
    const headerEl = document.querySelector('app-header') || document.querySelector('app-header-auth');
    if (headerEl && typeof headerEl.updateCartCount === 'function') {
        headerEl.updateCartCount(count);
    }
}

// Function to update saved food counter
function updateFoodSaved(count) {
    const appFooter = document.querySelector('app-footer');
    if (appFooter && appFooter.updateFoodSaved) {
        appFooter.updateFoodSaved(count);
    }
}

// Expose functions for global use
window.WebComponentsLoader = WebComponentsLoader;
window.initializeWebComponents = initializeWebComponents;
window.updateCartCount = updateCartCount;
window.updateFoodSaved = updateFoodSaved; 