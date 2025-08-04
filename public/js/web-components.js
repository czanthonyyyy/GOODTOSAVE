// Cargar y registrar los web components
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
            await this.loadScript('js/web-components/app-header.js');
            console.log('app-header.js cargado exitosamente');
            
            // Cargar el footer component
            console.log('Cargando app-footer.js...');
            await this.loadScript('js/web-components/app-footer.js');
            console.log('app-footer.js cargado exitosamente');
            
            // Cargar el cart component
            console.log('Cargando app-cart.js...');
            await this.loadScript('js/web-components/app-cart.js');
            console.log('app-cart.js cargado exitosamente');
            
            this.componentsLoaded = true;
            console.log('Web components cargados exitosamente');
            
            // Emitir evento cuando los componentes estén listos
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

// Cargar componentes cuando el DOM esté listo
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

// Función para inicializar los componentes en una página
function initializeWebComponents() {
    console.log('Inicializando web components...');
    
    // Reemplazar el header existente con el web component
    const existingHeader = document.querySelector('header.main-header');
    if (existingHeader) {
        console.log('Reemplazando header existente');
        const appHeader = document.createElement('app-header');
        existingHeader.parentNode.replaceChild(appHeader, existingHeader);
    }

    // Reemplazar el footer existente con el web component
    const existingFooter = document.querySelector('footer.main-footer');
    if (existingFooter) {
        console.log('Reemplazando footer existente');
        const appFooter = document.createElement('app-footer');
        existingFooter.parentNode.replaceChild(appFooter, existingFooter);
    }

    // Agregar el carrito si no existe
    if (!document.querySelector('app-cart')) {
        console.log('Agregando app-cart');
        const appCart = document.createElement('app-cart');
        document.body.appendChild(appCart);
    }

    // Configurar event listeners para los componentes
    setupComponentEventListeners();
    
    console.log('Web components inicializados');
}

// Configurar event listeners para los web components
function setupComponentEventListeners() {
    // Event listener para el toggle del carrito
    document.addEventListener('cart-toggle', (event) => {
        console.log('Carrito toggle activado');
        // Aquí puedes agregar la lógica para mostrar/ocultar el carrito
        // Por ejemplo, emitir un evento para que el script del carrito lo maneje
        document.dispatchEvent(new CustomEvent('show-cart'));
    });

    // Event listener para la suscripción al newsletter
    document.addEventListener('newsletter-subscribe', (event) => {
        console.log('Nueva suscripción al newsletter:', event.detail.email);
        // Aquí puedes agregar la lógica para manejar la suscripción
        // Por ejemplo, enviar los datos a un servidor
    });
}

// Función para actualizar el contador del carrito desde cualquier script
function updateCartCount(count) {
    const appHeader = document.querySelector('app-header');
    if (appHeader && appHeader.updateCartCount) {
        appHeader.updateCartCount(count);
    }
}

// Función para actualizar el contador de alimentos salvados
function updateFoodSaved(count) {
    const appFooter = document.querySelector('app-footer');
    if (appFooter && appFooter.updateFoodSaved) {
        appFooter.updateFoodSaved(count);
    }
}

// Exportar funciones para uso global
window.WebComponentsLoader = WebComponentsLoader;
window.initializeWebComponents = initializeWebComponents;
window.updateCartCount = updateCartCount;
window.updateFoodSaved = updateFoodSaved; 