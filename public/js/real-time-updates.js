/**
 * Sistema de Actualizaciones en Tiempo Real para Good to Save
 * Simula actualizaciones en tiempo real de las estadísticas de la plataforma
 */
class RealTimeUpdates {
    constructor() {
        this.isActive = false;
        this.updateInterval = null;
        this.statsManager = null;
        this.init();
    }

    init() {
        // Esperar a que el gestor de estadísticas esté disponible
        this.waitForStatsManager();
    }

    waitForStatsManager() {
        const checkInterval = setInterval(() => {
            if (window.dynamicStats && window.dynamicStats.loaded) {
                this.statsManager = window.dynamicStats;
                clearInterval(checkInterval);
                console.log('Real-time updates system ready');
                
                // Opcional: activar automáticamente en producción
                // this.start();
            }
        }, 100);
    }

    start() {
        if (this.isActive || !this.statsManager) return;
        
        this.isActive = true;
        console.log('Starting real-time updates...');
        
        // Actualizar cada 30 segundos
        this.updateInterval = setInterval(() => {
            this.simulateRealTimeActivity();
        }, 30000);
        
        // Primera actualización inmediata
        this.simulateRealTimeActivity();
    }

    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        this.isActive = false;
        console.log('Real-time updates stopped');
    }

    simulateRealTimeActivity() {
        if (!this.statsManager || !this.statsManager.stats) return;

        const stats = this.statsManager.stats;
        
        // Simular actividad en tiempo real
        const updates = {
            // Incrementos pequeños para estadísticas que cambian frecuentemente
            'platform_stats.active_deals': Math.floor(Math.random() * 3) + 1,
            'platform_stats.happy_customers': Math.floor(Math.random() * 5) + 2,
            'platform_stats.satisfied_users': Math.floor(Math.random() * 10) + 5,
            
            // Incrementos para estadísticas de impacto
            'impact_stats.food_saved_kg': Math.floor(Math.random() * 15) + 5,
            'impact_stats.co2_reduced_kg': Math.floor(Math.random() * 12) + 3,
            'impact_stats.families_helped': Math.floor(Math.random() * 3) + 1,
            'impact_stats.euros_saved': Math.floor(Math.random() * 50) + 20,
            
            // Actualizaciones de testimonios
            'testimonials.maria_gonzalez.savings_per_month': Math.floor(Math.random() * 10) + 5,
            'testimonials.ana_martinez.savings_per_month': Math.floor(Math.random() * 8) + 3
        };

        // Aplicar actualizaciones
        Object.entries(updates).forEach(([path, increment]) => {
            this.updateNestedProperty(stats, path, increment);
        });

        // Actualizar la interfaz
        this.statsManager.updateAllStats();
        
        // Mostrar notificación sutil (opcional)
        this.showSubtleNotification();
    }

    updateNestedProperty(obj, path, increment) {
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
            if (!current) return;
        }
        
        const lastKey = keys[keys.length - 1];
        if (typeof current[lastKey] === 'number') {
            current[lastKey] += increment;
        }
    }

    showSubtleNotification() {
        // Crear una notificación sutil de que las estadísticas se actualizaron
        const notification = document.createElement('div');
        notification.className = 'stats-update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="ri-refresh-line"></i>
                <span>Estadísticas actualizadas</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(57, 181, 74, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Método para activar/desactivar desde la consola
    toggle() {
        if (this.isActive) {
            this.stop();
        } else {
            this.start();
        }
    }

    // Método para obtener el estado actual
    getStatus() {
        return {
            isActive: this.isActive,
            statsManager: !!this.statsManager,
            lastUpdate: this.lastUpdate || 'Never'
        };
    }
}

// Instancia global del sistema de actualizaciones en tiempo real
const realTimeUpdates = new RealTimeUpdates();

// Agregar a la ventana global para acceso desde otros scripts
window.realTimeUpdates = realTimeUpdates;

// Métodos de conveniencia para la consola
window.startRealTimeUpdates = () => realTimeUpdates.start();
window.stopRealTimeUpdates = () => realTimeUpdates.stop();
window.toggleRealTimeUpdates = () => realTimeUpdates.toggle();
window.getRealTimeStatus = () => realTimeUpdates.getStatus();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('Real-time updates system initialized');
    console.log('Use startRealTimeUpdates() to begin live updates');
    console.log('Use stopRealTimeUpdates() to stop live updates');
    console.log('Use toggleRealTimeUpdates() to toggle updates');
    console.log('Use getRealTimeStatus() to check current status');
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeUpdates;
}
