// Payment Page New JavaScript

class PaymentManager {
    constructor() {
        this.cartItems = [];
        this.init();
    }

    init() {
        this.loadCartItems();
        this.setupEventListeners();
        this.setupFormValidation();
    }

    loadCartItems() {
        // Load cart items from localStorage
        const checkoutItems = localStorage.getItem('checkoutItems');
        if (checkoutItems) {
            this.cartItems = JSON.parse(checkoutItems);
        } else {
            // If no items, redirect back to marketplace
            window.location.href = 'marketplace.html';
        }
    }

    setupEventListeners() {
        const form = document.getElementById('payment-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Modal event listeners
        const closeModalBtn = document.getElementById('close-modal');
        const cancelPaymentBtn = document.getElementById('cancel-payment');
        const confirmPaymentBtn = document.getElementById('confirm-payment');
        const modalOverlay = document.getElementById('order-modal');

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeModal());
        }

        if (cancelPaymentBtn) {
            cancelPaymentBtn.addEventListener('click', () => this.closeModal());
        }

        if (confirmPaymentBtn) {
            confirmPaymentBtn.addEventListener('click', () => this.processPayment());
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }

        // Card number formatting
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => this.formatCardNumber(e.target));
        }

        // Expiry date formatting
        const expiryMonthInput = document.getElementById('expiry-month');
        const expiryYearInput = document.getElementById('expiry-year');
        
        if (expiryMonthInput) {
            expiryMonthInput.addEventListener('input', (e) => this.formatExpiryMonth(e.target));
        }
        
        if (expiryYearInput) {
            expiryYearInput.addEventListener('input', (e) => this.formatExpiryYear(e.target));
        }

        // CVV formatting
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => this.formatCVV(e.target));
        }
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearFieldError(field);

        // Check if field is empty
        if (!value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else {
            // Specific validation for different field types
            switch (field.type) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                case 'tel':
                    if (!this.isValidPhone(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number';
                    }
                    break;
                default:
                    // Check field name for specific validation
                    if (field.name === 'cardNumber') {
                        if (!this.isValidCardNumber(value)) {
                            isValid = false;
                            errorMessage = 'Please enter a valid card number';
                        }
                    } else if (field.name === 'expiryMonth') {
                        if (!this.isValidExpiryMonth(value)) {
                            isValid = false;
                            errorMessage = 'Please enter a valid month (01-12)';
                        }
                    } else if (field.name === 'expiryYear') {
                        if (!this.isValidExpiryYear(value)) {
                            isValid = false;
                            errorMessage = 'Please enter a valid year';
                        }
                    } else if (field.name === 'cvv') {
                        if (!this.isValidCVV(value)) {
                            isValid = false;
                            errorMessage = 'Please enter a valid CVV';
                        }
                    }
                    break;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    isValidCardNumber(cardNumber) {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        return cleanNumber.length >= 13 && cleanNumber.length <= 19;
    }

    isValidExpiryMonth(month) {
        const monthNum = parseInt(month);
        return monthNum >= 1 && monthNum <= 12;
    }

    isValidExpiryYear(year) {
        const currentYear = new Date().getFullYear();
        const yearNum = parseInt('20' + year);
        return yearNum >= currentYear && yearNum <= currentYear + 20;
    }

    isValidCVV(cvv) {
        return cvv.length >= 3 && cvv.length <= 4;
    }

    showFieldError(field, message) {
        field.style.borderColor = '#e74c3c';
        field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        
        // Create or update error message
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.25rem';
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    formatCardNumber(input) {
        let value = input.value.replace(/\s/g, '');
        value = value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        input.value = value;
    }

    formatExpiryMonth(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2);
        }
        input.value = value;
    }

    formatExpiryYear(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2);
        }
        input.value = value;
    }

    formatCVV(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 4) {
            value = value.substring(0, 4);
        }
        input.value = value;
    }

    validateForm() {
        const requiredFields = document.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.showNotification('Please fix the errors in the form', 'error');
            return;
        }

        // Show modal with order summary
        this.showOrderModal();
    }

    showOrderModal() {
        const modal = document.getElementById('order-modal');
        if (!modal) return;

        // Populate modal with order items
        this.renderModalOrderItems();
        this.calculateModalTotals();

        // Show modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('order-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    renderModalOrderItems() {
        const modalOrderItems = document.getElementById('modal-order-items');
        if (!modalOrderItems) return;

        if (this.cartItems.length === 0) {
            modalOrderItems.innerHTML = '<p class="empty-order">No items in cart</p>';
            return;
        }

        const itemsHTML = this.cartItems.map(item => `
            <div class="modal-order-item">
                <img src="${item.image}" alt="${item.title}" class="modal-order-item-image">
                <div class="modal-order-item-details">
                    <div class="modal-order-item-title">${item.title}</div>
                    <div class="modal-order-item-price">$${item.price}</div>
                </div>
                <div class="modal-order-item-quantity">x${item.quantity}</div>
            </div>
        `).join('');

        modalOrderItems.innerHTML = itemsHTML;
    }

    calculateModalTotals() {
        const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;

        // Update modal totals
        const subtotalElement = document.getElementById('modal-subtotal');
        const taxElement = document.getElementById('modal-tax');
        const totalElement = document.getElementById('modal-total');

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    async processPayment() {
        const confirmBtn = document.getElementById('confirm-payment');
        const originalText = confirmBtn.innerHTML;
        
        // Show loading state
        confirmBtn.innerHTML = `
            <div class="spinner"></div>
            Processing Payment...
        `;
        confirmBtn.disabled = true;

        try {
            // Simulate payment processing
            await this.simulatePaymentProcessing();
            
            // Clear cart
            localStorage.removeItem('cartItems');
            localStorage.removeItem('checkoutItems');
            
            // Redirect to QR page
            window.location.href = 'qr.html';
            
        } catch (error) {
            console.error('Payment error:', error);
            this.showNotification('Payment failed. Please try again.', 'error');
            
            // Reset button
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }

    async simulatePaymentProcessing() {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 2000);
        });
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '8px';
        notification.style.color = 'white';
        notification.style.fontWeight = '600';
        notification.style.zIndex = '10000';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #39b54a, #2ecc71)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize payment manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PaymentManager();
});

// Add CSS for spinner
const style = document.createElement('style');
style.textContent = `
    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        display: inline-block;
        margin-right: 0.5rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .field-error {
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }
    
    .empty-order {
        text-align: center;
        color: var(--text-secondary, #cccccc);
        font-style: italic;
        padding: 2rem;
    }
`;
document.head.appendChild(style); 