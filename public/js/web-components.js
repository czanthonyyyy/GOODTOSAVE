// Load and register web components
class WebComponentsLoader {
    constructor() {
        this.componentsLoaded = false;
    }

    async loadComponents() {
        if (this.componentsLoaded) return;

        try {
            console.log('Iniciando carga de web components...');
            
            // Cargar el header component
            console.log('Cargando app-header.js...');
            await this.loadScript('../components/web-components/app-header.js');
            console.log('app-header.js cargado exitosamente');
            
            // Cargar header autenticado
            console.log('Cargando app-header-auth.js...');
            await this.loadScript('../components/web-components/app-header-auth.js');
            console.log('app-header-auth.js cargado exitosamente');
            
            // Cargar el footer component
            console.log('Cargando app-footer.js...');
            await this.loadScript('../components/web-components/app-footer.js');
            console.log('app-footer.js cargado exitosamente');
            
            // Cargar el cart component
            console.log('Cargando app-cart.js...');
            await this.loadScript('../components/web-components/app-cart.js');
            console.log('app-cart.js cargado exitosamente');
            
            this.componentsLoaded = true;
            console.log('Web components cargados exitosamente');
            
            // Emit event when components are ready
            document.dispatchEvent(new CustomEvent('web-components-ready'));
            console.log('Evento web-components-ready emitido');
            
        } catch (error) {
            console.error('Error al cargar los web components:', error);
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                console.log(`Script cargado exitosamente: ${src}`);
                resolve();
            };
            script.onerror = (error) => {
                console.error(`Error al cargar script: ${src}`, error);
                reject(error);
            };
            document.head.appendChild(script);
        });
    }
}

// Inicializar el cargador de componentes
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
    console.log('Inicializando web components...');
    
    // Reemplazar el header existente con el web component adecuado
    const existingHeader = document.querySelector('header.main-header');
    if (existingHeader) {
        console.log('Reemplazando header existente');
        const user = getStoredUser();
        const headerEl = document.createElement(user ? 'app-header-auth' : 'app-header');
        existingHeader.parentNode.replaceChild(headerEl, existingHeader);
        // Initialize cart count with stored data
        const initCount = typeof window.__cartCount === 'number' ? window.__cartCount : getStoredCartCount();
        if (typeof headerEl.updateCartCount === 'function') headerEl.updateCartCount(initCount);
    }

    // If a header exists, ensure the correct one based on session
    const headerComponents = document.querySelectorAll('app-header, app-header-auth');
    if (headerComponents.length > 0) {
        const user = getStoredUser();
        const desiredTag = user ? 'app-header-auth' : 'app-header';
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
        // Si no hay ninguno, insertar uno al inicio del body como fallback
        const user = getStoredUser();
        const headerEl = document.createElement(user ? 'app-header-auth' : 'app-header');
        document.body.insertBefore(headerEl, document.body.firstChild);
        // Initialize cart count with stored data
        const initCount = typeof window.__cartCount === 'number' ? window.__cartCount : getStoredCartCount();
        if (typeof headerEl.updateCartCount === 'function') headerEl.updateCartCount(initCount);
    }

    // Reemplazar el footer existente con el web component
    const existingFooter = document.querySelector('footer.main-footer');
    if (existingFooter) {
        console.log('Reemplazando footer existente');
        const appFooter = document.createElement('app-footer');
        existingFooter.parentNode.replaceChild(appFooter, existingFooter);
    }

    // Add cart if not present
    if (!document.querySelector('app-cart')) {
        console.log('Agregando app-cart');
        const appCart = document.createElement('app-cart');
        document.body.appendChild(appCart);
        
        // Ensure cart is closed by default
        setTimeout(() => {
            if (appCart.classList.contains('open')) {
                appCart.classList.remove('open');
            }
        }, 100);
    }

    // Configurar event listeners para los componentes
    setupComponentEventListeners();
    
    console.log('Web components inicializados');
}

// Configurar event listeners para los web components
function setupComponentEventListeners() {
// Event listener for cart toggle
    document.addEventListener('cart-toggle', (event) => {
        console.log('Cart toggle fired');
        // Emit event so cart script handles it
        document.dispatchEvent(new CustomEvent('show-cart'));
    });

// Event listener for newsletter subscription
    document.addEventListener('newsletter-subscribe', (event) => {
        console.log('New newsletter subscription:', event.detail.email);
        // Por ejemplo, enviar los datos a un servidor
    });
}

// Helper para leer usuario almacenado
function getStoredUser() {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

// Helper para leer conteo del carrito desde localStorage
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

// Función para actualizar el contador del carrito desde cualquier script
function updateCartCount(count) {
    // Guardar último valor global para headers que se monten después
    window.__cartCount = count;

    // Buscar header público o autenticado
    const headerEl = document.querySelector('app-header') || document.querySelector('app-header-auth');
    if (headerEl && typeof headerEl.updateCartCount === 'function') {
        headerEl.updateCartCount(count);
    }
}

// Función para actualizar el contador de alimentos salvados
function updateFoodSaved(count) {
    const appFooter = document.querySelector('app-footer');
    if (appFooter && appFooter.updateFoodSaved) {
        appFooter.updateFoodSaved(count);
    }
}

// Exponer funciones para uso global
window.WebComponentsLoader = WebComponentsLoader;
window.initializeWebComponents = initializeWebComponents;
window.updateCartCount = updateCartCount;
window.updateFoodSaved = updateFoodSaved; 