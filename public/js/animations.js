/* ===== SISTEMA DE ANIMACIONES DINÁMICAS ===== */

class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
        this.setupParticleSystem();
        this.setupHoverEffects();
        this.setupButtonEffects();
        this.setupTextAnimations();
        this.setupLoadingAnimations();
    }

    /* ===== ANIMACIONES DE SCROLL ===== */
    setupScrollAnimations() {
        // Animación de parallax para elementos de fondo
        window.addEventListener('scroll', () => {
            this.handleParallax();
            this.handleScrollProgress();
        });

        // Animación de elementos que aparecen al hacer scroll
        this.setupScrollReveal();
    }

    handleParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(window.pageYOffset * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    handleScrollProgress() {
        const progressBars = document.querySelectorAll('.scroll-progress');
        progressBars.forEach(bar => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            bar.style.width = scrollPercent + '%';
        });
    }

    setupScrollReveal() {
        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
        });
    }

    /* ===== INTERSECTION OBSERVER ===== */
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observar elementos con animaciones
        const animatedElements = document.querySelectorAll(
            '.animate-slide-in-top, .animate-slide-in-bottom, .animate-slide-in-left, .animate-slide-in-right, .animate-fade-in-scale, .scroll-reveal'
        );

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    animateElement(element) {
        // Remover clases de animación iniciales
        element.classList.remove('scroll-reveal');
        
        // Agregar clase para activar la animación
        element.classList.add('animated');
        
        // Aplicar animación específica basada en las clases
        if (element.classList.contains('animate-slide-in-top')) {
            element.style.animation = 'slideInFromTop 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        } else if (element.classList.contains('animate-slide-in-bottom')) {
            element.style.animation = 'slideInFromBottom 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        } else if (element.classList.contains('animate-slide-in-left')) {
            element.style.animation = 'slideInFromLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        } else if (element.classList.contains('animate-slide-in-right')) {
            element.style.animation = 'slideInFromRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        } else if (element.classList.contains('animate-fade-in-scale')) {
            element.style.animation = 'fadeInScale 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        }
    }

    /* ===== SISTEMA DE PARTÍCULAS ===== */
    setupParticleSystem() {
        const particleContainers = document.querySelectorAll('.particle-container');
        
        particleContainers.forEach(container => {
            this.createParticles(container);
        });
    }

    createParticles(container) {
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            container.appendChild(particle);
        }
    }

    /* ===== EFECTOS DE HOVER ===== */
    setupHoverEffects() {
        // Efecto de ondas en botones
        const rippleButtons = document.querySelectorAll('.btn-ripple');
        rippleButtons.forEach(button => {
            button.addEventListener('click', (e) => this.createRipple(e));
        });

        // Efecto de elevación en cards
        const liftCards = document.querySelectorAll('.hover-lift');
        liftCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.addLiftEffect(card));
            card.addEventListener('mouseleave', () => this.removeLiftEffect(card));
        });

        // Efecto de brillo
        const glowElements = document.querySelectorAll('.hover-glow');
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => this.addGlowEffect(element));
            element.addEventListener('mouseleave', () => this.removeGlowEffect(element));
        });
    }

    createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addLiftEffect(element) {
        element.style.transform = 'translateY(-8px)';
        element.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
    }

    removeLiftEffect(element) {
        element.style.transform = 'translateY(0)';
        element.style.boxShadow = '';
    }

    addGlowEffect(element) {
        element.style.boxShadow = '0 0 20px rgba(57, 181, 74, 0.3)';
    }

    removeGlowEffect(element) {
        element.style.boxShadow = '';
    }

    /* ===== EFECTOS DE BOTONES ===== */
    setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Efecto de carga
            if (button.classList.contains('btn-loading')) {
                button.addEventListener('click', () => this.showLoadingState(button));
            }

            // Efecto de pulso
            if (button.classList.contains('animate-pulse')) {
                this.addPulseEffect(button);
            }
        });
    }

    showLoadingState(button) {
        const originalText = button.textContent;
        button.textContent = '';
        button.disabled = true;
        
        const spinner = document.createElement('div');
        spinner.className = 'custom-spinner';
        button.appendChild(spinner);

        // Simular carga
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            spinner.remove();
        }, 2000);
    }

    addPulseEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        element.addEventListener('animationend', () => {
            element.style.animation = '';
        });
    }

    /* ===== ANIMACIONES DE TEXTO ===== */
    setupTextAnimations() {
        // Efecto de resplandor
        const glowTextElements = document.querySelectorAll('.text-glow');
        glowTextElements.forEach(element => {
            this.addTextGlowEffect(element);
        });
    }

    addTextGlowEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.textShadow = '0 0 20px rgba(57, 181, 74, 0.8), 0 0 30px rgba(57, 181, 74, 0.6)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.textShadow = '0 0 10px rgba(57, 181, 74, 0.5)';
        });
    }

    /* ===== ANIMACIONES DE CARGA ===== */
    setupLoadingAnimations() {
        // Mostrar animación de carga al cargar la página
        window.addEventListener('load', () => {
            this.hideLoadingScreen();
        });

        // Animación de progreso
        this.setupProgressAnimations();
    }

    hideLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    setupProgressAnimations() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const target = bar.dataset.target || 100;
            this.animateProgressBar(bar, target);
        });
    }

    animateProgressBar(bar, target) {
        let current = 0;
        const increment = target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            bar.style.width = current + '%';
            
            if (current >= target) {
                clearInterval(timer);
                bar.style.width = target + '%';
            }
        }, 20);
    }

    /* ===== UTILIDADES ===== */
    
    // Agregar animación a un elemento específico
    animate(element, animationClass, duration = 1000) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }

    // Crear notificación animada
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} notification-slide`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Animación de contador
    animateCounter(element, target, duration = 2000) {
        let current = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                clearInterval(timer);
                element.textContent = target;
            }
        }, 16);
    }
}

/* ===== EFECTOS ESPECÍFICOS PARA COMPONENTES ===== */

class ComponentAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupHeroAnimations();
        this.setupCardAnimations();
        this.setupMenuAnimations();
        this.setupFormAnimations();
    }

    /* ===== ANIMACIONES DEL HERO ===== */
    setupHeroAnimations() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Animación de partículas en el hero
        this.createHeroParticles(hero);

        // Animación del título principal
        const heroTitle = hero.querySelector('.hero-title');
        if (heroTitle) {
            this.animateHeroTitle(heroTitle);
        }

        // Animación de los botones de acción
        const heroActions = hero.querySelector('.hero-actions');
        if (heroActions) {
            this.animateHeroActions(heroActions);
        }
    }

    createHeroParticles(hero) {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        hero.appendChild(particleContainer);

        // Crear partículas específicas para el hero
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            particleContainer.appendChild(particle);
        }
    }

    animateHeroTitle(title) {
        const words = title.textContent.split(' ');
        title.innerHTML = '';
        
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.style.opacity = '0';
            span.style.transform = 'translateY(30px)';
            span.style.animation = `slideInFromBottom 0.8s ease ${index * 0.2}s forwards`;
            title.appendChild(span);
        });
    }

    animateHeroActions(actions) {
        const buttons = actions.querySelectorAll('.btn');
        buttons.forEach((button, index) => {
            button.style.opacity = '0';
            button.style.transform = 'translateY(30px)';
            button.style.animation = `slideInFromBottom 0.8s ease ${0.8 + index * 0.2}s forwards`;
        });
    }

    /* ===== ANIMACIONES DE CARDS ===== */
    setupCardAnimations() {
        const cards = document.querySelectorAll('.featured-card, .step-card, .benefit-item');
        
        cards.forEach((card, index) => {
            // Agregar efecto de cristal
            card.classList.add('glass-effect');
            
            // Animación de entrada escalonada
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.animation = `slideInFromBottom 0.8s ease ${index * 0.1}s forwards`;
            
            // Efecto de hover
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    /* ===== ANIMACIONES DE MENÚ ===== */
    setupMenuAnimations() {
        const menuItems = document.querySelectorAll('nav a, .nav-menu li');
        
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            item.style.animation = `slideInFromTop 0.6s ease ${index * 0.1}s forwards`;
        });
    }

    /* ===== ANIMACIONES DE FORMULARIOS ===== */
    setupFormAnimations() {
        const formInputs = document.querySelectorAll('input, textarea, select');
        
        formInputs.forEach((input, index) => {
            input.style.opacity = '0';
            input.style.transform = 'translateX(-20px)';
            input.style.animation = `slideInFromLeft 0.6s ease ${index * 0.1}s forwards`;
            
            // Efecto de focus
            input.addEventListener('focus', () => {
                input.style.transform = 'scale(1.02)';
                input.style.boxShadow = '0 0 0 3px rgba(57, 181, 74, 0.2)';
            });
            
            input.addEventListener('blur', () => {
                input.style.transform = 'scale(1)';
                input.style.boxShadow = '';
            });
        });
    }
}

/* ===== INICIALIZACIÓN ===== */

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
    window.componentAnimations = new ComponentAnimations();
    
    // Agregar estilos CSS dinámicos para el efecto ripple
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--background-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--primary-color);
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
        }
        
        .progress-bar {
            height: 4px;
            background: var(--primary-color);
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});

// Exportar para uso global
window.AnimationManager = AnimationManager;
window.ComponentAnimations = ComponentAnimations;
