/**
 * Auth Page JavaScript
 * Handles form transitions, password validation, and authentication
 */

document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const forms = document.querySelectorAll('form');

    // Toggle between sign in and sign up
    signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
    });

    // Password visibility toggle
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Password strength checker
    const passwordInput = document.getElementById('signup-password');
    const strengthBar = document.querySelector('.password-strength-bar');
    const passwordStrength = document.querySelector('.password-strength');

    if (passwordInput && strengthBar) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Length check
            if (password.length >= 8) strength += 25;
            
            // Uppercase check
            if (password.match(/[A-Z]/)) strength += 25;
            
            // Lowercase check
            if (password.match(/[a-z]/)) strength += 25;
            
            // Number/Special char check
            if (password.match(/[0-9]/) || password.match(/[^A-Za-z0-9]/)) strength += 25;

            strengthBar.className = 'password-strength-bar';
            passwordStrength.classList.add('has-strength');
            
            if (strength > 75) strengthBar.classList.add('strength-strong');
            else if (strength > 50) strengthBar.classList.add('strength-good');
            else if (strength > 25) strengthBar.classList.add('strength-fair');
            else if (strength > 0) strengthBar.classList.add('strength-weak');
        });
    }

    // Password confirmation validation
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirmPassword = this.value;
            const parent = this.parentElement;
            const errorMessage = parent.querySelector('.validation-message');
            
            if (confirmPassword && password !== confirmPassword) {
                parent.classList.add('error');
                parent.classList.remove('success');
                errorMessage.textContent = 'Las contraseñas no coinciden';
            } else if (confirmPassword) {
                parent.classList.remove('error');
                parent.classList.add('success');
                errorMessage.textContent = '';
            }
        });
    }

    // Form validation and submission
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                const submitButton = this.querySelector('button[type="submit"]');
                submitButton.classList.add('loading');
                
                // Simulate form submission
                setTimeout(() => {
                    submitButton.classList.remove('loading');
                    // Redirect to marketplace after successful submission
                    window.location.href = 'marketplace.html';
                }, 800);
            }
        });
    });

    function validateInput(input) {
        const parent = input.parentElement;
        const errorMessage = parent.querySelector('.validation-message');
        let isValid = true;

        // Clear previous states
        parent.classList.remove('error', 'success');

        // Required field validation
        if (input.required && !input.value.trim()) {
            parent.classList.add('error');
            errorMessage.textContent = `Por favor ingresa tu ${input.getAttribute('aria-label')}`;
            isValid = false;
        } 
        // Pattern validation
        else if (input.pattern && input.value && !new RegExp(input.pattern).test(input.value)) {
            parent.classList.add('error');
            errorMessage.textContent = `Por favor ingresa un ${input.getAttribute('aria-label')} válido`;
            isValid = false;
        }
        // Minlength validation
        else if (input.minLength && input.value.length < input.minLength) {
            parent.classList.add('error');
            errorMessage.textContent = `El campo debe tener al menos ${input.minLength} caracteres`;
            isValid = false;
        }
        // Maxlength validation for textarea
        else if (input.maxLength && input.value.length > input.maxLength) {
            parent.classList.add('error');
            errorMessage.textContent = `El campo no puede tener más de ${input.maxLength} caracteres`;
            isValid = false;
        }
        // File validation
        else if (input.type === 'file' && input.files.length > 0) {
            const file = input.files[0];
            const maxSize = 2 * 1024 * 1024; // 2MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            
            if (file.size > maxSize) {
                parent.classList.add('error');
                errorMessage.textContent = 'El archivo no puede ser mayor a 2MB';
                isValid = false;
            } else if (!allowedTypes.includes(file.type)) {
                parent.classList.add('error');
                errorMessage.textContent = 'Solo se permiten archivos JPG, PNG o WebP';
                isValid = false;
            } else {
                parent.classList.add('success');
            }
        }
        // Success state
        else if (input.value.trim()) {
            parent.classList.add('success');
        }

        return isValid;
    }

    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('ghost')) {
            e.target.click();
        }
    });

    // Social authentication handlers
    const socialButtons = document.querySelectorAll('.social');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.getAttribute('aria-label').includes('Facebook') ? 'Facebook' :
                           this.getAttribute('aria-label').includes('Google') ? 'Google' : 'LinkedIn';
            
            // Show loading state
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate social auth
            setTimeout(() => {
                this.innerHTML = originalHTML;
                alert(`Autenticación con ${provider} completada`);
                window.location.href = 'marketplace.html';
            }, 1500);
        });
    });

    // Forgot password handler
    const forgotPasswordLink = document.querySelector('a[href="#"]');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Funcionalidad de recuperación de contraseña en desarrollo');
        });
    }

    // File input handler
    const fileInput = document.getElementById('signup-profilepic');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Show preview or file name
                const parent = this.parentElement;
                const label = parent.querySelector('label');
                if (label) {
                    label.textContent = `Archivo seleccionado: ${file.name}`;
                }
            }
        });
    }

    // Textarea character counter
    const textarea = document.getElementById('signup-bio');
    if (textarea) {
        textarea.addEventListener('input', function() {
            const maxLength = this.maxLength;
            const currentLength = this.value.length;
            const remaining = maxLength - currentLength;
            
            // Update character count if needed
            const parent = this.parentElement;
            const errorMessage = parent.querySelector('.validation-message');
            if (remaining < 50) {
                errorMessage.textContent = `${remaining} caracteres restantes`;
                errorMessage.style.display = 'block';
            } else {
                errorMessage.style.display = 'none';
            }
        });
    }
}); 