// Fix asset paths (defensive against duplicated segments)
(function fixAssetPaths() {
  const fixUrl = (url) => {
    if (!url) return url;
    // Remove repeated path segments like /react-native/react-native/... -> /
    return url.replace(/\/([^\/]+)\/\1\//g, '/');
  };
  document.querySelectorAll('link[href], script[src], img[src]').forEach(el => {
    const attr = el.tagName === 'LINK' ? 'href' : 'src';
    const original = el.getAttribute(attr);
    if (original) {
      const fixed = fixUrl(original);
      if (fixed !== original) el.setAttribute(attr, fixed);
    }
  });
})();

// Theme toggle with persistence
(function initTheme() {
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.body.classList.add(savedTheme);
  const btn = document.createElement('button');
  btn.id = 'theme-toggle';
  btn.textContent = savedTheme === 'dark' ? '?? Light' : '?? Dark';
  btn.onclick = () => {
    const isDark = document.body.classList.toggle('dark');
    document.body.classList.toggle('light', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    btn.textContent = isDark ? '?? Light' : '?? Dark';
  };
  document.body.appendChild(btn);
})();
