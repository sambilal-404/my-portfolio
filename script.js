/**
 * Portfolio JavaScript - Enhanced Functionality
 * Professional cybersecurity-themed portfolio with advanced interactions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initParticles();
    initCustomCursor();
    initNavigation();
    initTypingAnimation();
    initCounterAnimation();
    initSkillBars();
    initProjectFilter();
    initScrollAnimations();
    initBackToTop();
    initFormValidation();
    updateCopyrightYear();
});

/* ==========================================================================
   Particle Background Animation
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    // Resize canvas to full window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 245, 195, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    function createParticles() {
        const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Draw connections between nearby particles
    function drawConnections() {
        const maxDistance = 150;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 245, 195, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    // Initialize
    resizeCanvas();
    createParticles();
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    // Pause animation when tab is not visible (performance optimization)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/* ==========================================================================
   Custom Cursor
   ========================================================================== */
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    // Only enable on desktop
    if (window.innerWidth < 1024) return;

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot follows cursor immediately
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth outline follow
    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card, .cert-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hover');
        });
    });
}

/* ==========================================================================
   Navigation
   ========================================================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], .hero-section');

    // Create overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    // Toggle mobile menu
    function toggleMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    navToggle?.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    toggleMenu();
                }
                
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Navbar scroll effect
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Active section highlighting
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id || 'home';
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
}

/* ==========================================================================
   Typing Animation
   ========================================================================== */
function initTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const roles = [
        'Cybersecurity Student',
        'Ethical Hacker',
        'Network Engineer',
        'Mobile Security Analyst',
        'Python Developer',
        'CTF Player'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseDuration = 2000;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isPaused) {
            setTimeout(type, pauseDuration);
            isPaused = false;
            isDeleting = true;
            return;
        }

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
            
            setTimeout(type, deleteSpeed);
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentRole.length) {
                isPaused = true;
            }
            
            setTimeout(type, typeSpeed);
        }
    }

    // Start typing after a short delay
    setTimeout(type, 1000);
}

/* ==========================================================================
   Counter Animation
   ========================================================================== */
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length === 0) return;

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    };

    // Use Intersection Observer to trigger animation when visible
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));
}

/* ==========================================================================
   Skill Bars Animation
   ========================================================================== */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length === 0) return;

    const animateSkillBar = (element) => {
        const progress = element.getAttribute('data-progress');
        element.style.width = `${progress}%`;
    };

    // Observe skill cards for animation trigger
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.skill-progress');
                bars.forEach((bar, index) => {
                    setTimeout(() => animateSkillBar(bar), index * 100);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-card').forEach(card => {
        skillObserver.observe(card);
    });
}

/* ==========================================================================
   Project Filter
   ========================================================================== */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   Scroll Animations
   ========================================================================== */
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));

    // Also make hero section visible immediately
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.classList.add('visible');
    }
}

/* ==========================================================================
   Back to Top Button
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   Form Validation
   ========================================================================== */
function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Add loading state to button
    const submitBtn = form.querySelector('.btn-submit');
    const originalBtnText = submitBtn?.innerHTML;

    form.addEventListener('submit', async (e) => {
        // Don't prevent default - let Formspree handle it
        // But add visual feedback
        
        if (submitBtn) {
            submitBtn.innerHTML = '<span>Sending...</span><i class="bx bx-loader-alt bx-spin"></i>';
            submitBtn.disabled = true;
        }

        // Re-enable after submission (handled by page reload from Formspree)
        // This is just a fallback
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        }, 5000);
    });

    // Real-time validation feedback
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                validateField(input);
            }
        });
    });

    function validateField(field) {
        const wrapper = field.closest('.input-wrapper');
        
        if (!field.checkValidity()) {
            field.classList.add('invalid');
            wrapper?.classList.add('invalid');
        } else {
            field.classList.remove('invalid');
            wrapper?.classList.remove('invalid');
        }
    }
}

/* ==========================================================================
   Update Copyright Year
   ========================================================================== */
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/* ==========================================================================
   Utility Functions
   ========================================================================== */

// Debounce function for performance
function debounce(func, wait = 10) {
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

// Throttle function for scroll events
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    // Add smooth scroll polyfill if needed
    console.log('Smooth scroll not natively supported');
}
