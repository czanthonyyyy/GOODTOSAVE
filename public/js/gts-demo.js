/**
 * GTS Demo - Demostración de todas las funcionalidades implementadas
 * Este archivo muestra cómo usar todos los sistemas corporativos implementados
 */

class GTSDemo {
    constructor() {
        this.init();
    }

    init() {
        // Esperar a que todos los sistemas estén listos
        this.waitForSystems().then(() => {
            this.setupDemo();
            this.showWelcomeMessage();
        });
    }

    async waitForSystems() {
        // Esperar a que todos los sistemas estén disponibles
        const systems = [
            'gtsData',
            'gtsNotifications',
            'gtsLazyLoader',
            'gtsTheme',
            'gtsComponentFactory',
            'gtsAnalytics'
        ];

        for (const system of systems) {
            if (!window[system]) {
                await new Promise(resolve => {
                    const checkSystem = () => {
                        if (window[system]) {
                            resolve();
                        } else {
                            setTimeout(checkSystem, 100);
                        }
                    };
                    checkSystem();
                });
            }
        }
    }

    setupDemo() {
        // Crear botones de demostración
        this.createDemoButtons();
        
        // Configurar eventos de demostración
        this.setupDemoEvents();
        
        // Inicializar componentes de ejemplo
        this.initializeDemoComponents();
    }

    createDemoButtons() {
        const demoContainer = document.createElement('div');
        demoContainer.className = 'gts-demo-container';
        demoContainer.innerHTML = `
            <div class="gts-demo-header">
                <h3>🚀 GTS Demo - Funcionalidades Corporativas</h3>
                <p>Demostración de todas las técnicas implementadas</p>
            </div>
            <div class="gts-demo-controls">
                <button class="gts-demo-btn" data-demo="notifications">🔔 Notificaciones</button>
                <button class="gts-demo-btn" data-demo="themes">🎨 Temas</button>
                <button class="gts-demo-btn" data-demo="components">🧩 Componentes</button>
                <button class="gts-demo-btn" data-demo="animations">✨ Animaciones</button>
                <button class="gts-demo-btn" data-demo="analytics">📊 Analytics</button>
                <button class="gts-demo-btn" data-demo="performance">⚡ Rendimiento</button>
            </div>
            <div class="gts-demo-content"></div>
        `;

        // Agregar estilos
        this.addDemoStyles();
        
        // Insertar al inicio del body
        document.body.insertBefore(demoContainer, document.body.firstChild);
    }

    addDemoStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .gts-demo-container {
                background: var(--gts-bg-secondary, #f8f9fa);
                border: 1px solid var(--gts-border, #dee2e6);
                border-radius: var(--border-radius);
                margin: 1rem;
                padding: 1.5rem;
                box-shadow: var(--gts-shadow, 0 2px 8px rgba(0,0,0,0.1));
            }
            
            .gts-demo-header {
                text-align: center;
                margin-bottom: 1.5rem;
            }
            
            .gts-demo-header h3 {
                color: var(--gts-text-primary, #1a1a1a);
                margin-bottom: 0.5rem;
            }
            
            .gts-demo-header p {
                color: var(--gts-text-secondary, #6c757d);
                margin: 0;
            }
            
            .gts-demo-controls {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 0.75rem;
                margin-bottom: 1.5rem;
            }
            
            .gts-demo-btn {
                padding: 0.75rem 1rem;
                background: var(--gts-button-bg, #39b54a);
                color: var(--gts-button-text, #ffffff);
                border: none;
                border-radius: var(--border-radius);
                cursor: pointer;
                font-weight: 600;
                transition: all var(--transition-normal);
            }
            
            .gts-demo-btn:hover {
                background: var(--gts-button-hover, #2ecc71);
                transform: translateY(-2px);
            }
            
            .gts-demo-content {
                min-height: 200px;
                background: var(--gts-card-bg, #ffffff);
                border: 1px solid var(--gts-border-light, #e9ecef);
                border-radius: var(--border-radius);
                padding: 1.5rem;
            }
            
            .gts-demo-section {
                margin-bottom: 2rem;
            }
            
            .gts-demo-section h4 {
                color: var(--gts-text-primary, #1a1a1a);
                margin-bottom: 1rem;
                border-bottom: 2px solid var(--gts-primary, #39b54a);
                padding-bottom: 0.5rem;
            }
            
            .gts-demo-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
                margin-bottom: 1rem;
            }
            
            .gts-demo-item {
                background: var(--gts-bg-secondary, #f8f9fa);
                padding: 1rem;
                border-radius: var(--border-radius);
                border: 1px solid var(--gts-border-light, #e9ecef);
            }
            
            .gts-demo-item h5 {
                color: var(--gts-text-primary, #1a1a1a);
                margin-bottom: 0.5rem;
            }
            
            .gts-demo-item p {
                color: var(--gts-text-secondary, #6c757d);
                font-size: 0.875rem;
                margin: 0;
            }
            
            @media (max-width: 768px) {
                .gts-demo-controls {
                    grid-template-columns: 1fr;
                }
                
                .gts-demo-container {
                    margin: 0.5rem;
                    padding: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupDemoEvents() {
        const demoButtons = document.querySelectorAll('.gts-demo-btn');
        demoButtons.forEach(button => {
            button.addEventListener('click', () => {
                const demoType = button.dataset.demo;
                this.runDemo(demoType);
            });
        });
    }

    runDemo(demoType) {
        const content = document.querySelector('.gts-demo-content');
        
        switch (demoType) {
            case 'notifications':
                this.demoNotifications(content);
                break;
            case 'themes':
                this.demoThemes(content);
                break;
            case 'components':
                this.demoComponents(content);
                break;
            case 'animations':
                this.demoAnimations(content);
                break;
            case 'analytics':
                this.demoAnalytics(content);
                break;
            case 'performance':
                this.demoPerformance(content);
                break;
        }
    }

    demoNotifications(content) {
        content.innerHTML = `
            <div class="gts-demo-section">
                <h4>🔔 Sistema de Notificaciones</h4>
                <p>Demostración del sistema de notificaciones corporativas con diferentes tipos y duraciones.</p>
                
                <div class="gts-demo-grid">
                    <div class="gts-demo-item">
                        <h5>Notificación de Éxito</h5>
                        <p>Muestra una notificación de éxito que se auto-oculta en 5 segundos.</p>
                        <button onclick="window.gtsNotifications.success('¡Operación completada exitosamente!')" class="gts-demo-btn">
                            Mostrar Éxito
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Notificación de Error</h5>
                        <p>Muestra una notificación de error que permanece hasta que se cierre manualmente.</p>
                        <button onclick="window.gtsNotifications.error('Ha ocurrido un error en el sistema', 0)" class="gts-demo-btn">
                            Mostrar Error
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Notificación de Advertencia</h5>
                        <p>Muestra una notificación de advertencia con duración personalizada.</p>
                        <button onclick="window.gtsNotifications.warning('¡Atención! Esta acción no se puede deshacer', 10000)" class="gts-demo-btn">
                            Mostrar Advertencia
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Notificación Informativa</h5>
                        <p>Muestra una notificación informativa con el tema actual.</p>
                        <button onclick="window.gtsNotifications.info('Tema actual: ' + window.gtsTheme.getCurrentTheme())" class="gts-demo-btn">
                            Mostrar Info
                        </button>
                    </div>
                </div>
                
                <div class="gts-demo-item">
                    <h5>Estadísticas del Sistema</h5>
                    <p>Total de notificaciones: ${window.gtsNotifications.getStats().total}</p>
                    <button onclick="window.gtsNotifications.clearAll()" class="gts-demo-btn">
                        Limpiar Todas
                    </button>
                </div>
            </div>
        `;
    }

    demoThemes(content) {
        content.innerHTML = `
            <div class="gts-demo-section">
                <h4>🎨 Sistema de Temas</h4>
                <p>Demostración del sistema de temas corporativos con cambio dinámico y persistencia.</p>
                
                <div class="gts-demo-grid">
                    <div class="gts-demo-item">
                        <h5>Tema Claro</h5>
                        <p>Interfaz clara y limpia para entornos bien iluminados.</p>
                        <button onclick="window.gtsTheme.setTheme('light')" class="gts-demo-btn">
                            Aplicar Claro
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Tema Oscuro</h5>
                        <p>Interfaz oscura para entornos con poca luz.</p>
                        <button onclick="window.gtsTheme.setTheme('dark')" class="gts-demo-btn">
                            Aplicar Oscuro
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Tema Corporativo</h5>
                        <p>Diseño profesional y formal para entornos empresariales.</p>
                        <button onclick="window.gtsTheme.setTheme('corporate')" class="gts-demo-btn">
                            Aplicar Corporativo
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Alto Contraste</h5>
                        <p>Máxima legibilidad para usuarios con necesidades especiales.</p>
                        <button onclick="window.gtsTheme.setTheme('highContrast')" class="gts-demo-btn">
                            Aplicar Alto Contraste
                        </button>
                    </div>
                </div>
                
                <div class="gts-demo-item">
                    <h5>Información del Tema</h5>
                    <p>Tema actual: <strong>${window.gtsTheme.getCurrentTheme()}</strong></p>
                    <p>Preferencia del usuario: <strong>${window.gtsTheme.getUserPreference()}</strong></p>
                    <p>Tema del sistema: <strong>${window.gtsTheme.getSystemPreference()}</strong></p>
                    <button onclick="window.gtsTheme.toggleTheme()" class="gts-demo-btn">
                        Cambiar Tema
                    </button>
                </div>
            </div>
        `;
    }

    demoComponents(content) {
        content.innerHTML = `
            <div class="gts-demo-section">
                <h4>🧩 Factory de Componentes</h4>
                <p>Demostración del sistema de creación dinámica de componentes del marketplace.</p>
                
                <div class="gts-demo-grid">
                    <div class="gts-demo-item">
                        <h5>Tarjeta de Producto</h5>
                        <p>Crea una tarjeta de producto con datos de ejemplo.</p>
                        <button onclick="this.createProductCard()" class="gts-demo-btn">
                            Crear Tarjeta
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Barra de Búsqueda</h5>
                        <p>Crea una barra de búsqueda con sugerencias habilitadas.</p>
                        <button onclick="this.createSearchBar()" class="gts-demo-btn">
                            Crear Búsqueda
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Botones de Filtro</h5>
                        <p>Crea botones de filtro para diferentes categorías.</p>
                        <button onclick="this.createFilterButtons()" class="gts-demo-btn">
                            Crear Filtros
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Paginación</h5>
                        <p>Crea un sistema de paginación con datos de ejemplo.</p>
                        <button onclick="this.createPagination()" class="gts-demo-btn">
                            Crear Paginación
                        </button>
                    </div>
                </div>
                
                <div id="component-demo-area" class="gts-demo-item">
                    <h5>Área de Demostración</h5>
                    <p>Los componentes creados aparecerán aquí.</p>
                </div>
            </div>
        `;
        
        // Agregar métodos al contexto del botón
        const buttons = content.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Tarjeta')) {
                button.createProductCard = () => this.createDemoProductCard();
            } else if (button.textContent.includes('Búsqueda')) {
                button.createSearchBar = () => this.createDemoSearchBar();
            } else if (button.textContent.includes('Filtros')) {
                button.createFilterButtons = () => this.createDemoFilterButtons();
            } else if (button.textContent.includes('Paginación')) {
                button.createPagination = () => this.createDemoPagination();
            }
        });
    }

    createDemoProductCard() {
        const demoArea = document.getElementById('component-demo-area');
        const product = {
            id: 'demo-1',
            title: 'Producto de Demostración',
            price: 29.99,
            originalPrice: 39.99,
            category: 'Demo',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCA4MEgxMjBWMTAwSDgwVjgwWiIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K',
            discount: 25,
            isNew: true,
            rating: 4.5
        };
        
        const card = window.gtsComponentFactory.createProductCard(product);
        demoArea.appendChild(card);
        
        window.gtsNotifications.success('Tarjeta de producto creada exitosamente');
    }

    createDemoSearchBar() {
        const demoArea = document.getElementById('component-demo-area');
        const searchBar = window.gtsComponentFactory.createSearchBar({
            placeholder: 'Buscar productos de demostración...',
            showSuggestions: true
        });
        
        demoArea.appendChild(searchBar);
        window.gtsNotifications.success('Barra de búsqueda creada exitosamente');
    }

    createDemoFilterButtons() {
        const demoArea = document.getElementById('component-demo-area');
        const filters = [
            { label: 'Todos', category: 'all', count: 150, isActive: true },
            { label: 'Comida', category: 'food', count: 75, icon: '🍕' },
            { label: 'Bebidas', category: 'drinks', count: 45, icon: '🥤' },
            { label: 'Postres', category: 'desserts', count: 30, icon: '🍰' }
        ];
        
        const filterContainer = document.createElement('div');
        filterContainer.className = 'gts-demo-filters';
        filterContainer.style.cssText = 'display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem;';
        
        filters.forEach(filter => {
            const filterBtn = window.gtsComponentFactory.createFilterButton(filter);
            filterContainer.appendChild(filterBtn);
        });
        
        demoArea.appendChild(filterContainer);
        window.gtsNotifications.success('Botones de filtro creados exitosamente');
    }

    createDemoPagination() {
        const demoArea = document.getElementById('component-demo-area');
        const paginationData = {
            currentPage: 1,
            totalPages: 10,
            totalItems: 150,
            itemsPerPage: 15
        };
        
        const pagination = window.gtsComponentFactory.createPagination(paginationData);
        demoArea.appendChild(pagination);
        window.gtsNotifications.success('Sistema de paginación creado exitosamente');
    }

    demoAnimations(content) {
        content.innerHTML = `
            <div class="gts-demo-section">
                <h4>✨ Sistema de Animaciones</h4>
                <p>Demostración de las animaciones corporativas y transiciones suaves.</p>
                
                <div class="gts-demo-grid">
                    <div class="gts-demo-item gts-animate-fade-in-up">
                        <h5>Fade In Up</h5>
                        <p>Elemento que aparece deslizándose hacia arriba.</p>
                    </div>
                    
                    <div class="gts-demo-item gts-animate-slide-in-left">
                        <h5>Slide In Left</h5>
                        <p>Elemento que aparece deslizándose desde la izquierda.</p>
                    </div>
                    
                    <div class="gts-demo-item gts-animate-slide-in-right">
                        <h5>Slide In Right</h5>
                        <p>Elemento que aparece deslizándose desde la derecha.</p>
                    </div>
                    
                    <div class="gts-demo-item gts-animate-fade-in-scale">
                        <h5>Fade In Scale</h5>
                        <p>Elemento que aparece escalando suavemente.</p>
                    </div>
                </div>
                
                <div class="gts-demo-grid">
                    <div class="gts-demo-item gts-hover-lift">
                        <h5>Hover Lift</h5>
                        <p>Pasa el mouse sobre este elemento para ver el efecto de elevación.</p>
                    </div>
                    
                    <div class="gts-demo-item gts-hover-scale">
                        <h5>Hover Scale</h5>
                        <p>Pasa el mouse sobre este elemento para ver el efecto de escala.</p>
                    </div>
                    
                    <div class="gts-demo-item gts-hover-glow">
                        <h5>Hover Glow</h5>
                        <p>Pasa el mouse sobre este elemento para ver el efecto de brillo.</p>
                    </div>
                    
                    <div class="gts-demo-item gts-animate-pulse">
                        <h5>Pulse</h5>
                        <p>Elemento con animación de pulso continua.</p>
                    </div>
                </div>
                
                <div class="gts-demo-item">
                    <h5>Controles de Animación</h5>
                    <button onclick="this.toggleAnimations()" class="gts-demo-btn">
                        Alternar Animaciones
                    </button>
                    <button onclick="this.addShimmer()" class="gts-demo-btn">
                        Agregar Shimmer
                    </button>
                </div>
            </div>
        `;
        
        // Agregar métodos al contexto del botón
        const buttons = content.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Alternar')) {
                button.toggleAnimations = () => this.toggleDemoAnimations();
            } else if (button.textContent.includes('Shimmer')) {
                button.addShimmer = () => this.addDemoShimmer();
            }
        });
    }

    toggleDemoAnimations() {
        const items = document.querySelectorAll('.gts-demo-item');
        items.forEach(item => {
            if (item.classList.contains('gts-animate-pulse')) {
                item.classList.toggle('gts-animate-pulse');
            }
        });
        
        window.gtsNotifications.info('Animaciones alternadas');
    }

    addDemoShimmer() {
        const items = document.querySelectorAll('.gts-demo-item');
        items.forEach(item => {
            item.classList.add('gts-animate-shimmer');
            setTimeout(() => {
                item.classList.remove('gts-animate-shimmer');
            }, 2000);
        });
        
        window.gtsNotifications.success('Efecto shimmer aplicado');
    }

    demoAnalytics(content) {
        content.innerHTML = `
            <div class="gts-demo-section">
                <h4>📊 Sistema de Analytics</h4>
                <p>Demostración del sistema de métricas y tracking de eventos.</p>
                
                <div class="gts-demo-grid">
                    <div class="gts-demo-item">
                        <h5>Eventos Personalizados</h5>
                        <p>Trackear eventos específicos de la aplicación.</p>
                        <button onclick="window.gtsAnalytics.trackEvent('demo_button_click', {demo_type: 'analytics'})" class="gts-demo-btn">
                            Trackear Evento
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Vista de Producto</h5>
                        <p>Simular vista de un producto específico.</p>
                        <button onclick="window.gtsAnalytics.trackProductView('demo-product-123', 'Producto de Demostración')" class="gts-demo-btn">
                            Simular Vista
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Compra Simulada</h5>
                        <p>Simular una compra para tracking.</p>
                        <button onclick="window.gtsAnalytics.trackPurchase({orderId: 'demo-123', total: 99.99, items: 3})" class="gts-demo-btn">
                            Simular Compra
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Registro de Usuario</h5>
                        <p>Simular registro de usuario.</p>
                        <button onclick="window.gtsAnalytics.trackUserRegistration({uid: 'demo-user-123', method: 'email'})" class="gts-demo-btn">
                            Simular Registro
                        </button>
                    </div>
                </div>
                
                <div class="gts-demo-item">
                    <h5>Estadísticas del Sistema</h5>
                    <div id="analytics-stats"></div>
                    <button onclick="this.updateStats()" class="gts-demo-btn">
                        Actualizar Estadísticas
                    </button>
                </div>
            </div>
        `;
        
        // Agregar método al contexto del botón
        const button = content.querySelector('button[onclick*="Actualizar"]');
        button.updateStats = () => this.updateAnalyticsStats();
        
        // Mostrar estadísticas iniciales
        this.updateAnalyticsStats();
    }

    updateAnalyticsStats() {
        const statsContainer = document.getElementById('analytics-stats');
        const stats = window.gtsAnalytics.getStats();
        
        statsContainer.innerHTML = `
            <p><strong>Total de eventos:</strong> ${stats.totalEvents}</p>
            <p><strong>Duración de sesión:</strong> ${Math.round(stats.sessionDuration / 1000)}s</p>
            <p><strong>Vistas de página:</strong> ${stats.pageViews}</p>
            <p><strong>Interacciones:</strong> ${stats.userInteractions}</p>
            <p><strong>ID de sesión:</strong> ${stats.sessionId.substring(0, 20)}...</p>
        `;
    }

    demoPerformance(content) {
        content.innerHTML = `
            <div class="gts-demo-section">
                <h4>⚡ Sistema de Rendimiento</h4>
                <p>Demostración del sistema de lazy loading y optimización de rendimiento.</p>
                
                <div class="gts-demo-grid">
                    <div class="gts-demo-item">
                        <h5>Lazy Loading de Imágenes</h5>
                        <p>Crear imágenes con lazy loading automático.</p>
                        <button onclick="this.createLazyImages()" class="gts-demo-btn">
                            Crear Imágenes
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Precarga de Recursos</h5>
                        <p>Precargar imágenes importantes.</p>
                        <button onclick="window.gtsLazyLoader.preloadImages(['https://via.placeholder.com/300x200', 'https://via.placeholder.com/400x300'])" class="gts-demo-btn">
                            Precargar
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Optimización</h5>
                        <p>Ejecutar optimizaciones de rendimiento.</p>
                        <button onclick="window.gtsLazyLoader.optimize()" class="gts-demo-btn">
                            Optimizar
                        </button>
                    </div>
                    
                    <div class="gts-demo-item">
                        <h5>Estadísticas de Cache</h5>
                        <p>Ver estadísticas del sistema de cache.</p>
                        <button onclick="this.showCacheStats()" class="gts-demo-btn">
                            Ver Stats
                        </button>
                    </div>
                </div>
                
                <div class="gts-demo-item">
                    <h5>Área de Lazy Loading</h5>
                    <p>Las imágenes con lazy loading aparecerán aquí:</p>
                    <div id="lazy-demo-area" style="min-height: 200px; border: 2px dashed #ccc; padding: 1rem; text-align: center;">
                        <p>Haz scroll hacia abajo para activar el lazy loading</p>
                    </div>
                </div>
                
                <div class="gts-demo-item">
                    <h5>Estadísticas del Lazy Loader</h5>
                    <div id="lazy-stats"></div>
                    <button onclick="this.updateLazyStats()" class="gts-demo-btn">
                        Actualizar Stats
                    </button>
                </div>
            </div>
        `;
        
        // Agregar métodos al contexto de los botones
        const buttons = content.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Crear Imágenes')) {
                button.createLazyImages = () => this.createDemoLazyImages();
            } else if (button.textContent.includes('Ver Stats')) {
                button.showCacheStats = () => this.showDemoCacheStats();
            } else if (button.textContent.includes('Actualizar Stats')) {
                button.updateLazyStats = () => this.updateLazyStats();
            }
        });
        
        // Mostrar estadísticas iniciales
        this.updateLazyStats();
    }

    createDemoLazyImages() {
        const demoArea = document.getElementById('lazy-demo-area');
        demoArea.innerHTML = '';
        
        // Crear múltiples imágenes con lazy loading
        for (let i = 1; i <= 10; i++) {
            const img = document.createElement('img');
            img.setAttribute('data-src', `https://via.placeholder.com/300x200/39b54a/ffffff?text=Imagen+${i}`);
            img.setAttribute('data-fallback', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwSDE1MFYxMjBIMTAwVjEwMFoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+Cg==');
            img.style.cssText = 'width: 100%; height: 200px; object-fit: cover; margin-bottom: 1rem; border-radius: 8px;';
            img.alt = `Imagen de demostración ${i}`;
            
            demoArea.appendChild(img);
        }
        
        // Observar las nuevas imágenes
        window.gtsLazyLoader.initExistingElements();
        
        window.gtsNotifications.success('Imágenes con lazy loading creadas');
    }

    showDemoCacheStats() {
        const stats = window.gtsData.getCacheStats();
        window.gtsNotifications.info(`Cache: ${stats.size} elementos, ${stats.keys.length} claves`);
    }

    updateLazyStats() {
        const statsContainer = document.getElementById('lazy-stats');
        const stats = window.gtsLazyLoader.getStats();
        
        statsContainer.innerHTML = `
            <p><strong>Elementos observados:</strong> ${stats.observedElements}</p>
            <p><strong>Imágenes en cache:</strong> ${stats.cachedImages}</p>
            <p><strong>Componentes en cache:</strong> ${stats.cachedComponents}</p>
        `;
    }

    showWelcomeMessage() {
        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            window.gtsNotifications.success('¡Bienvenido al demo de GTS! Todas las funcionalidades están listas para usar.');
        }, 1000);
        
        // Trackear evento de demo iniciado
        if (window.gtsAnalytics) {
            window.gtsAnalytics.trackEvent('demo_started', {
                demo_version: '1.0.0',
                features_count: 6
            });
        }
    }
}

// Inicializar demo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new GTSDemo();
});
