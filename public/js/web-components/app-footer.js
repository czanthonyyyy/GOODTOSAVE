class AppFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--background-secondary);
                    color: var(--text-primary);
                    padding: 3rem 0 1rem;
                    margin-top: 4rem;
                }

                .footer-content {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    margin-bottom: 2rem;
                    max-width: 1200px;
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: 20px;
                    padding-right: 20px;
                }

                .footer-section h3 {
                    color: var(--text-highlight);
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                    font-family: 'Inter', sans-serif;
                }

                .footer-links {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .footer-links li {
                    margin-bottom: 0.5rem;
                }

                .footer-links a {
                    color: var(--text-primary);
                    text-decoration: none;
                    transition: var(--transition);
                    font-family: 'Inter', sans-serif;
                }

                .footer-links a:hover {
                    color: var(--primary-color);
                }

                .footer-bottom {
                    border-top: 1px solid var(--text-lighter);
                    padding-top: 1rem;
                    text-align: center;
                    color: var(--text-light);
                    max-width: 1200px;
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: 20px;
                    padding-right: 20px;
                }

                .newsletter {
                    margin-top: 1rem;
                }

                .newsletter h4 {
                    margin-bottom: 0.5rem;
                    color: var(--text-highlight);
                    font-family: 'Inter', sans-serif;
                }

                .newsletter p {
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                    font-family: 'Inter', sans-serif;
                }

                .newsletter-input-group {
                    display: flex;
                    gap: 0.5rem;
                }

                .newsletter-input {
                    flex-grow: 1;
                    padding: 0.75rem;
                    border: 2px solid var(--text-lighter);
                    border-radius: var(--border-radius);
                    background-color: var(--white);
                    color: var(--text-highlight);
                    font-family: 'Inter', sans-serif;
                }

                .newsletter-input:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px var(--shadow-green);
                }

                .newsletter-btn {
                    padding: 0.75rem 1rem;
                    background-color: var(--primary-color);
                    color: var(--white);
                    border: none;
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    transition: var(--transition);
                    font-family: 'Inter', sans-serif;
                    font-weight: 500;
                }

                .newsletter-btn:hover {
                    background-color: var(--primary-dark);
                    transform: translateY(-1px);
                }

                .newsletter-message {
                    margin-top: 0.5rem;
                    padding: 0.5rem;
                    border-radius: var(--border-radius);
                    font-size: 0.875rem;
                    display: none;
                }

                .newsletter-success {
                    background-color: rgba(76, 175, 80, 0.1);
                    color: var(--success-color);
                    border: 1px solid var(--success-color);
                }

                .newsletter-error {
                    background-color: rgba(231, 76, 60, 0.1);
                    color: var(--error-color);
                    border: 1px solid var(--error-color);
                }

                .social-links {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .social-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background-color: var(--primary-color);
                    color: var(--white);
                    border-radius: 50%;
                    text-decoration: none;
                    transition: var(--transition);
                }

                .social-link:hover {
                    background-color: var(--primary-dark);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .footer-content {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    
                    .newsletter-input-group {
                        flex-direction: column;
                    }
                }

                :root {
                    --background-secondary: #111111;
                    --text-primary: #767676;
                    --text-highlight: #2d3436;
                    --text-light: #909090;
                    --text-lighter: #c5c5c5;
                    --primary-color: #39b54a;
                    --primary-dark: #219a52;
                    --success-color: #4caf50;
                    --error-color: #e74c3c;
                    --white: #ffffff;
                    --shadow-green: rgba(46, 204, 113, 0.15);
                    --border-radius: 8px;
                    --transition: all 0.3s ease;
                }
            </style>
            
            <footer class="footer">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>Good to Save</h3>
                        <p>Connecting providers and consumers to reduce food waste and create a more sustainable future.</p>
                        <div class="social-links">
                            <a href="#" class="social-link" aria-label="Facebook">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="Twitter">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="LinkedIn">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="marketplace.html">Marketplace</a></li>
                            <li><a href="about.html">About Us</a></li>
                            <li><a href="auth.html">Sign In</a></li>
                            <li><a href="#support">Support</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Resources</h3>
                        <ul class="footer-links">
                            <li><a href="#blog">Blog</a></li>
                            <li><a href="#guides">Guides</a></li>
                            <li><a href="#faq">FAQ</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Newsletter</h3>
                        <div class="newsletter">
                            <p>Subscribe to receive the latest news and special offers.</p>
                            <div class="newsletter-input-group">
                                <input type="email" class="newsletter-input" placeholder="Your email address" id="newsletter-email">
                                <button class="newsletter-btn" id="newsletter-submit">Subscribe</button>
                            </div>
                            <div class="newsletter-message" id="newsletter-message"></div>
                        </div>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>&copy; 2024 Good to Save. All rights reserved. | <i class="fas fa-heart"></i> Made with love for the planet</p>
                </div>
            </footer>
        `;
    }

    setupEventListeners() {
        const newsletterSubmit = this.shadowRoot.getElementById('newsletter-submit');
        const newsletterEmail = this.shadowRoot.getElementById('newsletter-email');
        const newsletterMessage = this.shadowRoot.getElementById('newsletter-message');

        newsletterSubmit.addEventListener('click', () => {
            const email = newsletterEmail.value.trim();
            
            if (!email) {
                this.showNewsletterMessage('Please enter your email address.', 'error');
                return;
            }

            if (!this.isValidEmail(email)) {
                this.showNewsletterMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate newsletter submission
            newsletterSubmit.textContent = 'Sending...';
            newsletterSubmit.disabled = true;

            setTimeout(() => {
                this.showNewsletterMessage('Thank you for subscribing! We will keep you informed.', 'success');
                newsletterEmail.value = '';
                newsletterSubmit.textContent = 'Subscribe';
                newsletterSubmit.disabled = false;
            }, 1000);
        });

        // Permitir envío con Enter
        newsletterEmail.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                newsletterSubmit.click();
            }
        });
    }

    showNewsletterMessage(message, type) {
        const newsletterMessage = this.shadowRoot.getElementById('newsletter-message');
        newsletterMessage.textContent = message;
        newsletterMessage.className = `newsletter-message newsletter-${type}`;
        newsletterMessage.style.display = 'block';

        setTimeout(() => {
            newsletterMessage.style.display = 'none';
        }, 5000);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    updateFoodSaved(amount) {
        // Método para actualizar estadísticas de comida salvada
        console.log(`Comida salvada actualizada: ${amount} kg`);
    }
}

customElements.define('app-footer', AppFooter); 