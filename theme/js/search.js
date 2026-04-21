/**
 * DevAtelier 2026 - Premium Search Experience
 * High-performance search with keyboard navigation and instant results
 */

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        minQueryLength: 2,
        maxResults: 50,
        debounceDelay: 150,
        highlightTag: 'mark',
        excerptLength: 150,
        searchIndexKey: 'devatelier-search-index',
        searchHistoryKey: 'devatelier-search-history',
        maxHistoryItems: 10
    };

    // ===== STATE MANAGEMENT =====
    const state = {
        isOpen: false,
        isSearching: false,
        query: '',
        results: [],
        selectedIndex: -1,
        searchIndex: null,
        history: [],
        controller: null
    };

    // ===== INITIALIZATION =====
    function init() {
        loadSearchHistory();
        setupSearchElements();
        setupEventListeners();
        setupKeyboardNavigation();
        loadSearchIndex();
    }

    // ===== SEARCH ELEMENTS =====
    function setupSearchElements() {
        // Create search trigger if not exists
        if (!document.querySelector('.search-trigger')) {
            createSearchTrigger();
        }
        
        // Create search overlay if not exists
        if (!document.querySelector('.search-overlay')) {
            createSearchOverlay();
        }
    }

    function createSearchTrigger() {
        const trigger = document.createElement('button');
        trigger.className = 'search-trigger';
        trigger.setAttribute('aria-label', 'Search documentation (Press /)');
        trigger.setAttribute('title', 'Search documentation (Press /)');
        trigger.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
            </svg>
            <span>Search</span>
            <kbd class="kbd">/</kbd>
        `;
        
        // Add to header navigation
        const headerNav = document.querySelector('.header-nav');
        if (headerNav) {
            headerNav.appendChild(trigger);
        }
        
        trigger.addEventListener('click', open);
    }

    function createSearchOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'search-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Search documentation');
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
                        aria-describedby="search-status"
                    >
                    <button class="search-clear" aria-label="Clear search" style="display: none;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="search-status" id="search-status" aria-live="polite" aria-atomic="true"></div>
                <div class="search-results" role="listbox"></div>
                <div class="search-footer">
                    <div class="search-shortcuts">
                        <kbd>↑</kbd><kbd>↓</kbd> Navigate
                        <kbd>Enter</kbd> Select
                        <kbd>Esc</kbd> Close
                    </div>
                    <div class="search-history" id="search-history"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Close on background click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                close();
            }
        });
    }

    // ===== EVENT LISTENERS =====
    function setupEventListeners() {
        const input = document.querySelector('.search-input');
        const clearBtn = document.querySelector('.search-clear');
        
        if (input) {
            let debounceTimer;
            
            input.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                state.query = e.target.value.trim();
                
                // Show/hide clear button
                if (clearBtn) {
                    clearBtn.style.display = state.query ? 'flex' : 'none';
                }
                
                if (state.query.length >= CONFIG.minQueryLength) {
                    debounceTimer = setTimeout(() => {
                        performSearch(state.query);
                    }, CONFIG.debounceDelay);
                } else {
                    clearResults();
                    showHistory();
                }
            });
            
            input.addEventListener('keydown', handleInputKeydown);
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', clearSearch);
        }
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', handleGlobalKeydown);
    }

    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!state.isOpen) return;
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    navigateResults(1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    navigateResults(-1);
                    break;
                case 'Enter':
                    e.preventDefault();
                    selectResult();
                    break;
                case 'Escape':
                    e.preventDefault();
                    close();
                    break;
            }
        });
    }

    function handleGlobalKeydown(e) {
        // Open search on / key when not focused on input
        if (e.key === '/' && !state.isOpen && !isInputFocused(e)) {
            e.preventDefault();
            open();
        }
        
        // Open search on Ctrl/Cmd + K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !state.isOpen) {
            e.preventDefault();
            open();
        }
    }

    function handleInputKeydown(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
            e.preventDefault();
        }
    }

    function isInputFocused(e) {
        const target = e.target;
        return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true';
    }

    // ===== SEARCH FUNCTIONALITY =====
    function loadSearchIndex() {
        // Try to load mdBook's search index
        if (window.searchIndex) {
            state.searchIndex = window.searchIndex;
            return;
        }
        
        // Fallback: create simple index from page content
        createFallbackIndex();
    }

    function createFallbackIndex() {
        const index = [];
        
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
            const text = heading.textContent.trim();
            const id = heading.id;
            const url = id ? `#${id}` : window.location.pathname;
            
            if (text) {
                index.push({
                    title: text,
                    url: url,
                    content: text,
                    type: 'heading'
                });
            }
        });
        
        // Add page metadata
        const title = document.title;
        const description = document.querySelector('meta[name="description"]')?.content || '';
        
        index.unshift({
            title: title,
            url: window.location.pathname,
            content: description,
            type: 'page'
        });
        
        state.searchIndex = index;
    }

    function performSearch(query) {
        if (!state.searchIndex) return;
        
        state.isSearching = true;
        updateStatus('Searching...');
        
        // Cancel previous search if still running
        if (state.controller) {
            state.controller.abort();
        }
        
        state.controller = new AbortController();
        
        // Simulate async search
        setTimeout(() => {
            const results = searchIndex(query);
            displayResults(results);
            state.isSearching = false;
            updateStatus(`Found ${results.length} result${results.length !== 1 ? 's' : ''}`);
            
            // Add to history
            addToHistory(query);
        }, 100);
    }

    function searchIndex(query) {
        const normalizedQuery = query.toLowerCase();
        const results = [];
        
        state.searchIndex.forEach(item => {
            const titleMatch = item.title.toLowerCase().indexOf(normalizedQuery);
            const contentMatch = item.content.toLowerCase().indexOf(normalizedQuery);
            
            if (titleMatch !== -1 || contentMatch !== -1) {
                const score = calculateScore(item, normalizedQuery, titleMatch, contentMatch);
                results.push({
                    ...item,
                    score: score,
                    excerpt: createExcerpt(item.content, normalizedQuery)
                });
            }
        });
        
        // Sort by score and limit results
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, CONFIG.maxResults);
    }

    function calculateScore(item, query, titleMatch, contentMatch) {
        let score = 0;
        
        // Title matches are worth more
        if (titleMatch !== -1) {
            score += 100;
            if (titleMatch === 0) score += 50; // Exact title start
        }
        
        // Content matches
        if (contentMatch !== -1) {
            score += 10;
        }
        
        // Type weighting
        if (item.type === 'page') score += 20;
        if (item.type === 'heading') score += 10;
        
        return score;
    }

    function createExcerpt(content, query) {
        if (!content) return '';
        
        const index = content.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return content.substring(0, CONFIG.excerptLength);
        
        const start = Math.max(0, index - 50);
        const end = Math.min(content.length, index + query.length + 100);
        
        let excerpt = content.substring(start, end);
        
        if (start > 0) excerpt = '...' + excerpt;
        if (end < content.length) excerpt = excerpt + '...';
        
        return highlightText(excerpt, query);
    }

    function highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, `<${CONFIG.highlightTag}>$1</${CONFIG.highlightTag}>`);
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // ===== RESULT DISPLAY =====
    function displayResults(results) {
        const container = document.querySelector('.search-results');
        const historyContainer = document.querySelector('#search-history');
        
        if (!container) return;
        
        state.results = results;
        state.selectedIndex = -1;
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-no-results">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <p>No results found for "<strong>${escapeHtml(state.query)}</strong>"</p>
                    <p>Try different keywords or check your spelling</p>
                </div>
            `;
        } else {
            container.innerHTML = results.map((result, index) => `
                <div class="search-result-item ${index === state.selectedIndex ? 'selected' : ''}" 
                     role="option" 
                     data-index="${index}"
                     data-url="${result.url}">
                    <div class="search-result-title">${highlightText(result.title, state.query)}</div>
                    <div class="search-result-excerpt">${result.excerpt}</div>
                    <div class="search-result-meta">
                        <span class="search-result-type">${result.type}</span>
                        ${result.score ? `<span class="search-result-score">Score: ${result.score}</span>` : ''}
                    </div>
                </div>
            `).join('');
            
            // Add click handlers
            container.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const url = item.dataset.url;
                    if (url) {
                        navigateToResult(url);
                    }
                });
                
                item.addEventListener('mouseenter', () => {
                    selectResultItem(parseInt(item.dataset.index));
                });
            });
        }
        
        // Hide history
        if (historyContainer) {
            historyContainer.style.display = 'none';
        }
    }

    function showHistory() {
        const container = document.querySelector('.search-results');
        const historyContainer = document.querySelector('#search-history');
        
        if (!container || !historyContainer || state.history.length === 0) {
            if (container) container.innerHTML = '';
            return;
        }
        
        container.innerHTML = '';
        historyContainer.innerHTML = `
            <div class="search-history-title">Recent Searches</div>
            <div class="search-history-items">
                ${state.history.map(item => `
                    <button class="search-history-item" data-query="${escapeHtml(item)}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        ${escapeHtml(item)}
                    </button>
                `).join('')}
            </div>
        `;
        
        historyContainer.style.display = 'block';
        
        // Add click handlers
        historyContainer.querySelectorAll('.search-history-item').forEach(item => {
            item.addEventListener('click', () => {
                const query = item.dataset.query;
                const input = document.querySelector('.search-input');
                if (input) {
                    input.value = query;
                    state.query = query;
                    performSearch(query);
                }
            });
        });
    }

    function clearResults() {
        const container = document.querySelector('.search-results');
        if (container) {
            container.innerHTML = '';
        }
        state.results = [];
        state.selectedIndex = -1;
    }

    // ===== NAVIGATION =====
    function navigateResults(direction) {
        if (state.results.length === 0) return;
        
        const newIndex = state.selectedIndex + direction;
        if (newIndex < 0) {
            state.selectedIndex = state.results.length - 1;
        } else if (newIndex >= state.results.length) {
            state.selectedIndex = 0;
        } else {
            state.selectedIndex = newIndex;
        }
        
        selectResultItem(state.selectedIndex);
    }

    function selectResultItem(index) {
        const items = document.querySelectorAll('.search-result-item');
        
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
        
        state.selectedIndex = index;
    }

    function selectResult() {
        if (state.selectedIndex >= 0 && state.results[state.selectedIndex]) {
            const result = state.results[state.selectedIndex];
            if (result.url) {
                navigateToResult(result.url);
            }
        }
    }

    function navigateToResult(url) {
        close();
        
        // Handle relative URLs
        if (url.startsWith('#')) {
            const target = document.querySelector(url);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                target.focus();
            }
        } else {
            window.location.href = url;
        }
    }

    // ===== SEARCH HISTORY =====
    function loadSearchHistory() {
        try {
            const history = localStorage.getItem(CONFIG.searchHistoryKey);
            state.history = history ? JSON.parse(history) : [];
        } catch (e) {
            state.history = [];
        }
    }

    function saveSearchHistory() {
        try {
            localStorage.setItem(CONFIG.searchHistoryKey, JSON.stringify(state.history));
        } catch (e) {
            // Ignore storage errors
        }
    }

    function addToHistory(query) {
        if (!query || query.length < CONFIG.minQueryLength) return;
        
        // Remove if already exists
        state.history = state.history.filter(item => item !== query);
        
        // Add to beginning
        state.history.unshift(query);
        
        // Limit history size
        state.history = state.history.slice(0, CONFIG.maxHistoryItems);
        
        saveSearchHistory();
    }

    function clearHistory() {
        state.history = [];
        saveSearchHistory();
        showHistory();
    }

    // ===== UI CONTROL =====
    function open() {
        const overlay = document.querySelector('.search-overlay');
        const input = document.querySelector('.search-input');
        
        if (overlay && input) {
            overlay.classList.add('active');
            input.value = state.query;
            input.focus();
            state.isOpen = true;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Show history if no query
            if (!state.query) {
                showHistory();
            }
            
            // Announce to screen readers
            updateStatus('Search opened. Type to search or use arrow keys to navigate.');
        }
    }

    function close() {
        const overlay = document.querySelector('.search-overlay');
        
        if (overlay) {
            overlay.classList.remove('active');
            state.isOpen = false;
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Return focus to trigger
            const trigger = document.querySelector('.search-trigger');
            if (trigger) {
                trigger.focus();
            }
        }
    }

    function clearSearch() {
        const input = document.querySelector('.search-input');
        const clearBtn = document.querySelector('.search-clear');
        
        if (input) {
            input.value = '';
            state.query = '';
            clearResults();
            showHistory();
        }
        
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
    }

    function updateStatus(message) {
        const status = document.querySelector('#search-status');
        if (status) {
            status.textContent = message;
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== PUBLIC API =====
    window.DevAtelierSearch = {
        open,
        close,
        clear: clearSearch,
        search: performSearch,
        state
    };

    // ===== INITIALIZATION =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
