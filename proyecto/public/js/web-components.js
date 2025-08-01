// Cargar y registrar los web components
class WebComponentsLoader {
    constructor() {
        this.componentsLoaded = false;
    }

    async loadComponents() {
        if (this.componentsLoaded) return;

        try {
            // Cargar el header component
            await this.loadScript('../src/components/web-components/app-header.js');
            
            // Cargar el footer component
            await this.loadScript('../src/components/web-components/app-footer.js');
            
            this.componentsLoaded = true;
            console.log('Web components cargados exitosamente');
            
            // Emitir evento cuando los componentes estén listos
            document.dispatchEvent(new CustomEvent('web-components-ready'));
            
        } catch (error) {
            console.error('Error al cargar los web components:', error);
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}

// Inicializar el cargador de componentes
const componentsLoader = new WebComponentsLoader();

// Cargar componentes cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        componentsLoader.loadComponents();
    });
} else {
    componentsLoader.loadComponents();
}

// Función para inicializar los componentes en una página
function initializeWebComponents() {
    // Reemplazar el header existente con el web component
    const existingHeader = document.querySelector('header.main-header');
    if (existingHeader) {
        const appHeader = document.createElement('app-header');
        existingHeader.parentNode.replaceChild(appHeader, existingHeader);
    }

    // Reemplazar el footer existente con el web component
    const existingFooter = document.querySelector('footer.main-footer');
    if (existingFooter) {
        const appFooter = document.createElement('app-footer');
        existingFooter.parentNode.replaceChild(appFooter, existingFooter);
    }

    // Configurar event listeners para los componentes
    setupComponentEventListeners();
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