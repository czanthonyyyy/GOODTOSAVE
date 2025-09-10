// Support Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    initSearch();
    initContactForm();
    initAnimations();
    initScrollEffects();
});

// FAQ Functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        
        // Add staggered animation delay
        item.style.animationDelay = `${index * 0.1}s`;
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items with smooth animation
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
                // Smooth scroll to active item
                setTimeout(() => {
                    item.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center',
                        inline: 'nearest'
                    });
                }, 300);
            }
        });
    });
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('support-search');
    const searchBtn = document.querySelector('.search-btn');
    
    // Search on button click
    searchBtn.addEventListener('click', performSearch);
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Real-time search suggestions
    searchInput.addEventListener('input', debounce(handleSearchInput, 300));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleSearchInput(e) {
    const searchTerm = e.target.value.trim();
    
    if (searchTerm.length > 2) {
        // Highlight matching FAQ items
        highlightSearchResults(searchTerm);
    } else {
        // Remove highlights
        removeSearchHighlights();
    }
}

function performSearch() {
    const searchTerm = document.getElementById('support-search').value.trim();
    
    if (!searchTerm) {
        showMessage('Please enter a search term', 'warning');
        return;
    }
    
    // Show loading state
    const searchBtn = document.querySelector('.search-btn');
    const originalIcon = searchBtn.innerHTML;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    searchBtn.disabled = true;
    
    // Simulate search functionality
    showMessage(`Searching for: "${searchTerm}"`, 'info');
    
    setTimeout(() => {
        const results = searchFAQ(searchTerm);
        
        // Reset button
        searchBtn.innerHTML = originalIcon;
        searchBtn.disabled = false;
        
        if (results.length > 0) {
            showMessage(`Found ${results.length} results for "${searchTerm}"`, 'success');
            highlightResults(searchTerm);
            
            // Scroll to first result
            if (results[0]) {
                setTimeout(() => {
                    results[0].scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 500);
            }
        } else {
            showMessage(`No results found for "${searchTerm}"`, 'warning');
        }
    }, 1500);
}

function searchFAQ(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    const results = [];
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        
        if (question.includes(searchTerm.toLowerCase()) || answer.includes(searchTerm.toLowerCase())) {
            results.push(item);
        }
    });
    
    return results;
}

function highlightSearchResults(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3');
        const answer = item.querySelector('.faq-answer p');
        
        if (question.textContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
            answer.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
            
            item.style.borderColor = 'var(--primary-color)';
            item.style.boxShadow = '0 8px 40px rgba(57, 181, 74, 0.2)';
        }
    });
}

function removeSearchHighlights() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.style.borderColor = '';
        item.style.boxShadow = '';
    });
}

function highlightResults(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3');
        const answer = item.querySelector('.faq-answer p');
        
        if (question.textContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
            answer.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
            
            item.classList.add('active');
        }
    });
}

// Contact Form Functionality
function initContactForm() {
    const form = document.getElementById('support-form');
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Form validation on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
        input.addEventListener('focus', handleFieldFocus);
    });
    
    // Auto-resize textarea
    const textarea = form.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('input', autoResizeTextarea);
    }
}

function handleFieldFocus(e) {
    const field = e.target;
    field.parentNode.classList.add('focused');
}

function autoResizeTextarea(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(140, textarea.scrollHeight) + 'px';
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateForm();
    
    if (!isValid) {
        showMessage('Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
        e.target.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Reset textarea height
        const textarea = e.target.querySelector('textarea');
        if (textarea) {
            textarea.style.height = '140px';
        }
    }, 2000);
}

function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target || e;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove previous error styling
    field.classList.remove('error');
    field.parentNode.classList.remove('focused');
    
    // Check if field is empty
    if (!value) {
        showFieldError(field, `${getFieldLabel(fieldName)} is required`);
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    // Phone validation for phone fields
    if (field.type === 'tel' && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 0.5rem;
        animation: slideInDown 0.3s ease;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function getFieldLabel(fieldName) {
    const labels = {
        'name': 'Full Name',
        'email': 'Email Address',
        'subject': 'Subject',
        'message': 'Message'
    };
    
    return labels[fieldName] || fieldName;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Animation and Scroll Effects
function initAnimations() {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll('.help-card, .faq-item, .contact-method');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

function initScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Utility Functions
function showMessage(message, type) {
    // Create or update message
    let messageElement = document.querySelector('.message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            padding: 1.25rem 1.75rem;
            border-radius: 16px;
            font-size: 0.95rem;
            font-weight: 600;
            z-index: 10000;
            max-width: 450px;
            animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(messageElement);
    }
    
    // Set message content and styling
    messageElement.textContent = message;
    messageElement.className = `message message-${type}`;
    
    // Apply styling based on type
    const styles = {
        success: 'background: rgba(76, 175, 80, 0.95); color: white; border: 1px solid rgba(76, 175, 80, 0.3);',
        error: 'background: rgba(231, 76, 60, 0.95); color: white; border: 1px solid rgba(231, 76, 60, 0.3);',
        warning: 'background: rgba(255, 152, 0, 0.95); color: white; border: 1px solid rgba(255, 152, 0, 0.3);',
        info: 'background: rgba(33, 150, 243, 0.95); color: white; border: 1px solid rgba(33, 150, 243, 0.3);'
    };
    
    messageElement.style.cssText += styles[type] || styles.info;
    
    // Auto-hide message after 6 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 400);
        }
    }, 6000);
}

// Add CSS for enhanced styling and animations
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: var(--error-color);
        box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1);
    }
    
    .form-group.focused input,
    .form-group.focused select,
    .form-group.focused textarea {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 4px rgba(57, 181, 74, 0.1);
    }
    
    .field-error {
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 0.5rem;
    }
    
    /* Animation Classes */
    .help-card,
    .faq-item,
    .contact-method {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .help-card.animate-in,
    .faq-item.animate-in,
    .contact-method.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Enhanced Hover Effects */
    .help-card:hover .help-icon {
        animation: pulse 1s infinite;
    }
    
    .contact-method:hover i {
        animation: bounce 0.6s ease;
    }
    
    /* Keyframe Animations */
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
        }
        40%, 43% {
            transform: translateY(-8px);
        }
        70% {
            transform: translateY(-4px);
        }
        90% {
            transform: translateY(-2px);
        }
    }
    
    /* Smooth transitions for all interactive elements */
    * {
        transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
    }
    
    /* Enhanced focus states */
    .search-box:focus-within {
        transform: translateY(-2px) scale(1.02);
    }
    
    /* Loading states */
    .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    /* Enhanced scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: var(--background-secondary);
    }
    
    ::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: var(--primary-dark);
    }
`;
document.head.appendChild(style);
