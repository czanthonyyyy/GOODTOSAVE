// About Us Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Team Carousel functionality - Variables must be declared first
    let currentSlide = 0;
    let totalSlides = 0;
    let slidesPerView = 3;
    let autoPlayInterval = null;
    let isAutoPlaying = false;
    
    // Initialize all components
    initializeCounters();
    initializeScrollAnimations();
    loadTeamMembers();
    initializeParticles();
    initializeFAQ();
    
    // Counter Animation
    function initializeCounters() {
        const counters = document.querySelectorAll('.metric-counter');
        
        const animateCounter = (counter) => {
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
                counter.textContent = Math.floor(current).toLocaleString();
            }, 16);
        };
        
        // Intersection Observer for counters
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    // Scroll Animations
    function initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll('.feature-item, .impact-card, .story-card, .value-card');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            animationObserver.observe(element);
        });
    }
    
    // Load Team Members
    function loadTeamMembers() {
        const teamCarouselTrack = document.getElementById('team-carousel-track');
        if (!teamCarouselTrack) return;
        
        // Sample team data (in a real app, this would come from an API)
        const teamMembers = [
            {
                name: 'Edgar Chacón',
                role: 'CEO & Founder',
                image: '../assets/images/team/edgar-chacon.jpg',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'edgar.chacon2025@motta.superate.org.pa'
                }
            },
            {
                name: 'Anthony Cruz',
                role: 'CTO',
                image: '../assets/images/team/anthony-cruz.jpg',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'anthony.cruz2025@motta.superate.org.pa'
                }
            },
            {
                name: 'Brian Lee',
                role: 'Head of Operations',
                image: '../assets/images/team/brian-lee.jpg',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'brian.lee2025@motta.superate.org.pa'
                }
            },
            {
                name: 'Nadia Tapia',
                role: 'Head of Marketing',
                image: '../assets/images/team/nadia-tapia.jpg',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'nadia.tapia2025@motta.superate.org.pa'
                }
            },
            {
                name: 'Abel Alonzo',
                role: 'Product Manager',
                image: '../assets/images/team/abel-alonzo.jpg',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'abel.alonzo2025@motta.superate.org.pa'
                }
            },
            {
                name: 'Oscar López',
                role: 'Lead Developer',
                image: '../assets/images/team/oscar-lopez.jpg',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'oscar.lopez2025@motta.superate.org.pa'
                }
            },
            {
                name: 'Ana Pereira',
                role: 'UX/UI Designer',
                image: '../assets/images/team/ana-pereira.jpg',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'ana.pereira2025@motta.superate.org.pa'
                }
            },
            {
                name: 'Mirelys Garrido',
                role: 'Data Scientist',
                image: '../assets/images/team/mirelys-garrido.jpg',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'mirelys.garrido2025@motta.superate.org.pa'
                }
            },
            {
                name: 'Mileny Riquelme',
                role: 'Community Manager',
                image: '../assets/images/team/mileny-riquelme.jpg',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'mileny.riquelme2025@motta.superate.org.pa'
                }
            },
            {
                name: 'Emanuel Ramos',
                role: 'Business Development',
                image: '../assets/images/team/emanuel-ramos.jpg',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'emanuel.ramos2025@motta.superate.org.pa'
                }
            },
            {
                name: 'Ivan Fuentes',
                role: 'Content Strategist',
                image: '../assets/images/team/ivan-fuentes.jpg',
                social: {
                    linkedin: '#',
                    twitter: '#',
                    email: 'ivan.fuentes2025@motta.superate.org.pa'
                }
            }
        ];
        
        // Clear existing content
        teamCarouselTrack.innerHTML = '';
        
        // Add team members to carousel
        teamMembers.forEach(member => {
            console.log(`Loading image for ${member.name}: ${member.image}`);
            const memberCard = createTeamMemberCard(member);
            teamCarouselTrack.appendChild(memberCard);
        });
        
        totalSlides = teamMembers.length;
        updateSlidesPerView();
        setupCarouselControls();
        createCarouselDots();
        updateCarouselState();
    }
    
    function createTeamMemberCard(member) {
        const card = document.createElement('div');
        card.className = 'team-member-card';
        card.innerHTML = `
            <div class="member-photo">
                <img src="${member.image}" alt="${member.name}" loading="lazy" 
                     onerror="this.src='../assets/images/logo.svg'; this.style.opacity='0.5';">
            </div>
            <div class="member-overlay">
                <div class="member-info">
                    <h3 class="member-name">${member.name}</h3>
                    <p class="member-role">${member.role}</p>
                    <div class="member-social">
                        <a href="${member.social.linkedin}" class="social-link" title="LinkedIn">
                            <i class="fab fa-linkedin"></i>
                        </a>
                        <a href="${member.social.twitter}" class="social-link" title="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="mailto:${member.social.email}" class="social-link" title="Email">
                            <i class="fas fa-envelope"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Hover effects are handled by CSS
        
        return card;
    }
    
    // Carousel control functions
    function updateSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 480) {
            slidesPerView = 1;
        } else if (width <= 768) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
    }
    
    function setupCarouselControls() {
        const prevBtn = document.getElementById('team-prev-btn');
        const nextBtn = document.getElementById('team-next-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                pauseAutoPlay();
                if (currentSlide > 0) {
                    currentSlide--;
                    updateCarouselState();
                }
                // Resume auto-play after 5 seconds of inactivity
                setTimeout(resumeAutoPlay, 5000);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                pauseAutoPlay();
                const maxSlide = Math.max(0, totalSlides - slidesPerView);
                if (currentSlide < maxSlide) {
                    currentSlide++;
                    updateCarouselState();
                }
                // Resume auto-play after 5 seconds of inactivity
                setTimeout(resumeAutoPlay, 5000);
            });
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            updateSlidesPerView();
            updateCarouselState();
        });
        
        // Add touch/swipe support for mobile
        const carousel = document.getElementById('team-carousel');
        if (carousel) {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            
            carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });
            
            carousel.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                const diff = startX - currentX;
                
                // Prevent default scrolling when swiping
                if (Math.abs(diff) > 10) {
                    e.preventDefault();
                }
            });
            
            carousel.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                
                const diff = startX - currentX;
                const threshold = 50; // minimum swipe distance
                
                if (Math.abs(diff) > threshold) {
                    pauseAutoPlay();
                    if (diff > 0) {
                        // Swipe left - next slide
                        const maxSlide = Math.max(0, totalSlides - slidesPerView);
                        if (currentSlide < maxSlide) {
                            currentSlide++;
                            updateCarouselState();
                        }
                    } else {
                        // Swipe right - previous slide
                        if (currentSlide > 0) {
                            currentSlide--;
                            updateCarouselState();
                        }
                    }
                    // Resume auto-play after 5 seconds of inactivity
                    setTimeout(resumeAutoPlay, 5000);
                }
                
                isDragging = false;
            });
        }
    }
    
    function createCarouselDots() {
        const dotsContainer = document.getElementById('team-carousel-dots');
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        const maxSlide = Math.max(0, totalSlides - slidesPerView);
        
        for (let i = 0; i <= maxSlide; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', () => {
                pauseAutoPlay();
                currentSlide = i;
                updateCarouselState();
                // Resume auto-play after 5 seconds of inactivity
                setTimeout(resumeAutoPlay, 5000);
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    function updateCarouselState() {
        const track = document.getElementById('team-carousel-track');
        const prevBtn = document.getElementById('team-prev-btn');
        const nextBtn = document.getElementById('team-next-btn');
        const dots = document.querySelectorAll('.carousel-dot');
        
        if (!track) return;
        
        // Calculate slide width and gap
        const slideWidth = 300; // min-width of each card
        const gap = 32; // 2rem gap
        const translateX = -(currentSlide * (slideWidth + gap));
        
        track.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        if (prevBtn) {
            prevBtn.disabled = currentSlide === 0;
        }
        
        if (nextBtn) {
            const maxSlide = Math.max(0, totalSlides - slidesPerView);
            nextBtn.disabled = currentSlide >= maxSlide;
        }
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Auto-play carousel
    function startAutoPlay() {
        if (isAutoPlaying) return;
        
        isAutoPlaying = true;
        autoPlayInterval = setInterval(() => {
            const maxSlide = Math.max(0, totalSlides - slidesPerView);
            if (currentSlide >= maxSlide) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            updateCarouselState();
        }, 4000); // Change slide every 4 seconds
    }
    
    function pauseAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        isAutoPlaying = false;
    }
    
    function resumeAutoPlay() {
        if (!isAutoPlaying) {
            startAutoPlay();
        }
    }
    
    // Start auto-play after a delay
    setTimeout(() => {
        startAutoPlay();
    }, 2000);
    
    // Particle Animation
    function initializeParticles() {
        const heroSection = document.querySelector('.about-hero');
        if (!heroSection) return;
        
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            createParticle(heroSection);
        }
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: float-particle ${3 + Math.random() * 4}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 7000);
    }
    
    // Add CSS for floating particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0%, 100% { 
                transform: translateY(0px) translateX(0px);
                opacity: 0;
            }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { 
                transform: translateY(-100px) translateX(${Math.random() * 100 - 50}px);
                opacity: 0;
            }
        }
        
        .team-member-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .member-photo {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin: 0 auto 1.5rem;
            overflow: hidden;
            border: 4px solid var(--primary-color);
        }
        
        .member-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .member-name {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-highlight);
            margin-bottom: 0.5rem;
        }
        
        .member-role {
            color: var(--primary-color);
            font-weight: 500;
            margin-bottom: 1rem;
        }
        
        .member-bio {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        
        .member-social {
            display: flex;
            justify-content: center;
            gap: 1rem;
        }
        
        .social-link {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            transition: all 0.3s ease;
            text-decoration: none;
        }
        
        .social-link:hover {
            background: var(--primary-color);
            color: var(--white);
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.about-hero');
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            console.log(`Image loaded successfully: ${this.src}`);
            this.style.opacity = '1';
        });
        img.addEventListener('error', function() {
            console.error(`Failed to load image: ${this.src}`);
            this.style.opacity = '0.5';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
    
    // Add hover effects for cards
    const cards = document.querySelectorAll('.impact-card, .story-card, .value-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click effects for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // FAQ Functionality
    function initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.fa-chevron-down');
            
            if (question && answer && icon) {
                question.addEventListener('click', () => {
                    const isOpen = item.classList.contains('active');
                    
                    // Close all other FAQ items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherIcon = otherItem.querySelector('.fa-chevron-down');
                            if (otherIcon) {
                                otherIcon.style.transform = 'rotate(0deg)';
                            }
                        }
                    });
                    
                    // Toggle current item
                    if (isOpen) {
                        item.classList.remove('active');
                        icon.style.transform = 'rotate(0deg)';
                    } else {
                        item.classList.add('active');
                        icon.style.transform = 'rotate(180deg)';
                    }
                });
            }
        });
    }
    
    console.log('About Us page initialized successfully!');
}); 