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
                    padding: 4rem 0 calc(6rem + env(safe-area-inset-bottom, 0px));
                    margin-top: 6rem;
                }

                .footer-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1.5fr;
                    gap: 2rem;
                    margin-bottom: 2rem;
                    max-width: 1200px;
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: 20px;
                    padding-right: 20px;
                    margin-top: 2rem;
                    overflow: hidden;
                }

                .footer-section {
                    max-width: 100%;
                    overflow: hidden;
                    word-wrap: break-word;
                    display: flex;
                    flex-direction: column;
                }

                .footer-section:last-child {
                    grid-column: 4;
                    overflow: visible;
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

                .footer-bottom p {
                    margin: 0 0 0.25rem;
                }

                .legal-links {
                    margin-top: 0.15rem;
                    font-size: 0.9rem;
                }

                .legal-links a {
                    color: var(--text-primary);
                    text-decoration: none;
                    transition: var(--transition);
                    font-family: 'Inter', sans-serif;
                }

                .legal-links a:hover {
                    color: var(--primary-color);
                }

                .legal-links .separator {
                    color: var(--text-lighter);
                    margin: 0 0.5rem;
                }

                .newsletter {
                    margin-top: 0.5rem;
                    background: linear-gradient(135deg, rgba(57, 181, 74, 0.05) 0%, rgba(46, 204, 113, 0.05) 100%);
                    border: 1px solid rgba(57, 181, 74, 0.1);
                    border-radius: 12px;
                    padding: 1.25rem;
                    position: relative;
                    overflow: hidden;
                    max-width: 100%;
                    box-sizing: border-box;
                    width: 100%;
                    margin-left: 0;
                }

                .newsletter::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--primary-color), var(--primary-dark));
                }

                .newsletter h4 {
                    margin-bottom: 0.5rem;
                    color: var(--text-highlight);
                    font-family: 'Inter', sans-serif;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                .newsletter p {
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                    font-family: 'Inter', sans-serif;
                    line-height: 1.5;
                    font-size: 0.9rem;
                }

                .newsletter-input-group {
                    display: flex;
                    gap: 0.75rem;
                    position: relative;
                    max-width: 100%;
                    width: 100%;
                    align-items: flex-start;
                }

                .newsletter-input {
                    flex: 1.2;
                    min-width: 0;
                    padding: 0.875rem 1rem;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    background-color: rgba(255, 255, 255, 0.95);
                    color: var(--text-highlight);
                    font-family: 'Inter', sans-serif;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    box-sizing: border-box;
                }

                .newsletter-input::placeholder {
                    color: #999;
                    font-style: italic;
                }

                .newsletter-input:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(57, 181, 74, 0.15);
                    background-color: rgba(255, 255, 255, 1);
                    transform: translateY(-1px);
                }

                .newsletter-btn {
                    padding: 0.875rem 1.5rem;
                    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
                    color: var(--white);
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: 'Inter', sans-serif;
                    font-weight: 600;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    position: relative;
                    overflow: hidden;
                    min-width: 120px;
                    max-width: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(57, 181, 74, 0.2);
                    box-sizing: border-box;
                    flex-shrink: 0;
                    white-space: nowrap;
                }

                .newsletter-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                }

                .newsletter-btn:hover::before {
                    left: 100%;
                }

                .newsletter-btn:hover {
                    background: linear-gradient(135deg, var(--primary-dark) 0%, #1a7a3a 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(57, 181, 74, 0.4);
                }

                .newsletter-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 3px 10px rgba(57, 181, 74, 0.3);
                }

                .newsletter-message {
                    margin-top: 0.75rem;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    display: none;
                    font-weight: 500;
                    position: relative;
                    animation: slideIn 0.3s ease;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .newsletter-success {
                    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
                    color: #2e7d32;
                    border: 1px solid rgba(76, 175, 80, 0.2);
                    border-left: 4px solid #4caf50;
                }

                .newsletter-error {
                    background: linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(231, 76, 60, 0.05) 100%);
                    color: #c62828;
                    border: 1px solid rgba(231, 76, 60, 0.2);
                    border-left: 4px solid #e74c3c;
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
                    width: 42px;
                    height: 42px;
                    background-color: var(--primary-color);
                    color: var(--white);
                    border-radius: 50%;
                    text-decoration: none;
                    transition: var(--transition);
                    box-shadow: 0 2px 8px rgba(57, 181, 74, 0.3);
                    position: relative;
                    overflow: hidden;
                }

                .social-link::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                }

                .social-link:hover::before {
                    left: 100%;
                }

                .social-link:hover {
                    background-color: var(--primary-dark);
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 4px 15px rgba(57, 181, 74, 0.4);
                }

                .social-link svg {
                    position: relative;
                    z-index: 1;
                    transition: transform 0.3s ease;
                }

                .social-link:hover svg {
                    transform: scale(1.1);
                }

                @media (max-width: 1024px) {
                    .footer-content {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.5rem;
                    }
                    
                    .footer-section:last-child {
                        grid-column: auto;
                        overflow: hidden;
                    }
                }

                @media (max-width: 768px) {
                    .footer-content {
                        grid-template-columns: 1fr;
                        gap: 1.25rem;
                        padding-left: 15px;
                        padding-right: 15px;
                    }
                    
                    .footer-section:last-child {
                        grid-column: auto;
                        overflow: hidden;
                    }
                    
                    .newsletter {
                        padding: 1rem;
                        margin-top: 0.25rem;
                        max-width: 100%;
                        width: 100%;
                        margin-left: 0;
                    }

                    .newsletter-input-group {
                        flex-direction: column;
                        gap: 0.5rem;
                        width: 100%;
                        max-width: 100%;
                    }

                    .newsletter-btn {
                        padding: 0.75rem 1rem;
                        font-size: 0.85rem;
                        min-width: auto;
                        max-width: 100%;
                        width: 100%;
                    }

                    .newsletter-input {
                        padding: 0.75rem 0.875rem;
                        font-size: 0.85rem;
                        min-width: auto;
                        width: 100%;
                        flex: 1;
                    }

                    .social-links {
                        justify-content: center;
                        gap: 0.75rem;
                    }

                    .social-link {
                        width: 38px;
                        height: 38px;
                    }

                    .social-link svg {
                        width: 14px;
                        height: 14px;
                    }
                }

                @media (max-width: 480px) {
                    .footer-content {
                        padding-left: 10px;
                        padding-right: 10px;
                        gap: 0.875rem;
                    }
                    
                    .newsletter {
                        padding: 0.875rem;
                        margin-top: 0.125rem;
                        max-width: 100%;
                        width: 100%;
                        margin-left: 0;
                    }
                    
                    .newsletter-input-group {
                        gap: 0.375rem;
                        flex-direction: column;
                        max-width: 100%;
                        width: 100%;
                    }
                    
                    .newsletter-btn {
                        padding: 0.625rem 0.875rem;
                        font-size: 0.8rem;
                        width: 100%;
                        max-width: 100%;
                    }
                    
                    .newsletter-input {
                        padding: 0.625rem 0.75rem;
                        font-size: 0.8rem;
                        width: 100%;
                        flex: 1;
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
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Facebook">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="X (Twitter)">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="../marketplace/marketplace.html">Marketplace</a></li>
                            <li><a href="../pages/about.html">About Us</a></li>
                            <li><a href="../auth/auth.html" data-auth-link>Sign In</a></li>
                            <li><a href="#support">Support</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Resources</h3>
                        <ul class="footer-links">
                            <li><a href="../pages/blog.html">Blog</a></li>
                            <li><a href="#guides">Guides</a></li>
                            <li><a href="#faq">FAQ</a></li>
                            <li><a href="../pages/contact.html">Contact</a></li>
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
                    <p>&copy; 2025 Good to Save. All rights reserved. | <i class="fas fa-heart"></i> Made with love for the planet</p>
                    <nav class="legal-links" aria-label="Legal links">
                        <a href="../pages/privacy.html">Privacy Policy</a>
                        <span class="separator">•</span>
                        <a href="../pages/terms.html">Terms of Service</a>
                        <span class="separator">•</span>
                        <a href="../pages/data-protection.html">Data Protection</a>
                        <span class="separator">•</span>
                        <a href="../pages/accessibility.html">Accessibility</a>
                    </nav>
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