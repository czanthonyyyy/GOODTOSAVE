/**
 * Contact Page JavaScript
 * Handles all interactive functionality for the contact page
 */

class ContactPage {
    constructor() {
        this.init();
    }

    init() {
        this.initializeAnimations();
        this.initializeFormHandling();
        this.initializeFAQ();
        this.initializeMethodCards();
        this.initializeLocationButtons();
        this.initializeFloatingElements();
    }

    /**
     * Initialize page animations
     */
    initializeAnimations() {
        // Animate hero stats on scroll
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            observer.observe(heroStats);
        }

        // Animate method cards on scroll
        const methodCards = document.querySelectorAll('.method-card');
        methodCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.transition = 'all 0.6s ease';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                        cardObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            cardObserver.observe(card);
        });
    }

    /**
     * Animate counter numbers
     */
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 16);
        });
    }

    /**
     * Initialize form handling
     */
    initializeFormHandling() {
        const form = document.getElementById('contactForm');
        const messageTextarea = document.getElementById('message');
        const charCount = document.getElementById('charCount');
        const submitBtn = document.querySelector('.submit-btn');

        if (form) {
            // Character counter for message textarea
            if (messageTextarea && charCount) {
                messageTextarea.addEventListener('input', () => {
                    const length = messageTextarea.value.length;
                    charCount.textContent = length;
                    
                    if (length > 900) {
                        charCount.style.color = '#e74c3c';
                    } else if (length > 800) {
                        charCount.style.color = '#f39c12';
                    } else {
                        charCount.style.color = 'var(--text-light)';
                    }
                });
            }

            // Form submission
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form, submitBtn);
            });

            // Form reset
            const resetBtn = document.querySelector('.reset-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    setTimeout(() => {
                        if (charCount) {
                            charCount.textContent = '0';
                            charCount.style.color = 'var(--text-light)';
                        }
                    }, 100);
                });
            }

            // Real-time validation
            this.initializeFormValidation(form);
        }
    }

    /**
     * Handle form submission
     */
    handleFormSubmission(form, submitBtn) {
        const formData = new FormData(form);
        const submitText = submitBtn.querySelector('.btn-text');
        const submitIcon = submitBtn.querySelector('.btn-icon');

        // Show loading state
        submitText.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        // Simulate form submission
        setTimeout(() => {
            // Show success message
            this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form
            form.reset();
            if (document.getElementById('charCount')) {
                document.getElementById('charCount').textContent = '0';
            }
            
            // Reset button state
            submitText.textContent = 'Send Message';
            submitBtn.disabled = false;
            submitIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
            
        }, 2000);
    }

    /**
     * Initialize form validation
     */
    initializeFormValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Apply validation result
        if (!isValid) {
            field.classList.add('error');
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = errorMessage;
            errorElement.style.color = '#e74c3c';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '0.25rem';
            field.parentNode.appendChild(errorElement);
        }
    }

    /**
     * Initialize FAQ functionality
     */
    initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        });
    }

    /**
     * Initialize method cards functionality
     */
    initializeMethodCards() {
        const methodCards = document.querySelectorAll('.method-card');
        
        methodCards.forEach(card => {
            const button = card.querySelector('.method-btn');
            const method = card.getAttribute('data-method');
            
            button.addEventListener('click', () => {
                this.handleMethodAction(method, card);
            });
        });
    }

    /**
     * Handle method card actions
     */
    handleMethodAction(method, card) {
        const button = card.querySelector('.method-btn');
        const originalText = button.textContent;
        
        // Show loading state
        button.textContent = 'Processing...';
        button.disabled = true;
        
        setTimeout(() => {
            switch (method) {
                case 'email':
                    window.location.href = 'mailto:hello@goodtosave.com?subject=Contact from Good to Save website';
                    break;
                case 'phone':
                    window.location.href = 'tel:+34911234567';
                    break;
                case 'chat':
                    this.showNotification('Live chat feature coming soon!', 'info');
                    break;
                case 'social':
                    this.showNotification('Opening social media...', 'info');
                    // In a real app, this would open social media links
                    break;
            }
            
            // Reset button
            button.textContent = originalText;
            button.disabled = false;
        }, 1000);
    }

    /**
     * Initialize location buttons
     */
    initializeLocationButtons() {
        const locationButtons = document.querySelectorAll('.location-btn');
        
        locationButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.location-card');
                const locationName = card.querySelector('h3').textContent;
                
                // In a real app, this would open Google Maps with the location
                this.showNotification(`Opening directions to ${locationName}...`, 'info');
            });
        });
    }

    /**
     * Initialize floating elements animation
     */
    initializeFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed')) || 1;
            
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5 * speed;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    /**
     * Get notification icon based on type
     */
    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    /**
     * Get notification color based on type
     */
    getNotificationColor(type) {
        switch (type) {
            case 'success': return '#27ae60';
            case 'error': return '#e74c3c';
            case 'warning': return '#f39c12';
            default: return '#3498db';
        }
    }
}

// Initialize contact page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactPage();
});

// Add CSS for form validation
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style); 