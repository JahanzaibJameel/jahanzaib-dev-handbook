(function() {
    // Immediately kill mdBook's theme system before it initializes
    window.theme = 'light';
    Object.defineProperty(window, 'theme', { 
        value: 'light', 
        writable: false,
        configurable: false 
    });
    
    // Override localStorage to prevent theme changes
    if (window.localStorage) {
        const originalSetItem = localStorage.setItem;
        const originalGetItem = localStorage.getItem;
        
        localStorage.setItem = function(key, value) {
            if (key === 'mdbook-theme' || key === 'mdbook-theme-pref') {
                return originalSetItem.call(this, key, 'light');
            }
            return originalSetItem.call(this, key, value);
        };
        
        localStorage.getItem = function(key) {
            if (key === 'mdbook-theme' || key === 'mdbook-theme-pref') {
                return 'light';
            }
            return originalGetItem.call(this, key);
        };
        
        // Force set theme to light immediately
        localStorage.setItem('mdbook-theme', 'light');
        localStorage.setItem('mdbook-theme-pref', 'light');
    }
    
    // Remove theme switcher from DOM as soon as possible
    function removeThemeUI() {
        const themePopup = document.getElementById('theme-list');
        if (themePopup) themePopup.remove();
        
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) themeToggle.remove();
        
        const themeButtons = document.querySelectorAll('[class*="theme"], button[class*="theme"]');
        themeButtons.forEach(btn => btn.remove());
        
        // Remove any theme-related aria labels
        const themeElements = document.querySelectorAll('[aria-label*="theme"], [title*="theme"]');
        themeElements.forEach(el => el.remove());
    }
    
    // Run immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeThemeUI);
    } else {
        removeThemeUI();
    }
    
    // Also run after a short delay to catch any dynamically created theme elements
    setTimeout(removeThemeUI, 100);
    
    // Override any attempt to change theme via CSS classes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.className.includes('theme')) {
                    target.className = target.className.replace(/\btheme-\S+/g, '');
                }
            }
        });
    });
    
    // Start observing the entire document
    observer.observe(document.body || document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
        subtree: true
    });
    
    // Prevent theme-related keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Prevent any theme-related keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            // Common theme shortcut patterns
            if (e.key === 't' || e.key === 'T' || e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });
    
    // Override console theme-related messages
    const originalLog = console.log;
    console.log = function(...args) {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('theme')) {
            return;
        }
        return originalLog.apply(console, args);
    };
})();
