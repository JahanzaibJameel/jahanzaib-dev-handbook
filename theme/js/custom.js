/**
 * DevAtelier 2026 - Enhanced JavaScript with Asset Path Fixing
 * Complete 2026 modern web experience with glassmorphism, animations, and error handling
 */

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        themeStorageKey: 'devatelier-theme-2026',
        searchStorageKey: 'devatelier-search-history',
        animationDuration: 300,
        debounceDelay: 300,
        maxSearchResults: 50,
        scrollThreshold: 100,
        keyboardShortcuts: {
            search: ['/', 'ctrl+K', 'meta+K'],
            theme: ['ctrl+Shift+T', 'meta+Shift+T'],
            escape: 'Escape',
            next: 'ArrowDown',
            previous: 'ArrowUp',
            select: 'Enter',
            close: 'Escape'
        },
        assetPaths: {
            // Common problematic paths that need fixing
            fixes: [
                { pattern: /\/\//g, replacement: '/' }, // Double slashes
                { pattern: /react-native\/react-native\//g, replacement: 'react-native/' }, // Duplicate segments
                { pattern: /\.\.\//g, replacement: '' }, // Relative paths that break
                { pattern: /^\/\//, replacement: '/' } // Protocol-relative that should be root-relative
            ]
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
        highContrast: window.matchMedia('(prefers-contrast: high)').matches,
        assetPathsFixed: false,
        scrollProgress: 0,
        lastScrollTime: 0
    };

    // ===== INITIALIZATION =====
    function init() {
        console.log('DevAtelier 2026 - Initializing enhanced experience...');
        
        // Fix asset paths first
        fixAssetPaths();
        
        // Initialize core features
        initializeTheme();
        initializeAccessibility();
        initializeNavigation();
        initializeKeyboardShortcuts();
        initializeScrollEffects();
        initializeSearch();
        initializeAnimations();
        initializeCopyButtons();
        initializeThemeToggle();
        initializeProgressBar();
        
        // Set up event listeners
        setupEventListeners();
        
        // Announce initialization to screen readers
        announceToScreenReader('DevAtelier 2026 enhanced theme loaded successfully');
        
        console.log('DevAtelier 2026 - Initialization complete');
    }

    // ===== ASSET PATH FIXING =====
    function fixAssetPaths() {
        if (state.assetPathsFixed) return;
        
        console.log('DevAtelier 2026: Fixing asset paths...');
        
        // Fix all asset references with comprehensive path resolution
        const assetSelectors = [
            'link[href]',
            'script[src]',
            'img[src]',
            'source[src]',
            'video[src]',
            'audio[src]',
            'iframe[src]',
            'style[data-href]',
            'use[href]', // SVG use elements
            'object[data]',
            'embed[src]'
        ];
        
        let fixedCount = 0;
        const issues = [];
        
        assetSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(element => {
                    const attributes = element.hasAttribute('href') ? ['href'] : 
                                    element.hasAttribute('src') ? ['src'] :
                                    element.hasAttribute('data-href') ? ['data-href'] :
                                    element.hasAttribute('data') ? ['data'] : [];
                    
                    attributes.forEach(attribute => {
                        let originalPath = element.getAttribute(attribute);
                        if (!originalPath) return;
                        
                        // Skip external URLs and data URIs
                        if (originalPath.startsWith('http') || 
                            originalPath.startsWith('//') || 
                            originalPath.startsWith('data:')) {
                            return;
                        }
                        
                        const fixedPath = fixSingleAssetPath(originalPath);
                        if (fixedPath !== originalPath) {
                            element.setAttribute(attribute, fixedPath);
                            fixedCount++;
                            issues.push({
                                type: 'asset_path',
                                element: element.tagName.toLowerCase(),
                                attribute: attribute,
                                original: originalPath,
                                fixed: fixedPath
                            });
                            console.log(`Fixed ${element.tagName.toLowerCase()} ${attribute}: ${originalPath} -> ${fixedPath}`);
                        }
                    });
                });
            } catch (error) {
                console.warn(`Error processing selector ${selector}:`, error);
            }
        });
        
        // Fix CSS url() references in all style elements and external stylesheets
        try {
            document.querySelectorAll('style').forEach(styleElement => {
                const cssText = styleElement.textContent;
                const fixedCss = fixCssUrls(cssText);
                if (fixedCss !== cssText) {
                    styleElement.textContent = fixedCss;
                    fixedCount++;
                }
            });
        } catch (error) {
            console.warn('Error fixing inline styles:', error);
        }
        
        // Fix preload links specifically
        try {
            document.querySelectorAll('link[rel="preload"]').forEach(link => {
                const as = link.getAttribute('as');
                const href = link.getAttribute('href');
                
                if (href && !href.startsWith('http') && !href.startsWith('//')) {
                    const fixedPath = fixSingleAssetPath(href);
                    if (fixedPath !== href) {
                        link.setAttribute('href', fixedPath);
                        fixedCount++;
                        console.log(`Fixed preload link: ${href} -> ${fixedPath}`);
                    }
                }
            });
        } catch (error) {
            console.warn('Error fixing preload links:', error);
        }
        
        // Fix base tag if it exists and is incorrect
        try {
            const baseTag = document.querySelector('base');
            if (baseTag) {
                const currentHref = baseTag.getAttribute('href');
                if (currentHref && currentHref !== '/') {
                    console.log(`Found base tag with href: ${currentHref}`);
                    // Keep base tag as is for now, but log for debugging
                }
            }
        } catch (error) {
            console.warn('Error checking base tag:', error);
        }
        
        // Validate critical assets and provide fallbacks
        validateCriticalAssets();
        
        state.assetPathsFixed = true;
        state.assetPathIssues = issues;
        
        console.log(`DevAtelier 2026: Asset path fixing complete. Fixed ${fixedCount} paths.`);
        
        // Dispatch event for other scripts to listen to
        document.dispatchEvent(new CustomEvent('devatelier:assets-fixed', {
            detail: { fixedCount, issues }
        }));
    }

    function fixSingleAssetPath(path) {
        let fixedPath = path;
        
        // Apply all configured fixes
        CONFIG.assetPaths.fixes.forEach(fix => {
            fixedPath = fixedPath.replace(fix.pattern, fix.replacement);
        });
        
        // Additional comprehensive fixes for common issues
        const additionalFixes = [
            // Remove duplicate path segments (most critical issue)
            { pattern: /\/([^\/]+)\/\1\//g, replacement: '/$1/' },
            { pattern: /\/([^\/]+)\/\1\/\1\//g, replacement: '/$1/' },
            { pattern: /\/react-native\/react-native\//g, replacement: '/react-native/' },
            { pattern: /\/ai\/ai\//g, replacement: '/ai/' },
            { pattern: /\/devops\/devops\//g, replacement: '/devops/' },
            { pattern: /\/fullstack\/fullstack\//g, replacement: '/fullstack/' },
            { pattern: /\/career\/career\//g, replacement: '/career/' },
            { pattern: /\/testing\/testing\//g, replacement: '/testing/' },
            
            // Fix multiple consecutive slashes
            { pattern: /\/\/+/g, replacement: '/' },
            
            // Remove leading ../ sequences
            { pattern: /^\.\.\//g, replacement: '' },
            { pattern: /^\.\.\/\.\.\//g, replacement: '' },
            
            // Fix theme path issues
            { pattern: /^theme\//, replacement: 'theme/' },
            { pattern: /^\.\/theme\//, replacement: 'theme/' },
            
            // Remove leading dot for relative paths that should be absolute from root
            { pattern: /^\.\//, replacement: '' }
        ];
        
        additionalFixes.forEach(fix => {
            fixedPath = fixedPath.replace(fix.pattern, fix.replacement);
        });
        
        // Ensure path starts correctly based on context
        if (fixedPath.startsWith('theme/') || fixedPath.startsWith('fonts/')) {
            // These should be relative to root
            if (!fixedPath.startsWith('/')) {
                fixedPath = '/' + fixedPath;
            }
        } else if (!fixedPath.startsWith('/') && !fixedPath.startsWith('#')) {
            // Other assets should be relative to root
            fixedPath = '/' + fixedPath;
        }
        
        // Remove trailing slashes except for root
        if (fixedPath !== '/' && fixedPath.endsWith('/')) {
            fixedPath = fixedPath.slice(0, -1);
        }
        
        return fixedPath;
    }

    function fixCssUrls(cssText) {
        return cssText.replace(/url\(['"]?([^'")]+)['"]?\)/g, (match, url) => {
            // Skip data URIs and external URLs
            if (url.startsWith('data:') || url.startsWith('http') || url.startsWith('//')) {
                return match;
            }
            
            const fixedUrl = fixSingleAssetPath(url);
            return `url('${fixedUrl}')`;
        });
    }

    function validateCriticalAssets() {
        const criticalAssets = [
            { path: '/theme/fonts/inter-variable.woff2', type: 'font', name: 'Inter Variable' },
            { path: '/theme/fonts/jetbrains-mono-variable.woff2', type: 'font', name: 'JetBrains Mono Variable' },
            { path: '/favicon.ico', type: 'icon', name: 'Favicon' },
            { path: '/icon.svg', type: 'icon', name: 'SVG Icon' },
            { path: '/site.webmanifest', type: 'manifest', name: 'Web Manifest' }
        ];
        
        criticalAssets.forEach(asset => {
            fetch(asset.path, { method: 'HEAD' })
                .then(response => {
                    if (!response.ok) {
                        console.warn(`Critical asset not found: ${asset.name} at ${asset.path}`);
                        // Try to create fallback or suggest solution
                        handleMissingAsset(asset);
                    } else {
                        console.log(`Critical asset found: ${asset.name}`);
                    }
                })
                .catch(error => {
                    console.warn(`Error checking critical asset ${asset.name}:`, error);
                    handleMissingAsset(asset);
                });
        });
    }

    function handleMissingAsset(asset) {
        switch (asset.type) {
            case 'font':
                console.warn(`Font ${asset.name} is missing. Using system fonts as fallback.`);
                // Add fallback font class to body
                document.body.classList.add('fonts-missing');
                break;
            case 'icon':
                console.warn(`Icon ${asset.name} is missing. Consider generating icons using generate-icons.html`);
                break;
            case 'manifest':
                console.warn(`Web manifest is missing. PWA features will be limited.`);
                break;
        }
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
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('theme-change', { 
            detail: { theme } 
        }));
    }

    function updateMetaThemeColor() {
        const themeColor = state.theme === 'dark' ? 
            'oklch(12% 0.01 240)' : 'oklch(99% 0.003 250)';
        
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = themeColor;
    }

    function initializeThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        themeToggle.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `;
        
        themeToggle.addEventListener('click', () => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            applyTheme(state.theme);
        });
        
        document.body.appendChild(themeToggle);
        
        // Update icon based on theme
        updateThemeToggleIcon();
        
        // Listen for theme changes
        document.addEventListener('theme-change', updateThemeToggleIcon);
    }

    function updateThemeToggleIcon() {
        const themeToggle = document.querySelector('.theme-toggle svg');
        if (!themeToggle) return;
        
        if (state.theme === 'dark') {
            themeToggle.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            `;
        } else {
            themeToggle.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
        }
    }

    // ===== ACCESSIBILITY =====
    function initializeAccessibility() {
        createSkipLink();
        setupFocusManagement();
        createLiveRegions();
        enhanceKeyboardNavigation();
    }

    function createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--accent-primary);
            color: white;
            padding: 8px 12px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            font-weight: 500;
            transition: top 0.2s;
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
        let lastFocusedElement = null;
        
        document.addEventListener('focusin', (e) => {
            lastFocusedElement = e.target;
        });
        
        window.returnFocus = function() {
            if (lastFocusedElement && lastFocusedElement.focus) {
                lastFocusedElement.focus();
            }
        };
    }

    function createLiveRegions() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'screen-reader-announcements';
        liveRegion.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        document.body.appendChild(liveRegion);
    }

    function announceToScreenReader(message) {
        const liveRegion = document.getElementById('screen-reader-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    function enhanceKeyboardNavigation() {
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
        
        // Mobile menu
        setupMobileMenu();
    }

    function handleAnchorClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            
            target.scrollIntoView({
                behavior: state.reducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
            
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
        const sidebar = document.querySelector('.sidebar');
        const toggle = document.querySelector('.sidebar-toggle');
        
        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                toggle.setAttribute('aria-expanded', 
                    sidebar.classList.contains('collapsed') ? 'false' : 'true'
                );
            });
        }
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
        
        // Theme shortcuts
        if (CONFIG.keyboardShortcuts.theme.includes(key)) {
            e.preventDefault();
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            applyTheme(state.theme);
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
        createProgressBar();
        setupHeaderScroll();
        setupScrollAnimations();
    }

    function createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-label', 'Reading progress');
        progressBar.innerHTML = '<div class="progress-bar-fill"></div>';
        document.body.appendChild(progressBar);
        
        updateScrollProgress();
    }

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
        
        const progressFill = document.querySelector('.progress-bar-fill');
        if (progressFill) {
            progressFill.style.transform = `scaleX(${progress})`;
        }
        
        state.scrollProgress = progress;
    }

    function setupHeaderScroll() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const header = document.querySelector('header');
            
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
            <div class="search-container glass-container-strong">
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
            
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSearch() {
        const overlay = document.querySelector('.search-overlay');
        
        if (overlay) {
            overlay.classList.remove('active');
            state.searchActive = false;
            
            document.body.style.overflow = '';
            
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
        
        // Use mdBook's search if available, otherwise fallback
        if (window.search) {
            const results = window.search(query);
            displaySearchResults(results);
        } else {
            const results = simulateSearch(query);
            displaySearchResults(results);
        }
    }

    function simulateSearch(query) {
        // Fallback search implementation
        const allText = document.body.textContent.toLowerCase();
        const words = allText.split(/\s+/);
        const matches = words.filter(word => word.includes(query.toLowerCase()));
        
        return matches.slice(0, CONFIG.maxSearchResults).map((match, index) => ({
            title: `Result ${index + 1}`,
            url: '#',
            excerpt: match.substring(0, 100) + '...'
        }));
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
        
        if (state.selectedSearchIndex >= 0) {
            items[state.selectedSearchIndex].classList.remove('selected');
        }
        
        state.selectedSearchIndex += direction;
        if (state.selectedSearchIndex < 0) {
            state.selectedSearchIndex = items.length - 1;
        } else if (state.selectedSearchIndex >= items.length) {
            state.selectedSearchIndex = 0;
        }
        
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

    // ===== ANIMATIONS =====
    function initializeAnimations() {
        if (state.reducedMotion) return;
        
        // Add scroll-reveal classes to content
        const content = document.querySelector('.content');
        if (content) {
            const elements = content.querySelectorAll('h1, h2, h3, h4, p, ul, ol, blockquote, pre, table');
            elements.forEach((el, index) => {
                el.classList.add('scroll-reveal');
                el.style.transitionDelay = `${index * 50}ms`;
            });
        }
        
        // Stagger animations for lists
        document.querySelectorAll('ul, ol').forEach(list => {
            list.classList.add('stagger');
        });
    }

    // ===== COPY BUTTONS =====
    function initializeCopyButtons() {
        document.querySelectorAll('pre').forEach(pre => {
            // Skip if already has copy button
            if (pre.querySelector('.copy-button')) return;
            
            const button = document.createElement('button');
            button.className = 'copy-button';
            button.setAttribute('aria-label', 'Copy code');
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
            
            button.addEventListener('click', async () => {
                const code = pre.querySelector('code');
                if (code) {
                    try {
                        await navigator.clipboard.writeText(code.textContent);
                        button.classList.add('copied');
                        button.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        `;
                        
                        showToast('Code copied to clipboard!');
                        
                        setTimeout(() => {
                            button.classList.remove('copied');
                            button.innerHTML = `
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            `;
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy code:', err);
                        showToast('Failed to copy code', 'error');
                    }
                }
            });
            
            pre.appendChild(button);
        });
    }

    // ===== TOAST NOTIFICATIONS =====
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        if (type === 'error') {
            toast.style.background = 'var(--accent-danger)';
            toast.style.color = 'var(--text-inverse)';
        }
        
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ===== EVENT LISTENERS =====
    function setupEventListeners() {
        window.addEventListener('resize', debounce(handleResize, 250));
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('theme-change', handleThemeChange);
        
        // Performance monitoring
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log(`LCP: ${entry.startTime}ms`);
                    }
                });
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    function handleResize() {
        const wasMobile = state.isMobile;
        state.isMobile = window.innerWidth < 768;
        
        if (wasMobile !== state.isMobile) {
            updateActiveNavigation();
        }
    }

    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            updateActiveNavigation();
            fixAssetPaths(); // Re-fix paths when page becomes visible
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
    window.DevAtelier2026 = {
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
        assets: {
            fix: fixAssetPaths,
            isFixed: () => state.assetPathsFixed
        },
        announce: announceToScreenReader,
        toast: showToast,
        state: state
    };

    // ===== INITIALIZATION =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-initialize on page changes (for SPA-like behavior)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                fixAssetPaths();
                initializeCopyButtons();
                updateActiveNavigation();
            }, 100);
        }
    }).observe(document, { subtree: true, childList: true });

})();
