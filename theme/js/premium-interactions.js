// Ultra-Premium JavaScript Interactions for Jahanzaib Dev Handbook

document.addEventListener('DOMContentLoaded', function() {
    // Premium Theme Initialization
    initializePremiumTheme();
    
    // Glassmorphism Effects
    initializeGlassmorphism();
    
    // Smooth Scrolling
    initializeSmoothScrolling();
    
    // Premium Animations
    initializeAnimations();
    
    // Interactive Code Blocks
    initializeCodeBlocks();
    
    // Premium Search
    initializePremiumSearch();
    
    // Theme Toggle
    initializeThemeToggle();
    
    // Progress Indicators
    initializeProgressIndicators();
    
    // Tooltips
    initializeTooltips();
    
    // Keyboard Shortcuts
    initializeKeyboardShortcuts();
});

// Premium Theme Initialization
function initializePremiumTheme() {
    // Apply glassmorphism to all content blocks
    const contentBlocks = document.querySelectorAll('.content');
    contentBlocks.forEach(block => {
        block.classList.add('glass-card');
    });
    
    // Add premium styling to headers
    const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headers.forEach(header => {
        header.classList.add('premium-header');
    });
    
    // Enhance navigation
    const navigation = document.querySelector('.sidebar');
    if (navigation) {
        navigation.classList.add('premium-navigation');
    }
}

// Glassmorphism Effects
function initializeGlassmorphism() {
    // Add glass effect to cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('glass-visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.glass-card').forEach(card => {
        observer.observe(card);
    });
    
    // Parallax effect for background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('body');
        if (parallax) {
            parallax.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// Premium Animations
function initializeAnimations() {
    // Fade in animations
    const animateElements = document.querySelectorAll('.glass-card');
    animateElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('fade-in-up');
    });
    
    // Hover effects for cards
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Interactive Code Blocks
function initializeCodeBlocks() {
    // Add copy button to code blocks
    document.querySelectorAll('pre').forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = 'Copy';
        button.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--gradient-primary);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s ease;
            z-index: 10;
        `;
        
        block.style.position = 'relative';
        block.appendChild(button);
        
        button.addEventListener('click', () => {
            const code = block.querySelector('code');
            if (code) {
                navigator.clipboard.writeText(code.textContent);
                button.innerHTML = 'Copied!';
                button.style.background = 'var(--gradient-accent)';
                
                setTimeout(() => {
                    button.innerHTML = 'Copy';
                    button.style.background = 'var(--gradient-primary)';
                }, 2000);
            }
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
    
    // Syntax highlighting enhancement
    document.querySelectorAll('code').forEach(codeBlock => {
        // Add syntax highlighting classes
        if (codeBlock.textContent.includes('function')) {
            codeBlock.classList.add('syntax-function');
        }
        if (codeBlock.textContent.includes('const')) {
            codeBlock.classList.add('syntax-const');
        }
        if (codeBlock.textContent.includes('class')) {
            codeBlock.classList.add('syntax-class');
        }
    });
}

// Premium Search
function initializePremiumSearch() {
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
        searchInput.placeholder = 'Search the ultra-premium handbook...';
        searchInput.style.cssText = `
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
            padding: 12px 20px;
            border-radius: 24px;
            font-size: 16px;
            width: 100%;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        `;
        
        searchInput.addEventListener('focus', () => {
            searchInput.style.borderColor = 'var(--accent-primary)';
            searchInput.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
        });
        
        searchInput.addEventListener('blur', () => {
            searchInput.style.borderColor = 'var(--glass-border)';
            searchInput.style.boxShadow = 'none';
        });
    }
}

// Theme Toggle
function initializeThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = 'Toggle Theme';
    themeToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 24px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeToggle.innerHTML = document.body.classList.contains('light-theme') ? 'Dark Theme' : 'Light Theme';
    });
    
    themeToggle.addEventListener('mouseenter', () => {
        themeToggle.style.transform = 'scale(1.1)';
        themeToggle.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.4)';
    });
    
    themeToggle.addEventListener('mouseleave', () => {
        themeToggle.style.transform = 'scale(1)';
        themeToggle.style.boxShadow = 'none';
    });
}

// Progress Indicators
function initializeProgressIndicators() {
    // Reading progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: var(--gradient-accent);
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
    
    // Section progress indicators
    const sections = document.querySelectorAll('h2');
    sections.forEach((section, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'section-indicator';
        indicator.style.cssText = `
            position: fixed;
            right: 20px;
            top: ${80 + index * 40}px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--glass-border);
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 999;
        `;
        
        document.body.appendChild(indicator);
        
        indicator.addEventListener('click', () => {
            section.scrollIntoView({ behavior: 'smooth' });
        });
        
        // Update indicator on scroll
        window.addEventListener('scroll', () => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                indicator.style.background = 'var(--accent-primary)';
                indicator.style.transform = 'scale(1.5)';
            } else {
                indicator.style.background = 'var(--glass-border)';
                indicator.style.transform = 'scale(1)';
            }
        });
    });
}

// Tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'premium-tooltip';
        tooltip.textContent = element.dataset.tooltip;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(tooltip);
        
        element.addEventListener('mouseenter', (e) => {
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            tooltip.style.opacity = '1';
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
}

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Ctrl/Cmd + / for shortcuts help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            showShortcutsHelp();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Show shortcuts help
function showShortcutsHelp() {
    const helpModal = document.createElement('div');
    helpModal.innerHTML = `
        <div class="premium-modal">
            <h3>Keyboard Shortcuts</h3>
            <div class="shortcuts-list">
                <div class="shortcut-item">
                    <kbd>Ctrl/Cmd + K</kbd>
                    <span>Search</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Ctrl/Cmd + /</kbd>
                    <span>Show shortcuts</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Escape</kbd>
                    <span>Close modals</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Arrow Keys</kbd>
                    <span>Navigate</span>
                </div>
            </div>
            <button class="close-button">Close</button>
        </div>
    `;
    
    helpModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(helpModal);
    
    helpModal.querySelector('.close-button').addEventListener('click', () => {
        helpModal.remove();
    });
    
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.remove();
        }
    });
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.premium-modal').forEach(modal => {
        modal.remove();
    });
}

// Performance optimization
function optimizePerformance() {
    // Lazy loading for images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });
}

// Analytics (if needed)
function initializeAnalytics() {
    // Add your analytics code here
    console.log('Premium handbook initialized successfully!');
}

// Utility functions
const premiumUtils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    animate: (element, properties, duration = 300) => {
        return new Promise(resolve => {
            element.style.transition = `all ${duration}ms ease`;
            Object.assign(element.style, properties);
            setTimeout(resolve, duration);
        });
    }
};

// Export utilities for global access
window.premiumUtils = premiumUtils;

// Initialize performance optimizations
optimizePerformance();

// Initialize analytics
initializeAnalytics();
