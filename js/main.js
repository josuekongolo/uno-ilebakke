/**
 * UNO ILEBAKKE - Main JavaScript
 * Rørlegger i Skiptvet, Indre Østfold
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav__toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.querySelector('.form-success');
    const formError = document.querySelector('.form-error');

    // ============================================
    // Mobile Navigation
    // ============================================
    function initMobileNav() {
        if (!navToggle || !nav) return;

        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') &&
                !nav.contains(e.target) &&
                !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                navToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // Header Scroll Effect
    // ============================================
    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 10;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ============================================
    // Active Navigation Link
    // ============================================
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === pageName ||
                (pageName === '' && href === 'index.html') ||
                (pageName === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ============================================
    // Contact Form Handling
    // ============================================
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                location: formData.get('location') || '',
                inquiryType: formData.get('inquiryType'),
                message: formData.get('message'),
                wantCallback: formData.get('callback') === 'on'
            };

            // Validate required fields
            if (!data.name || !data.phone || !data.email || !data.message) {
                showFormError('Vennligst fyll ut alle påkrevde felt.');
                return;
            }

            // Validate email
            if (!isValidEmail(data.email)) {
                showFormError('Vennligst oppgi en gyldig e-postadresse.');
                return;
            }

            // Validate phone (Norwegian format)
            if (!isValidPhone(data.phone)) {
                showFormError('Vennligst oppgi et gyldig telefonnummer.');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sender...</span>';

            try {
                // Simulate form submission (replace with actual API call)
                // In production, you would send this to your backend or Resend API
                await simulateFormSubmission(data);

                // Show success message
                showFormSuccess();

                // Reset form
                contactForm.reset();

            } catch (error) {
                showFormError('Noe gikk galt. Vennligst prøv igjen eller ring oss direkte.');
                console.error('Form submission error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                // Remove error state on input
                this.classList.remove('error');
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        const name = field.name;

        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            return false;
        }

        if (name === 'email' && value && !isValidEmail(value)) {
            field.classList.add('error');
            return false;
        }

        if (name === 'phone' && value && !isValidPhone(value)) {
            field.classList.add('error');
            return false;
        }

        field.classList.remove('error');
        return true;
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function isValidPhone(phone) {
        // Accept Norwegian phone numbers (8 digits, with or without country code)
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        const regex = /^(\+47)?[2-9]\d{7}$/;
        return regex.test(cleaned);
    }

    function showFormError(message) {
        if (formError) {
            formError.textContent = message;
            formError.classList.add('active');
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Hide after 5 seconds
            setTimeout(() => {
                formError.classList.remove('active');
            }, 5000);
        }
    }

    function showFormSuccess() {
        if (formSuccess && contactForm) {
            contactForm.style.display = 'none';
            formSuccess.classList.add('active');
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    async function simulateFormSubmission(data) {
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Log form data (for development)
                console.log('Form submitted:', data);

                // In production, replace this with actual API call:
                /*
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response.json();
                */

                resolve({ success: true });
            }, 1500);
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // Clickable Phone Numbers
    // ============================================
    function initClickablePhone() {
        // Make phone numbers clickable on mobile
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

        phoneLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Track phone clicks (for analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'contact',
                        event_label: 'phone_call'
                    });
                }
            });
        });
    }

    // ============================================
    // Lazy Loading Images
    // ============================================
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');

            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ============================================
    // Animate on Scroll
    // ============================================
    function initScrollAnimation() {
        if ('IntersectionObserver' in window) {
            const animatedElements = document.querySelectorAll('.animate-on-scroll');

            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    // ============================================
    // Current Year in Footer
    // ============================================
    function updateFooterYear() {
        const yearElements = document.querySelectorAll('.current-year');
        const currentYear = new Date().getFullYear();

        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }

    // ============================================
    // Accessibility Enhancements
    // ============================================
    function initAccessibility() {
        // Add keyboard navigation for interactive elements
        const interactiveElements = document.querySelectorAll('.service-card, .coverage__item');

        interactiveElements.forEach(el => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }

            el.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    const link = el.querySelector('a');
                    if (link) {
                        link.click();
                    }
                }
            });
        });

        // Focus management for modal-like components
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

        // Trap focus in mobile nav when open
        if (nav) {
            nav.addEventListener('keydown', function(e) {
                if (e.key === 'Tab' && nav.classList.contains('active')) {
                    const focusableContent = nav.querySelectorAll(focusableElements);
                    const firstFocusable = focusableContent[0];
                    const lastFocusable = focusableContent[focusableContent.length - 1];

                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        }
    }

    // ============================================
    // Service Worker Registration (PWA Ready)
    // ============================================
    function initServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                // Uncomment when service worker is ready:
                // navigator.serviceWorker.register('/sw.js')
                //     .then(registration => {
                //         console.log('ServiceWorker registered:', registration);
                //     })
                //     .catch(error => {
                //         console.log('ServiceWorker registration failed:', error);
                //     });
            });
        }
    }

    // ============================================
    // Google Maps Embed (Lazy Load)
    // ============================================
    function initMapLazyLoad() {
        const mapContainer = document.querySelector('.map-container');
        if (!mapContainer) return;

        if ('IntersectionObserver' in window) {
            const mapObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadMap(mapContainer);
                        mapObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '100px'
            });

            mapObserver.observe(mapContainer);
        } else {
            loadMap(mapContainer);
        }
    }

    function loadMap(container) {
        const iframe = document.createElement('iframe');
        iframe.src = container.dataset.mapSrc || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d32464.66285877693!2d11.26!3d59.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464167d0c1c7a9f7%3A0x0!2sSkiptvet!5e0!3m2!1sno!2sno';
        iframe.width = '100%';
        iframe.height = '300';
        iframe.style.border = '0';
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        iframe.setAttribute('title', 'Kart over Skiptvet');

        container.innerHTML = '';
        container.appendChild(iframe);
    }

    // ============================================
    // Initialize Everything
    // ============================================
    function init() {
        initMobileNav();
        initHeaderScroll();
        setActiveNavLink();
        initContactForm();
        initSmoothScroll();
        initClickablePhone();
        initLazyLoading();
        initScrollAnimation();
        updateFooterYear();
        initAccessibility();
        initServiceWorker();
        initMapLazyLoad();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
