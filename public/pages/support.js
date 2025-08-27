// Support Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    initSearch();
    initContactForm();
});

// FAQ Functionality
function initFAQ() {
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
}

function performSearch() {
    const searchTerm = document.getElementById('support-search').value.trim();
    
    if (!searchTerm) {
        showMessage('Please enter a search term', 'warning');
        return;
    }
    
    // Simulate search functionality
    showMessage(`Searching for: "${searchTerm}"`, 'info');
    
    setTimeout(() => {
        const results = searchFAQ(searchTerm);
        if (results.length > 0) {
            showMessage(`Found ${results.length} results for "${searchTerm}"`, 'success');
            highlightResults(searchTerm);
        } else {
            showMessage(`No results found for "${searchTerm}"`, 'warning');
        }
    }, 1000);
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

function highlightResults(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3');
        const answer = item.querySelector('.faq-answer p');
        
        if (question.textContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
            answer.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
            
            item.classList.add('active');
            
            // Scroll to the first result
            if (item === faqItems[0]) {
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
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
    });
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
        margin-top: 0.25rem;
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

// Utility Functions
function showMessage(message, type) {
    // Create or update message
    let messageElement = document.querySelector('.message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            font-size: 0.875rem;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(messageElement);
    }
    
    // Set message content and styling
    messageElement.textContent = message;
    messageElement.className = `message message-${type}`;
    
    // Apply styling based on type
    const styles = {
        success: 'background: rgba(76, 175, 80, 0.9); color: white; border: 1px solid rgba(76, 175, 80, 0.3);',
        error: 'background: rgba(231, 76, 60, 0.9); color: white; border: 1px solid rgba(231, 76, 60, 0.3);',
        warning: 'background: rgba(255, 152, 0, 0.9); color: white; border: 1px solid rgba(255, 152, 0, 0.3);',
        info: 'background: rgba(33, 150, 243, 0.9); color: white; border: 1px solid rgba(33, 150, 243, 0.3);'
    };
    
    messageElement.style.cssText += styles[type] || styles.info;
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

// Add CSS for form validation and animations
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    
    .field-error {
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
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
`;
document.head.appendChild(style);
