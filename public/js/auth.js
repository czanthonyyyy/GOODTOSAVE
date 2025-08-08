/**
 * Auth Page JavaScript
 * Handles authentication, form validation, and user management
 */

document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const forms = document.querySelectorAll('form');

    // Verificar que Firebase esté disponible
    if (!window.firebaseAuthService) {
        console.error('Firebase Auth Service is not available');
        showError('Configuration error: Firebase is not available');
        return;
    }

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
                errorMessage.textContent = 'Passwords do not match';
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

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                await handleFormSubmission(this);
            }
        });
    });

    // Authentication Handlers
    async function handleFormSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        try {
            submitButton.classList.add('loading');
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
            
            if (form.id === 'signinForm') {
                await handleSignIn(form);
            } else if (form.id === 'signupForm') {
                await handleSignUp(form);
            }
        } catch (error) {
            console.error('Authentication error:', error);
            showError(error.message);
        } finally {
            submitButton.classList.remove('loading');
            submitButton.innerHTML = originalText;
        }
    }

    async function handleSignIn(form) {
        const email = form.querySelector('#signin-email').value;
        const password = form.querySelector('#signin-password').value;

        try {
            const user = await window.firebaseAuthService.signIn(email, password);
            console.log('Authenticated user:', user);
            
            // Guardar información del usuario en localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
            }));
            
            showSuccess('Signed in successfully');
            
            // Redirigir al marketplace tras login exitoso
            setTimeout(() => {
                window.location.href = 'marketplace.html';
            }, 1000);
        } catch (error) {
            throw new Error(error);
        }
    }

    async function handleSignUp(form) {
        const formData = {
            firstName: form.querySelector('#signup-firstname').value,
            lastName: form.querySelector('#signup-lastname').value,
            email: form.querySelector('#signup-email').value,
            password: form.querySelector('#signup-password').value,
            phone: form.querySelector('#signup-phone').value,
            accountType: form.querySelector('#signup-account-type').value,
            location: form.querySelector('#signup-location').value
        };

        try {
            const user = await window.firebaseAuthService.signUp(formData);
            console.log('Registered user:', user);
            
            // Guardar información del usuario en localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
            }));
            
            showSuccess('Registered successfully');
            
            // Redirect to marketplace after successful registration
            setTimeout(() => {
                window.location.href = 'marketplace.html';
            }, 1000);
        } catch (error) {
            throw new Error(error);
        }
    }

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
        // Email validation
        else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
            parent.classList.add('error');
            errorMessage.textContent = 'Please enter a valid email';
            isValid = false;
        }
        // Pattern validation
        else if (input.pattern && input.value && !new RegExp(input.pattern).test(input.value)) {
            parent.classList.add('error');
            errorMessage.textContent = `Please enter a valid ${input.getAttribute('aria-label')}`;
            isValid = false;
        }
        // Minlength validation
        else if (input.minLength && input.value.length < input.minLength) {
            parent.classList.add('error');
            errorMessage.textContent = `El campo debe tener al menos ${input.minLength} caracteres`;
            isValid = false;
        }
        // Success state
        else if (input.value.trim()) {
            parent.classList.add('success');
        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(message) {
        // Crear o actualizar mensaje de error
        let errorDiv = document.getElementById('auth-error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'auth-error-message';
            errorDiv.className = 'auth-error-message';
            document.body.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.style.backgroundColor = '#ff4444';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '10px';
        errorDiv.style.margin = '10px';
        errorDiv.style.borderRadius = '5px';
        errorDiv.style.textAlign = 'center';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    function showSuccess(message) {
        // Create or update success message
        let successDiv = document.getElementById('auth-success-message');
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.id = 'auth-success-message';
            successDiv.className = 'auth-success-message';
            document.body.appendChild(successDiv);
        }
        
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        successDiv.style.backgroundColor = '#4CAF50';
        successDiv.style.color = 'white';
        successDiv.style.padding = '10px';
        successDiv.style.margin = '10px';
        successDiv.style.borderRadius = '5px';
        successDiv.style.textAlign = 'center';
        
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
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
            
            // TODO: Implementar autenticación social
            setTimeout(() => {
                this.innerHTML = originalHTML;
                showError(`Sign in with ${provider} not implemented yet`);
            }, 1500);
        });
    });

    // Forgot password handler
    const forgotPasswordLink = document.querySelector('a[href="#"]');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async function(e) {
            e.preventDefault();
            const email = document.getElementById('signin-email').value;
            
            if (!email) {
                showError('Please enter your email to reset your password');
                return;
            }
            
            try {
                await window.firebaseAuthService.sendPasswordResetEmail(email);
                showSuccess('Password reset email sent. Check your inbox.');
            } catch (error) {
                showError(error);
            }
        });
    }

    // Verificar estado de autenticación al cargar la página
    window.firebaseAuthService.onAuthStateChanged((user) => {
        if (user) {
            console.log('User already authenticated:', user);
            // Redirection removed to allow staying on auth page
        }
    });
}); 