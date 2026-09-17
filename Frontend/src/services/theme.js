// Aerisence Global Theme Engine (Light / Dark)
const THEME_STORAGE_KEY = 'aerisence_theme';

export const themeManager = {
  getTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    // Default to light mode for the primary scientific enterprise direction
    return 'light';
  },

  setTheme(theme) {
    const isDark = theme === 'dark';
    const root = document.documentElement;

    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    localStorage.setItem(THEME_STORAGE_KEY, theme);
    window.dispatchEvent(new CustomEvent('aerisence-theme-change', { detail: { theme } }));
  },

  toggleTheme() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  },

  initTheme() {
    const theme = this.getTheme();
    this.setTheme(theme);
  }
};
