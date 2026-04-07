// Advanced Animations for Jahanzaib Dev Handbook

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeAnimations();
    
    // Smooth scrolling
    initializeSmoothScrolling();
    
    // Interactive elements
    initializeInteractiveElements();
    
    // Keyboard shortcuts
    initializeKeyboardShortcuts();
});

// Initialize animations
function initializeAnimations() {
    // Add fade-in animation to chapters
    const chapters = document.querySelectorAll('.chapter');
    chapters.forEach((chapter, index) => {
        chapter.style.animationDelay = `${index * 0.1}s`;
        chapter.classList.add('will-change-transform');
    });
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, code');
    interactiveElements.forEach(element => {
        element.classList.add('gpu-accelerated');
    });
    
    // Animate list items
    const listItems = document.querySelectorAll('li');
    listItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Smooth scrolling
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

// Interactive elements
function initializeInteractiveElements() {
    // Add click effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add hover effects to code blocks
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(block => {
        block.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        block.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Keyboard shortcuts
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
        <div class="shortcuts-modal">
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
            <button class="close-shortcuts">Close</button>
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
        animation: fadeInUp 0.3s ease-out;
    `;
    
    document.body.appendChild(helpModal);
    
    helpModal.querySelector('.close-shortcuts').addEventListener('click', () => {
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
    document.querySelectorAll('.shortcuts-modal').forEach(modal => {
        modal.remove();
    });
}

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .shortcuts-modal {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 2rem;
        backdrop-filter: blur(16px) saturate(180%);
        -webkit-backdrop-filter: blur(16px) saturate(180%);
        max-width: 500px;
        width: 90%;
    }
    
    .shortcuts-modal h3 {
        margin-top: 0;
        color: var(--accent-primary);
    }
    
    .shortcuts-list {
        margin: 1.5rem 0;
    }
    
    .shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1rem 0;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
    }
    
    .shortcut-item kbd {
        background: var(--primary-gradient);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.875rem;
    }
    
    .close-shortcuts {
        background: var(--primary-gradient);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: transform 0.2s ease;
    }
    
    .close-shortcuts:hover {
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// Performance optimization
function optimizePerformance() {
    // Lazy loading for images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
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

// Initialize performance optimizations
optimizePerformance();

console.log('Advanced animations initialized successfully!');
