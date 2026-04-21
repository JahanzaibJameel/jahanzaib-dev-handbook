/**
 * DevAtelier 2026 - Animations & Interactions
 * Performance-optimized animations with user preference respect
 */

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        intersectionThreshold: 0.1,
        rootMargin: '50px 0px -50px 0px',
        staggerDelay: 100,
        parallaxSpeed: 0.5,
        performanceMode: false,
        maxFPS: 60,
        reducedMotionThreshold: 0.8
    };

    // ===== STATE MANAGEMENT =====
    const state = {
        isInitialized: false,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        performanceMode: false,
        scrollY: 0,
        ticking: false,
        observers: new Map(),
        animations: new Map(),
        rafId: null
    };

    // ===== INITIALIZATION =====
    function init() {
        if (state.isInitialized) return;
        
        checkPerformance();
        setupIntersectionObservers();
        setupScrollAnimations();
        setupParallaxEffects();
        setupMicroInteractions();
        setupPerformanceMonitoring();
        
        state.isInitialized = true;
    }

    // ===== PERFORMANCE DETECTION =====
    function checkPerformance() {
        // Detect low-end devices
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const isSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        state.performanceMode = isSlowConnection || isLowMemory || isSlowCPU;
        
        if (state.performanceMode) {
            document.documentElement.classList.add('performance-mode');
        }
    }

    // ===== INTERSECTION OBSERVERS =====
    function setupIntersectionObservers() {
        // Scroll reveal observer
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealElement(entry.target);
                }
            });
        }, {
            threshold: CONFIG.intersectionThreshold,
            rootMargin: CONFIG.rootMargin
        });
        
        state.observers.set('reveal', revealObserver);
        
        // Parallax observer
        const parallaxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const animationId = element.dataset.animationId;
                
                if (entry.isIntersecting) {
                    startParallax(element, animationId);
                } else {
                    stopParallax(animationId);
                }
            });
        }, {
            threshold: 0,
            rootMargin: '200px 0px 200px 0px'
        });
        
        state.observers.set('parallax', parallaxObserver);
        
        // Stagger animation observer
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStaggerChildren(entry.target);
                }
            });
        }, {
            threshold: CONFIG.intersectionThreshold,
            rootMargin: CONFIG.rootMargin
        });
        
        state.observers.set('stagger', staggerObserver);
        
        // Auto-observe elements
        observeElements();
    }

    function observeElements() {
        // Observe scroll-reveal elements
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            state.observers.get('reveal').observe(el);
        });
        
        // Observe parallax elements
        document.querySelectorAll('.parallax-slow').forEach(el => {
            el.dataset.animationId = `parallax-${Date.now()}-${Math.random()}`;
            state.observers.get('parallax').observe(el);
        });
        
        // Observe stagger elements
        document.querySelectorAll('.stagger-children').forEach(el => {
            state.observers.get('stagger').observe(el);
        });
    }

    // ===== REVEAL ANIMATIONS =====
    function revealElement(element) {
        if (state.reducedMotion || state.performanceMode) {
            // Skip animations, just show the element
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }
        
        element.classList.add('revealed');
        
        // Add animation-specific classes
        const animationType = element.dataset.animation || 'fade-in-up';
        element.classList.add(animationType);
        
        // Trigger reflow for smooth animation
        element.offsetHeight;
        
        // Clean up after animation
        const animationDuration = getAnimationDuration(element);
        setTimeout(() => {
            element.classList.remove('scroll-reveal');
            state.observers.get('reveal').unobserve(element);
        }, animationDuration);
    }

    function getAnimationDuration(element) {
        const style = window.getComputedStyle(element);
        const duration = style.animationDuration || style.transitionDuration;
        return parseFloat(duration) * 1000 || 600;
    }

    // ===== PARALLAX EFFECTS =====
    function startParallax(element, animationId) {
        if (state.reducedMotion || state.performanceMode) return;
        
        const speed = parseFloat(element.dataset.parallaxSpeed) || CONFIG.parallaxSpeed;
        const direction = element.dataset.parallaxDirection || 'vertical';
        
        const animation = {
            element,
            speed,
            direction,
            startY: 0,
            active: true
        };
        
        state.animations.set(animationId, animation);
        
        if (!state.ticking) {
            requestAnimationFrame(updateParallax);
        }
    }

    function stopParallax(animationId) {
        const animation = state.animations.get(animationId);
        if (animation) {
            animation.active = false;
            state.animations.delete(animationId);
        }
    }

    function updateParallax() {
        if (state.animations.size === 0) {
            state.ticking = false;
            return;
        }
        
        state.ticking = true;
        const currentScrollY = window.pageYOffset;
        
        state.animations.forEach((animation, id) => {
            if (!animation.active) return;
            
            const element = animation.element;
            const rect = element.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            const distance = elementCenter - viewportCenter;
            
            let transform = '';
            
            if (animation.direction === 'vertical') {
                const translateY = distance * animation.speed;
                transform = `translateY(${translateY}px)`;
            } else if (animation.direction === 'horizontal') {
                const translateX = distance * animation.speed;
                transform = `translateX(${translateX}px)`;
            } else if (animation.direction === 'scale') {
                const scale = 1 + (distance * animation.speed * 0.001);
                transform = `scale(${Math.max(0.8, Math.min(1.2, scale))})`;
            }
            
            element.style.transform = transform;
        });
        
        state.rafId = requestAnimationFrame(updateParallax);
    }

    // ===== STAGGER ANIMATIONS =====
    function animateStaggerChildren(container) {
        if (state.reducedMotion || state.performanceMode) {
            // Show all children immediately
            container.querySelectorAll('*').forEach(child => {
                child.style.opacity = '1';
                child.style.transform = 'none';
            });
            return;
        }
        
        const children = Array.from(container.children);
        const staggerDelay = parseInt(container.dataset.staggerDelay) || CONFIG.staggerDelay;
        
        children.forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'none';
                child.classList.add('stagger-revealed');
            }, index * staggerDelay);
        });
        
        // Clean up
        setTimeout(() => {
            state.observers.get('stagger').unobserve(container);
        }, children.length * staggerDelay + 500);
    }

    // ===== SCROLL ANIMATIONS =====
    function setupScrollAnimations() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            if (!state.ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    state.ticking = false;
                });
                state.ticking = true;
            }
        }, { passive: true });
    }

    function handleScroll() {
        const currentScrollY = window.pageYOffset;
        const scrollDelta = currentScrollY - lastScrollY;
        
        // Update scroll-based animations
        updateScrollProgress(currentScrollY);
        updateHeaderScroll(currentScrollY, scrollDelta);
        
        lastScrollY = currentScrollY;
    }

    function updateScrollProgress(scrollY) {
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollHeight > 0 ? (scrollY / scrollHeight) : 0;
            progressBar.style.transform = `scaleX(${progress})`;
        }
    }

    function updateHeaderScroll(scrollY, scrollDelta) {
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Add scrolled class
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (Math.abs(scrollDelta) > 5) {
            if (scrollDelta > 0 && scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
    }

    // ===== MICRO-INTERACTIONS =====
    function setupMicroInteractions() {
        // Hover effects
        setupHoverEffects();
        
        // Focus effects
        setupFocusEffects();
        
        // Loading states
        setupLoadingStates();
        
        // Click feedback
        setupClickFeedback();
    }

    function setupHoverEffects() {
        // Add hover classes with performance considerations
        document.addEventListener('mouseover', (e) => {
            const element = e.target.closest('.hover-lift, .hover-scale, .hover-glow');
            if (element && !state.reducedMotion) {
                element.classList.add('hovering');
            }
        }, { passive: true });
        
        document.addEventListener('mouseout', (e) => {
            const element = e.target.closest('.hover-lift, .hover-scale, .hover-glow');
            if (element) {
                element.classList.remove('hovering');
            }
        }, { passive: true });
    }

    function setupFocusEffects() {
        document.addEventListener('focusin', (e) => {
            const element = e.target.closest('.focus-ring');
            if (element) {
                element.classList.add('focused');
            }
        });
        
        document.addEventListener('focusout', (e) => {
            const element = e.target.closest('.focus-ring');
            if (element) {
                element.classList.remove('focused');
            }
        });
    }

    function setupLoadingStates() {
        // Auto-add loading skeleton to elements with data-loading attribute
        document.querySelectorAll('[data-loading]').forEach(element => {
            const loadingType = element.dataset.loading;
            
            if (loadingType === 'skeleton') {
                element.classList.add('loading-skeleton');
            }
        });
    }

    function setupClickFeedback() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn, .search-trigger, .code-copy-btn');
            if (button && !button.disabled) {
                // Add ripple effect
                createRipple(button, e);
            }
        });
    }

    function createRipple(element, event) {
        if (state.reducedMotion || state.performanceMode) return;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Add ripple animation if not exists
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // ===== PERFORMANCE MONITORING =====
    function setupPerformanceMonitoring() {
        // Monitor frame rate
        let lastTime = performance.now();
        let frames = 0;
        
        function measureFPS() {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                
                if (fps < CONFIG.maxFPS * CONFIG.reducedMotionThreshold) {
                    enablePerformanceMode();
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            if (!state.performanceMode) {
                requestAnimationFrame(measureFPS);
            }
        }
        
        if (!state.reducedMotion) {
            requestAnimationFrame(measureFPS);
        }
    }

    function enablePerformanceMode() {
        if (state.performanceMode) return;
        
        state.performanceMode = true;
        document.documentElement.classList.add('performance-mode');
        
        // Disable animations
        document.querySelectorAll('.scroll-reveal, .parallax-slow, .stagger-children').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        
        // Stop parallax animations
        state.animations.forEach((animation, id) => {
            stopParallax(id);
        });
        
        // Cancel RAF
        if (state.rafId) {
            cancelAnimationFrame(state.rafId);
            state.rafId = null;
        }
    }

    // ===== UTILITY FUNCTIONS =====
    function debounce(func, wait) {
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

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== PUBLIC API =====
    window.DevAtelierAnimations = {
        init,
        revealElement,
        startParallax,
        stopParallax,
        enablePerformanceMode,
        state
    };

    // ===== AUTO-INITIALIZATION =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ===== CLEANUP =====
    window.addEventListener('beforeunload', () => {
        // Clean up observers
        state.observers.forEach(observer => {
            observer.disconnect();
        });
        
        // Cancel RAF
        if (state.rafId) {
            cancelAnimationFrame(state.rafId);
        }
    });

})();
