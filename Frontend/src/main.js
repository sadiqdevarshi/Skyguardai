import './styles/main.css';
import { navigate } from './router.js';
import { auth } from './services/auth.js';

function initApp() {
  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    navigate(window.location.hash);
  });

  // Re-render when auth changes
  auth.subscribe(() => {
    navigate(window.location.hash);
  });

  // Initial navigation
  if (!window.location.hash) {
    window.location.hash = '#/';
  } else {
    navigate(window.location.hash);
  }
}

// Bootstrap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
