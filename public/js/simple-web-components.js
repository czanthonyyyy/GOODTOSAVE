// Script simple para cargar web components
(function() {
    console.log('🚀 Simple Web Components Loader iniciando...');
    
    // Función para cargar un script
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                console.log(`✅ Script cargado: ${src}`);
                resolve();
            };
            script.onerror = (error) => {
                console.error(`❌ Error cargando: ${src}`, error);
                reject(error);
            };
            document.head.appendChild(script);
        });
    }
    
    // Resuelve la base correcta para /public cuando se sirve localmente
    function getPublicBase() {
        try {
            return window.location.pathname.includes('/public/') ? '/public' : '';
        } catch (e) {
            return '';
        }
    }
    const PUBLIC_BASE = getPublicBase();

    // Cargar todos los componentes
    async function loadAllComponents() {
        try {
            console.log('📦 Cargando web components...');
            
            // Cargar en paralelo
            await Promise.all([
                loadScript(`${PUBLIC_BASE}/components/web-components/app-header.js`),
                loadScript(`${PUBLIC_BASE}/components/web-components/app-header-auth.js`),
                loadScript(`${PUBLIC_BASE}/components/web-components/app-footer.js`),
                loadScript(`${PUBLIC_BASE}/components/web-components/app-cart.js`)
            ]);
            
            console.log('✅ Todos los web components cargados');
            
            // Verificar que se cargaron
            setTimeout(() => {
                // Ensure public header is present and replace any auth header
                const headerAuth = document.querySelector('app-header-auth');
                if (headerAuth) {
                    const replacement = document.createElement('app-header');
                    headerAuth.parentNode.replaceChild(replacement, headerAuth);
                }
                let header = document.querySelector('app-header');
                if (!header) {
                    header = document.createElement('app-header');
                    document.body.insertBefore(header, document.body.firstChild);
                }
                let footer = document.querySelector('app-footer');
                if (!footer) {
                    footer = document.createElement('app-footer');
                    document.body.appendChild(footer);
                }
                // Ensure cart component exists for header toggle to work everywhere
                let cart = document.querySelector('app-cart');
                if (!cart) {
                    cart = document.createElement('app-cart');
                    document.body.appendChild(cart);
                }
                
                console.log('🔍 Verificando componentes:');
                console.log('Header:', header);
                console.log('Footer:', footer);
                console.log('Cart:', cart);
                
                if (header || footer || headerAuth) {
                    console.log('🎉 Web components funcionando correctamente');
                    document.dispatchEvent(new CustomEvent('web-components-ready'));
                } else {
                    console.error('❌ No se encontraron web components');
                }
            }, 500);
            
        } catch (error) {
            console.error('❌ Error cargando web components:', error);
        }
    }
    
    // Iniciar carga cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllComponents);
    } else {
        loadAllComponents();
    }
    
    // Exponer función para recargar
    window.reloadWebComponents = loadAllComponents;
    
    console.log('✅ Simple Web Components Loader listo');
})();
