/**
 * Production-Ready Custom JavaScript for Jahanzaib Dev Handbook
 * Handles theme switching, asset path fixing, and UI enhancements
 */

(function() {
    'use strict';

    // Asset path fixing - prevents 404s from duplicate path segments
    function fixAssetPaths() {
        try {
            const fixUrl = (url) => {
                if (!url || typeof url !== 'string') return url;
                // Remove repeated path segments like /react-native/react-native/... -> /
                return url.replace(/\/([^\/]+)\/\1\//g, '/');
            };
            
            const elements = document.querySelectorAll('link[href], script[src], img[src], source[srcset]');
            elements.forEach(el => {
                const isLink = el.tagName === 'LINK';
                const isSource = el.tagName === 'SOURCE';
                let attr, original;
                
                if (isLink) {
                    attr = 'href';
                    original = el.getAttribute(attr);
                } else if (isSource) {
                    attr = 'srcset';
                    original = el.getAttribute(attr);
                } else {
                    attr = 'src';
                    original = el.getAttribute(attr);
                }
                
                if (original) {
                    const fixed = fixUrl(original);
                    if (fixed !== original) {
                        el.setAttribute(attr, fixed);
                    }
                }
            });
        } catch (error) {
            console.warn('Asset path fixing failed:', error);
        }
    }

    // Theme management with system preference detection
    function initTheme() {
        try {
            // Get saved theme or detect system preference
            const savedTheme = localStorage.getItem('theme');
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = savedTheme === 'dark' || (!savedTheme && systemDark);
            
            // Apply theme
            document.body.classList.toggle('dark', isDark);
            document.body.classList.toggle('light', !isDark);
            
            // Create theme toggle button
            const btn = document.createElement('button');
            btn.id = 'theme-toggle';
            btn.innerHTML = isDark ? ' <span>??</span> Light' : '<span>??</span> Dark';
            btn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
            btn.setAttribute('title', `Switch to ${isDark ? 'light' : 'dark'} mode`);
            
            // Theme toggle handler
            btn.addEventListener('click', () => {
                const currentlyDark = document.body.classList.contains('dark');
                const newDark = !currentlyDark;
                
                document.body.classList.toggle('dark', newDark);
                document.body.classList.toggle('light', !newDark);
                localStorage.setItem('theme', newDark ? 'dark' : 'light');
                
                btn.innerHTML = newDark ? '<span>??</span> Light' : '<span>??</span> Dark';
                btn.setAttribute('aria-label', `Switch to ${newDark ? 'light' : 'dark'} mode`);
                btn.setAttribute('title', `Switch to ${newDark ? 'light' : 'dark'} mode`);
                
                // Trigger custom event for other components
                window.dispatchEvent(new CustomEvent('themechange', { 
                    detail: { theme: newDark ? 'dark' : 'light' } 
                }));
            });
            
            // Add to DOM
            document.body.appendChild(btn);
            
            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    const isDark = e.matches;
                    document.body.classList.toggle('dark', isDark);
                    document.body.classList.toggle('light', !isDark);
                    btn.innerHTML = isDark ? '<span>??</span> Light' : '<span>??</span> Dark';
                }
            });
            
        } catch (error) {
            console.warn('Theme initialization failed:', error);
        }
    }

    // Enhanced search functionality
    function enhanceSearch() {
        try {
            const searchInput = document.querySelector('.search-input');
            if (!searchInput) return;
            
            // Add search suggestions placeholder
            searchInput.setAttribute('placeholder', 'Search handbook...');
            searchInput.setAttribute('aria-label', 'Search handbook');
            
            // Add keyboard shortcut hint
            const shortcut = document.createElement('small');
            shortcut.style.cssText = 'position: absolute; right: 10px; top: 50%; transform: translateY(-50%); opacity: 0.5;';
            shortcut.textContent = 'Ctrl+K';
            searchInput.parentElement.style.position = 'relative';
            searchInput.parentElement.appendChild(shortcut);
            
            // Keyboard shortcut
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    searchInput.focus();
                }
            });
            
        } catch (error) {
            console.warn('Search enhancement failed:', error);
        }
    }

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        try {
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
        } catch (error) {
            console.warn('Smooth scroll initialization failed:', error);
        }
    }

    // Copy code functionality
    function initCopyCode() {
        try {
            document.querySelectorAll('pre').forEach(pre => {
                const button = document.createElement('button');
                button.className = 'copy-button';
                button.innerHTML = '<span>??</span>';
                button.setAttribute('aria-label', 'Copy code');
                button.style.cssText = `
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: var(--accent);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 12px;
                    opacity: 0;
                    transition: opacity 0.2s;
                `;
                
                pre.style.position = 'relative';
                pre.appendChild(button);
                
                pre.addEventListener('mouseenter', () => button.style.opacity = '1');
                pre.addEventListener('mouseleave', () => button.style.opacity = '0');
                
                button.addEventListener('click', () => {
                    const code = pre.querySelector('code');
                    if (code) {
                        navigator.clipboard.writeText(code.textContent).then(() => {
                            button.innerHTML = '<span>??</span>';
                            setTimeout(() => button.innerHTML = '<span>??</span>', 2000);
                        });
                    }
                });
            });
        } catch (error) {
            console.warn('Copy code initialization failed:', error);
        }
    }

    // Performance monitoring
    function initPerformanceMonitoring() {
        try {
            // Report page load performance
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData && perfData.loadEventEnd - perfData.loadEventStart > 3000) {
                        console.warn('Page load took over 3 seconds');
                    }
                }, 0);
            });
        } catch (error) {
            console.warn('Performance monitoring failed:', error);
        }
    }

    // Initialize everything when DOM is ready
    function init() {
        // Run immediately for path fixing
        fixAssetPaths();
        
        // Wait for DOM for other features
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initTheme();
                enhanceSearch();
                initSmoothScroll();
                initCopyCode();
                initPerformanceMonitoring();
            });
        } else {
            initTheme();
            enhanceSearch();
            initSmoothScroll();
            initCopyCode();
            initPerformanceMonitoring();
        }
        
        // Monitor for dynamic content changes
        const observer = new MutationObserver(() => {
            fixAssetPaths();
            initCopyCode();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start initialization
    init();

})();
