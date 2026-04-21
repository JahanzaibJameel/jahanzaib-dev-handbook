/**
 * DevAtelier 2026 - Core JavaScript
 * Theme locking, accessibility, and core navigation functionality
 */

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        themeStorageKey: 'devatelier-theme',
        searchStorageKey: 'devatelier-search-history',
        animationDuration: 300,
        debounceDelay: 300,
        maxSearchResults: 50,
        scrollThreshold: 100,
        keyboardShortcuts: {
            search: ['/', 'ctrl+K', 'meta+K'],
            escape: 'Escape',
            next: 'ArrowDown',
            previous: 'ArrowUp',
            select: 'Enter',
            close: 'Escape'
        }
    };

    // ===== STATE MANAGEMENT =====
    const state = {
        theme: 'light',
        searchActive: false,
        searchResults: [],
        selectedSearchIndex: -1,
        scrollY: 0,
        isMobile: window.innerWidth < 768,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highContrast: window.matchMedia('(prefers-contrast: high)').matches
    };

    // ===== INITIALIZATION =====
    function init() {
        initializeTheme();
        initializeAccessibility();
        initializeNavigation();
        initializeKeyboardShortcuts();
        initializeScrollEffects();
        initializeSearch();
        initializeViewTransitions();
        
        // Set up event listeners
        setupEventListeners();
        
        // Announce initialization to screen readers
        announceToScreenReader('DevAtelier 2026 theme loaded successfully');
    }

    // ===== THEME MANAGEMENT =====
    function initializeTheme() {
        // Load saved theme or detect system preference
        const savedTheme = localStorage.getItem(CONFIG.themeStorageKey);
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        state.theme = savedTheme || systemTheme;
        applyTheme(state.theme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(CONFIG.themeStorageKey)) {
                state.theme = e.matches ? 'dark' : 'light';
                applyTheme(state.theme);
            }
        });
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        state.theme = theme;
        
        // Update meta theme-color for mobile browsers
        updateMetaThemeColor();
        
        // Save theme preference
        localStorage.setItem(CONFIG.themeStorageKey, theme);
        
        // Announce theme change to screen readers
        announceToScreenReader(`Theme changed to ${theme} mode`);
    }

    function updateMetaThemeColor() {
        const themeColor = state.theme === 'dark' ? 
            'oklch(12% 0.01 240)' : 'oklch(98% 0.005 250)';
        
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = themeColor;
    }

    // ===== ACCESSIBILITY =====
    function initializeAccessibility() {
        // Skip to main content link
        createSkipLink();
        
        // Focus management
        setupFocusManagement();
        
        // ARIA live regions
        createLiveRegions();
        
        // Keyboard navigation
        enhanceKeyboardNavigation();
    }

    function createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--accent-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            font-weight: 500;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    function setupFocusManagement() {
        // Track focus for better keyboard navigation
        let lastFocusedElement = null;
        
        document.addEventListener('focusin', (e) => {
            lastFocusedElement = e.target;
        });
        
        // Return focus after modal closes
        window.returnFocus = function() {
            if (lastFocusedElement && lastFocusedElement.focus) {
                lastFocusedElement.focus();
            }
        };
    }

    function createLiveRegions() {
        // Create live region for screen reader announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'screen-reader-announcements';
        document.body.appendChild(liveRegion);
    }

    function announceToScreenReader(message) {
        const liveRegion = document.getElementById('screen-reader-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    function enhanceKeyboardNavigation() {
        // Add focus indicators for better keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            *:focus-visible {
                outline: 2px solid var(--accent-primary) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== NAVIGATION =====
    function initializeNavigation() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleAnchorClick);
        });
        
        // Active navigation state
        updateActiveNavigation();
        
        // Mobile menu toggle (if needed)
        setupMobileMenu();
    }

    function handleAnchorClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            
            // Smooth scroll to target
            target.scrollIntoView({
                behavior: state.reducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
            
            // Update focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus();
        }
    }

    function updateActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.sidebar-nav a, .header-nav a');
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (linkPath === currentPath) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    function setupMobileMenu() {
        // Implementation for mobile menu if needed
        // This would handle hamburger menu, etc.
    }

    // ===== KEYBOARD SHORTCUTS =====
    function initializeKeyboardShortcuts() {
        document.addEventListener('keydown', handleKeyboardShortcut);
    }

    function handleKeyboardShortcut(e) {
        const key = getKeyCombo(e);
        
        // Search shortcuts
        if (CONFIG.keyboardShortcuts.search.includes(key)) {
            e.preventDefault();
            toggleSearch();
            return;
        }
        
        // Escape key
        if (key === CONFIG.keyboardShortcuts.escape) {
            if (state.searchActive) {
                closeSearch();
            }
            return;
        }
        
        // Search navigation
        if (state.searchActive) {
            if (key === CONFIG.keyboardShortcuts.next) {
                e.preventDefault();
                navigateSearchResults(1);
            } else if (key === CONFIG.keyboardShortcuts.previous) {
                e.preventDefault();
                navigateSearchResults(-1);
            } else if (key === CONFIG.keyboardShortcuts.select) {
                e.preventDefault();
                selectSearchResult();
            }
        }
    }

    function getKeyCombo(e) {
        const parts = [];
        if (e.ctrlKey) parts.push('ctrl');
        if (e.metaKey) parts.push('meta');
        if (e.shiftKey) parts.push('shift');
        if (e.altKey) parts.push('alt');
        parts.push(e.key.toLowerCase());
        return parts.join('+');
    }

    // ===== SCROLL EFFECTS =====
    function initializeScrollEffects() {
        // Scroll progress indicator
        createScrollProgress();
        
        // Header scroll effects
        setupHeaderScroll();
        
        // Scroll-triggered animations
        setupScrollAnimations();
    }

    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-label', 'Reading progress');
        document.body.appendChild(progressBar);
        
        updateScrollProgress();
    }

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
        
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.transform = `scaleX(${progress})`;
        }
    }

    function setupHeaderScroll() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const header = document.querySelector('.header');
            
            if (header) {
                if (currentScrollY > CONFIG.scrollThreshold) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
            lastScrollY = currentScrollY;
            updateScrollProgress();
        });
    }

    function setupScrollAnimations() {
        if (state.reducedMotion) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px'
        });
        
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== SEARCH FUNCTIONALITY =====
    function initializeSearch() {
        createSearchOverlay();
        setupSearchInput();
    }

    function createSearchOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'search-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Search');
        overlay.innerHTML = `
            <div class="search-container">
                <div class="search-input-wrapper">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input 
                        type="search" 
                        class="search-input" 
                        placeholder="Search documentation..." 
                        autocomplete="off"
                        role="searchbox"
                        aria-label="Search documentation"
                    >
                </div>
                <div class="search-results" role="listbox"></div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Close on background click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeSearch();
            }
        });
    }

    function setupSearchInput() {
        const input = document.querySelector('.search-input');
        if (!input) return;
        
        let debounceTimer;
        
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                performSearch(e.target.value);
            }, CONFIG.debounceDelay);
        });
    }

    function toggleSearch() {
        if (state.searchActive) {
            closeSearch();
        } else {
            openSearch();
        }
    }

    function openSearch() {
        const overlay = document.querySelector('.search-overlay');
        const input = document.querySelector('.search-input');
        
        if (overlay && input) {
            overlay.classList.add('active');
            input.value = '';
            input.focus();
            state.searchActive = true;
            state.selectedSearchIndex = -1;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSearch() {
        const overlay = document.querySelector('.search-overlay');
        
        if (overlay) {
            overlay.classList.remove('active');
            state.searchActive = false;
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Return focus to trigger
            const trigger = document.querySelector('.search-trigger');
            if (trigger) {
                trigger.focus();
            }
        }
    }

    function performSearch(query) {
        if (!query.trim()) {
            clearSearchResults();
            return;
        }
        
        // This would integrate with mdBook's search functionality
        // For now, we'll simulate search results
        const results = simulateSearch(query);
        displaySearchResults(results);
    }

    function simulateSearch(query) {
        // Placeholder search implementation
        // In a real implementation, this would use mdBook's search index
        return [
            { title: 'Getting Started', url: '#getting-started', excerpt: 'Learn how to get started with the development handbook...' },
            { title: 'API Reference', url: '#api-reference', excerpt: 'Complete API reference for all available functions...' },
            { title: 'Examples', url: '#examples', excerpt: 'Practical examples and code samples...' }
        ].filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(query.toLowerCase())
        );
    }

    function displaySearchResults(results) {
        const resultsContainer = document.querySelector('.search-results');
        if (!resultsContainer) return;
        
        state.searchResults = results;
        state.selectedSearchIndex = -1;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <p>No results found for your search.</p>
                </div>
            `;
            return;
        }
        
        resultsContainer.innerHTML = results.map((result, index) => `
            <div class="search-result-item" role="option" data-index="${index}">
                <div class="search-result-title">${highlightMatch(result.title)}</div>
                <div class="search-result-excerpt">${highlightMatch(result.excerpt)}</div>
            </div>
        `).join('');
        
        // Add click handlers
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                navigateToResult(index);
            });
        });
    }

    function highlightMatch(text) {
        const query = document.querySelector('.search-input').value.trim();
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function clearSearchResults() {
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
        state.searchResults = [];
        state.selectedSearchIndex = -1;
    }

    function navigateSearchResults(direction) {
        const items = document.querySelectorAll('.search-result-item');
        if (items.length === 0) return;
        
        // Remove previous selection
        if (state.selectedSearchIndex >= 0) {
            items[state.selectedSearchIndex].classList.remove('selected');
        }
        
        // Calculate new index
        state.selectedSearchIndex += direction;
        if (state.selectedSearchIndex < 0) {
            state.selectedSearchIndex = items.length - 1;
        } else if (state.selectedSearchIndex >= items.length) {
            state.selectedSearchIndex = 0;
        }
        
        // Apply new selection
        items[state.selectedSearchIndex].classList.add('selected');
        items[state.selectedSearchIndex].scrollIntoView({ block: 'nearest' });
    }

    function selectSearchResult() {
        if (state.selectedSearchIndex >= 0 && state.searchResults[state.selectedSearchIndex]) {
            navigateToResult(state.selectedSearchIndex);
        }
    }

    function navigateToResult(index) {
        const result = state.searchResults[index];
        if (result && result.url) {
            closeSearch();
            window.location.href = result.url;
        }
    }

    // ===== VIEW TRANSITIONS =====
    function initializeViewTransitions() {
        // Check for View Transitions API support
        if (!('viewTransition' in document)) {
            // Fallback for browsers without View Transitions
            setupFallbackTransitions();
        }
    }

    function setupFallbackTransitions() {
        // Simple fade transitions for older browsers
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hostname === window.location.hostname) {
                e.preventDefault();
                
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = link.href;
                }, 200);
            }
        });
    }

    // ===== EVENT LISTENERS =====
    function setupEventListeners() {
        // Window resize
        window.addEventListener('resize', debounce(handleResize, 250));
        
        // Page visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Theme toggle (if implemented)
        document.addEventListener('theme-change', handleThemeChange);
    }

    function handleResize() {
        const wasMobile = state.isMobile;
        state.isMobile = window.innerWidth < 768;
        
        if (wasMobile !== state.isMobile) {
            // Handle responsive layout changes
            updateActiveNavigation();
        }
    }

    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            updateActiveNavigation();
        }
    }

    function handleThemeChange(e) {
        if (e.detail && e.detail.theme) {
            applyTheme(e.detail.theme);
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

    // ===== PUBLIC API =====
    window.DevAtelier = {
        theme: {
            get: () => state.theme,
            set: applyTheme,
            toggle: () => applyTheme(state.theme === 'light' ? 'dark' : 'light')
        },
        search: {
            open: openSearch,
            close: closeSearch,
            toggle: toggleSearch
        },
        announce: announceToScreenReader,
        state: state
    };

    // ===== INITIALIZATION =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
