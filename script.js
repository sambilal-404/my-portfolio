// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling for Navbar Links ---
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Prevent the default anchor link behavior (instant jump)
            e.preventDefault();

            // Instantly update active class on click for better UX
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');


            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            // Check if the target element exists before trying to scroll
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Highlight Active Section in Navbar as User Scrolls ---
    // Select all sections that have an ID, including the header
    const sections = document.querySelectorAll('header[id], section[id]');
    
    // Create an Intersection Observer to watch for when sections enter the viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If a section is intersecting (visible) in the viewport
            if (entry.isIntersecting) {
                const id = entry.target.id;

                // Remove the 'active' class from all navigation links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Add the 'active' class to the link that corresponds to the visible section
                const activeLink = document.querySelector(`nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active'); 
                }
            }
        });
    }, {
        // This defines a "box" at the top of the viewport. A section is "intersecting"
        // only when it enters this box. The -80px top margin accounts for your fixed navbar.
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0 // Trigger as soon as any part of the section enters the rootMargin area
    });

    // Tell the observer to watch each section
    sections.forEach(section => observer.observe(section));

    // --- Simple Alert on Form Submission ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the default form submission (page reload)
            alert('Thank you for your message! This is a demo and the form is not connected to a backend.');
            contactForm.reset(); // Reset the form fields after submission
        });
    }

    // --- Typing Animation for Hero Section ---
    const taglineElement = document.querySelector('#home h2');
    const roles = [
        "Cybersecurity & Network Engineering Student",
        "Ethical Hacker",
        "Future Security Engineer"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenRoles = 2000;

    function typeAnimation() {
        const currentRole = roles[roleIndex];
        const currentText = isDeleting ?
            currentRole.substring(0, charIndex - 1) :
            currentRole.substring(0, charIndex + 1);

        taglineElement.innerHTML = `${currentText}<span class="cursor">&nbsp;</span>`;

        if (!isDeleting && charIndex === currentRole.length) {
            // Finished typing the role
            isDeleting = true;
            setTimeout(typeAnimation, delayBetweenRoles);
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting the role
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeAnimation, typingSpeed);
        } else {
            // Continue typing or deleting
            charIndex += isDeleting ? -1 : 1;
            setTimeout(typeAnimation, isDeleting ? deletingSpeed : typingSpeed);
        }
    }

    // Start the typing animation
    if (taglineElement) {
        typeAnimation();
    }

    // --- Fade-in Effect for Sections on Scroll ---
    const fadeElements = document.querySelectorAll('section');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                fadeObserver.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of the section is visible

    fadeElements.forEach(element => fadeObserver.observe(element));
});
