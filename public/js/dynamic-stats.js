/**
 * Sistema de Estadísticas Dinámicas para Good to Save
 * Maneja la carga y actualización de todas las cifras y números en la aplicación
 */
class DynamicStatsManager {
    constructor() {
        this.stats = null;
        this.loaded = false;
        this.updateInterval = null;
        this.init();
    }

    async init() {
        try {
            await this.loadStats();
            this.setupAutoUpdate();
            this.updateAllStats();
        } catch (error) {
            console.error('Error initializing dynamic stats:', error);
            // Usar valores por defecto si falla la carga
            this.useDefaultStats();
        }
    }

    async loadStats() {
        try {
            const response = await fetch('../assets/data/dynamic-stats.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.stats = await response.json();
            this.loaded = true;
            console.log('Dynamic stats loaded successfully');
        } catch (error) {
            console.error('Failed to load dynamic stats:', error);
            throw error;
        }
    }

    useDefaultStats() {
        // Valores por defecto en caso de error
        this.stats = {
            platform_stats: {
                active_deals: 150,
                total_savings: 2500,
                happy_customers: 2800,
                average_order_time: "2.5 min",
                average_savings: 60,
                availability: "24/7",
                active_partners: 2500,
                monthly_revenue: 45000,
                waste_reduction: 85,
                average_rating: "4.9/5",
                satisfied_users: 15000,
                satisfaction_rate: 98
            },
            impact_stats: {
                food_saved_kg: 15680,
                co2_reduced_kg: 12450,
                families_helped: 4200,
                euros_saved: 89000
            },
            global_problem: {
                food_waste_percentage: 33,
                co2_emissions_percentage: 8,
                annual_waste_tons: "1.3B"
            },
            testimonials: {
                maria_gonzalez: {
                    savings_per_month: 200,
                    orders: 15
                },
                ana_martinez: {
                    savings_per_month: 150,
                    orders: 12
                }
            },
            success_stories: {
                el_horno_bakery: {
                    food_saved_per_day: "50kg",
                    income_increase: 15
                },
                central_market: {
                    waste_reduction: 70,
                    new_customers: 200
                }
            },
            benefits: {
                save_percentage: 60
            }
        };
        this.loaded = true;
    }

    setupAutoUpdate() {
        // Actualizar estadísticas cada 5 minutos
        this.updateInterval = setInterval(() => {
            this.updateAllStats();
        }, 5 * 60 * 1000);
    }

    updateAllStats() {
        if (!this.loaded || !this.stats) return;

        // Actualizar estadísticas del index
        this.updateIndexStats();
        
        // Actualizar estadísticas del about
        this.updateAboutStats();
        
        // Actualizar testimonios
        this.updateTestimonials();
        
        // Actualizar historias de éxito
        this.updateSuccessStories();
    }

    updateIndexStats() {
        const stats = this.stats.platform_stats;
        
        // Trending stats - usar formateo inteligente
        this.updateElement('.trending-stat:nth-child(1) .stat-number', this.formatNumber(stats.active_deals, 'number') + '+');
        this.updateElement('.trending-stat:nth-child(2) .stat-number', this.formatNumber(stats.total_savings, 'currency'));
        this.updateElement('.trending-stat:nth-child(3) .stat-number', this.formatNumber(stats.happy_customers, 'number'));
        
        // Process stats
        this.updateElement('.process-stats .stat-item:nth-child(1) .stat-number', stats.average_order_time);
        this.updateElement('.process-stats .stat-item:nth-child(2) .stat-number', `${stats.average_savings}%`);
        this.updateElement('.process-stats .stat-item:nth-child(3) .stat-number', stats.availability);
        
        // Business stats - usar formateo inteligente
        this.updateElement('.business-stats .stat-item:nth-child(1) .stat-number', this.formatNumber(stats.active_partners, 'number') + '+');
        this.updateElement('.business-stats .stat-item:nth-child(2) .stat-number', this.formatNumber(stats.monthly_revenue, 'currency'));
        this.updateElement('.business-stats .stat-item:nth-child(3) .stat-number', `${stats.waste_reduction}%`);
        
        // Testimonials stats - usar formateo inteligente
        this.updateElement('.testimonials-stats .stat-item:nth-child(1) .stat-number', stats.average_rating);
        this.updateElement('.testimonials-stats .stat-item:nth-child(2) .stat-number', this.formatNumber(stats.satisfied_users, 'number') + '+');
        this.updateElement('.testimonials-stats .stat-item:nth-child(3) .stat-number', `${stats.satisfaction_rate}%`);
        
        // Benefits
        this.updateElement('.benefit-item:nth-child(1) .benefit-title', `Save up to ${this.stats.benefits.save_percentage}%`);
    }

    updateAboutStats() {
        const impactStats = this.stats.impact_stats;
        const globalProblem = this.stats.global_problem;
        
        // Hero stats
        this.updateElement('.hero-stats .stat-item:nth-child(1) .stat-number', impactStats.food_saved_kg.toLocaleString());
        this.updateElement('.hero-stats .stat-item:nth-child(2) .stat-number', impactStats.co2_reduced_kg.toLocaleString());
        this.updateElement('.hero-stats .stat-item:nth-child(3) .stat-number', impactStats.families_helped.toLocaleString());
        
        // Problem card stats
        this.updateElement('.problem-card .stat-highlight:nth-child(1) .stat-number', `${globalProblem.food_waste_percentage}%`);
        this.updateElement('.problem-card .stat-highlight:nth-child(2) .stat-number', `${globalProblem.co2_emissions_percentage}%`);
        this.updateElement('.problem-card .stat-highlight:nth-child(3) .stat-number', globalProblem.annual_waste_tons);
        
        // Impact dashboard
        this.updateElement('.impact-card:nth-child(1) .metric-counter', impactStats.food_saved_kg);
        this.updateElement('.impact-card:nth-child(2) .metric-counter', impactStats.co2_reduced_kg);
        this.updateElement('.impact-card:nth-child(3) .metric-counter', impactStats.families_helped);
        this.updateElement('.impact-card:nth-child(4) .metric-counter', impactStats.euros_saved.toLocaleString());
    }

    updateTestimonials() {
        const testimonials = this.stats.testimonials;
        
        // María González stats
        this.updateElement('.testimonial-card:nth-child(1) .author-stats .stat:nth-child(1)', `€${testimonials.maria_gonzalez.savings_per_month} saved/month`);
        this.updateElement('.testimonial-card:nth-child(1) .author-stats .stat:nth-child(2)', `${testimonials.maria_gonzalez.orders} orders`);
        
        // Ana Martínez stats
        this.updateElement('.testimonial-card:nth-child(3) .author-stats .stat:nth-child(1)', `€${testimonials.ana_martinez.savings_per_month} saved/month`);
        this.updateElement('.testimonial-card:nth-child(3) .author-stats .stat:nth-child(2)', `${testimonials.ana_martinez.orders} orders`);
    }

    updateSuccessStories() {
        const successStories = this.stats.success_stories;
        
        // El Horno Bakery
        this.updateElement('.story-card:nth-child(1) .metric:nth-child(1) .metric-value', successStories.el_horno_bakery.food_saved_per_day);
        this.updateElement('.story-card:nth-child(1) .metric:nth-child(2) .metric-value', `+${successStories.el_horno_bakery.income_increase}%`);
        
        // Central Market
        this.updateElement('.story-card:nth-child(2) .metric:nth-child(1) .metric-value', `${successStories.central_market.waste_reduction}%`);
        this.updateElement('.story-card:nth-child(2) .metric:nth-child(2) .metric-value', `${successStories.central_market.new_customers}+`);
    }

    updateElement(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            // Si el elemento tiene un data-target, actualizar el target también
            if (element.hasAttribute('data-target')) {
                const targetValue = this.parseValue(value);
                element.setAttribute('data-target', targetValue);
            }
            
            // Actualizar el texto del elemento
            element.textContent = value;
            
            // Si es un contador, reiniciar la animación
            if (element.classList.contains('metric-counter') || element.hasAttribute('data-target')) {
                this.animateCounter(element);
            }
        }
    }

    parseValue(value) {
        // Convertir valores como "€2.5K" o "1.3B" a números
        if (typeof value === 'string') {
            if (value.includes('K')) {
                return parseFloat(value.replace(/[€K]/g, '')) * 1000;
            } else if (value.includes('B')) {
                return parseFloat(value.replace(/[B]/g, '')) * 1000000000;
            } else if (value.includes('%')) {
                return parseFloat(value.replace('%', ''));
            } else if (value.includes('€')) {
                return parseFloat(value.replace(/[€,]/g, ''));
            }
        }
        return parseFloat(value) || 0;
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target')) || parseInt(element.textContent.replace(/[^\d]/g, ''));
        if (!target) return;

        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        // Determinar el tipo de formateo basado en el contenido original
        let formatType = 'number';
        const originalText = element.textContent;
        if (originalText.includes('€')) {
            formatType = 'currency';
        } else if (originalText.includes('%')) {
            formatType = 'percentage';
        } else if (originalText.includes('min')) {
            formatType = 'time';
        }
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Formatear el número según el tipo
            const formattedValue = this.formatNumber(current, formatType);
            element.textContent = formattedValue;
        }, 16);
    }

    formatNumber(number, type = 'number') {
        // Formateo inteligente basado en el tipo y tamaño del número
        switch (type) {
            case 'currency':
                if (number >= 1000) {
                    return `€${(number / 1000).toFixed(1)}K`;
                } else {
                    return `€${Math.floor(number).toLocaleString()}`;
                }
            case 'number':
                if (number >= 1000) {
                    return `${(number / 1000).toFixed(1)}K`;
                } else {
                    return Math.floor(number).toLocaleString();
                }
            case 'percentage':
                return `${Math.floor(number)}%`;
            case 'time':
                return `${number.toFixed(1)} min`;
            default:
                return Math.floor(number).toLocaleString();
        }
    }

    // Método para actualizar estadísticas en tiempo real (simulado)
    simulateRealTimeUpdates() {
        if (!this.loaded) return;

        // Simular incrementos pequeños en tiempo real
        setInterval(() => {
            // Incrementar algunos valores
            this.stats.platform_stats.active_deals += Math.floor(Math.random() * 3);
            this.stats.platform_stats.happy_customers += Math.floor(Math.random() * 5);
            this.stats.impact_stats.food_saved_kg += Math.floor(Math.random() * 10);
            this.stats.impact_stats.co2_reduced_kg += Math.floor(Math.random() * 8);
            
            // Actualizar solo los elementos que cambian frecuentemente usando el nuevo formateo
            this.updateElement('.trending-stat:nth-child(1) .stat-number', this.formatNumber(this.stats.platform_stats.active_deals, 'number') + '+');
            this.updateElement('.trending-stat:nth-child(3) .stat-number', this.formatNumber(this.stats.platform_stats.happy_customers, 'number'));
        }, 30000); // Cada 30 segundos
    }

    // Método para obtener estadísticas específicas
    getStat(category, key) {
        if (!this.loaded || !this.stats) return null;
        return this.stats[category]?.[key] || null;
    }

    // Método para actualizar una estadística específica
    updateStat(category, key, value) {
        if (!this.loaded || !this.stats) return;
        
        if (this.stats[category]) {
            this.stats[category][key] = value;
            this.updateAllStats();
        }
    }

    // Método para exportar estadísticas
    exportStats() {
        return this.stats;
    }

    // Método para limpiar recursos
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Instancia global del gestor de estadísticas dinámicas
const dynamicStats = new DynamicStatsManager();

// Agregar a la ventana global para acceso desde otros scripts
window.dynamicStats = dynamicStats;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // El gestor ya se inicializa automáticamente
    console.log('Dynamic stats manager ready');
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicStatsManager;
}
