import { auth } from '../services/auth.js';
import { themeManager } from '../services/theme.js';

export function renderNavbar() {
  const user = auth.getUser();
  const currentPath = window.location.hash.slice(1) || '/';
  const currentTheme = themeManager.getTheme();

  const isActive = (path) => {
    if (path === '/' || path === '') return currentPath === '/' || currentPath === '';
    return currentPath.startsWith(path);
  };

  const linkClass = (path) => `
    px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150
    ${isActive(path)
      ? 'text-accent font-semibold bg-accent-subtle border border-accent/20'
      : 'text-content-secondary hover:text-content-primary hover:bg-surface-hover'
    }
  `.trim();

  return `
    <nav class="bg-surface/90 dark:bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-all duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Brand Logo & Identity -->
          <div class="flex items-center space-x-3">
            <a href="#/" class="flex items-center space-x-3 group">
              <div class="w-9 h-9 rounded-lg bg-accent text-content-inverted flex items-center justify-center p-1.5 shadow-sm transition-transform group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 3"></circle>
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-base sm:text-lg tracking-wider text-content-primary font-sans uppercase">Aerisence</span>
                <span class="text-[9px] font-mono tracking-widest text-accent -mt-1 font-semibold uppercase">Meteorological Intel</span>
              </div>
            </a>
          </div>

          <!-- Desktop Primary Navigation (Product-Centric) -->
          <div class="hidden lg:flex items-center space-x-1">
            <a href="#/" class="${linkClass('/')}">Overview</a>
            <a href="#/monitoring" class="${linkClass('/monitoring')}">Monitoring</a>
            <a href="#/stations" class="${linkClass('/stations')}">Stations</a>
            <a href="#/anomalies" class="${linkClass('/anomalies')}">Anomalies</a>
            <a href="#/analytics" class="${linkClass('/analytics')}">Analytics</a>
            <a href="#/alerts" class="${linkClass('/alerts')}">Alerts</a>
            <a href="#/technology" class="${linkClass('/technology')}">Documentation</a>
          </div>

          <!-- Right Action Controls & Session -->
          <div class="flex items-center space-x-2 sm:space-x-3">
            
            <!-- Polished Theme Switcher (Light / Dark) -->
            <button id="theme-toggle-btn" class="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-hover border border-border transition-colors" title="Switch Theme (${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode)" aria-label="Toggle Theme">
              ${currentTheme === 'dark' ? `
                <!-- Sun Icon -->
                <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" stroke-width="2"></circle>
                  <line x1="12" y1="1" x2="12" y2="3" stroke-width="2" stroke-linecap="round"></line>
                  <line x1="12" y1="21" x2="12" y2="23" stroke-width="2" stroke-linecap="round"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke-width="2" stroke-linecap="round"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke-width="2" stroke-linecap="round"></line>
                  <line x1="1" y1="12" x2="3" y2="12" stroke-width="2" stroke-linecap="round"></line>
                  <line x1="21" y1="12" x2="23" y2="12" stroke-width="2" stroke-linecap="round"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke-width="2" stroke-linecap="round"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke-width="2" stroke-linecap="round"></line>
                </svg>
              ` : `
                <!-- Moon Icon -->
                <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              `}
            </button>

            ${user ? `
              <div class="flex items-center space-x-2">
                <a href="#/dashboard" class="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-content-primary hover:bg-surface-hover transition-colors">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Mission Control</span>
                </a>

                <a href="#/alerts" class="relative p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-hover border border-border transition-colors" title="Active Operational Alerts">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                  <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
                </a>

                <div class="flex items-center space-x-2 pl-1">
                  <div class="hidden sm:flex flex-col text-right">
                    <span class="text-xs font-semibold text-content-primary">${user.fullName || user.username}</span>
                    <span class="text-[9px] font-mono text-accent font-medium">${user.role.replace('ROLE_', '')}</span>
                  </div>
                  <a href="#/settings" class="w-8 h-8 rounded-full bg-accent text-content-inverted flex items-center justify-center text-xs font-bold transition-transform hover:scale-105" title="User & System Settings">
                    ${(user.username || 'U').charAt(0).toUpperCase()}
                  </a>
                </div>

                ${user.role === 'ROLE_ADMIN' ? `
                  <a href="#/admin" class="btn-secondary text-xs px-2.5 py-1 hidden sm:inline-flex" title="Administrative Console">Admin</a>
                ` : ''}

                <button id="nav-logout-btn" class="text-content-muted hover:text-rose-600 p-1.5 transition-colors" title="Sign Out">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
              </div>
            ` : `
              <div class="flex items-center space-x-2">
                <a href="#/login" class="px-3 py-1.5 text-xs font-medium text-content-secondary hover:text-content-primary transition-colors">Sign In</a>
                <a href="#/dashboard" class="btn-primary text-xs px-3.5 py-1.5 flex items-center space-x-1.5">
                  <span>Launch Platform</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
              </div>
            `}

            <!-- Mobile menu button -->
            <button id="mobile-menu-toggle" class="lg:hidden p-2 rounded-md text-content-muted hover:text-content-primary hover:bg-surface-hover border border-border focus:outline-none">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div id="mobile-menu" class="hidden lg:hidden border-t border-border bg-surface px-4 pt-3 pb-6 space-y-3">
        <div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-content-faint px-3">Telemetry Products</span>
          <div class="mt-1 space-y-1">
            <a href="#/" class="block px-3 py-2 rounded-md text-sm font-medium text-content-secondary hover:bg-surface-hover ${currentPath === '/' ? 'text-accent font-semibold bg-accent-subtle' : ''}">Overview</a>
            <a href="#/monitoring" class="block px-3 py-2 rounded-md text-sm font-medium text-content-secondary hover:bg-surface-hover ${currentPath === '/monitoring' ? 'text-accent font-semibold bg-accent-subtle' : ''}">Monitoring Matrix</a>
            <a href="#/stations" class="block px-3 py-2 rounded-md text-sm font-medium text-content-secondary hover:bg-surface-hover ${currentPath.startsWith('/stations') ? 'text-accent font-semibold bg-accent-subtle' : ''}">AWS Station Directory</a>
            <a href="#/anomalies" class="block px-3 py-2 rounded-md text-sm font-medium text-content-secondary hover:bg-surface-hover ${currentPath.startsWith('/anomalies') ? 'text-accent font-semibold bg-accent-subtle' : ''}">Anomaly Queue</a>
            <a href="#/analytics" class="block px-3 py-2 rounded-md text-sm font-medium text-content-secondary hover:bg-surface-hover ${currentPath.startsWith('/analytics') ? 'text-accent font-semibold bg-accent-subtle' : ''}">Longitudinal Analytics</a>
            <a href="#/alerts" class="block px-3 py-2 rounded-md text-sm font-medium text-content-secondary hover:bg-surface-hover ${currentPath.startsWith('/alerts') ? 'text-accent font-semibold bg-accent-subtle' : ''}">Operational Alerts</a>
            <a href="#/live" class="block px-3 py-2 rounded-md text-sm font-medium text-content-secondary hover:bg-surface-hover ${currentPath === '/live' ? 'text-accent font-semibold bg-accent-subtle' : ''}">Live 3D Sensor View</a>
          </div>
        </div>

        <div class="border-t border-border pt-2">
          <span class="text-[10px] font-mono uppercase tracking-widest text-content-faint px-3">Platform & Specs</span>
          <div class="mt-1 space-y-1">
            <a href="#/dashboard" class="block px-3 py-2 rounded-md text-sm font-medium text-accent hover:bg-surface-hover">Mission Control Dashboard</a>
            <a href="#/reports" class="block px-3 py-2 rounded-md text-sm font-medium text-content-secondary hover:bg-surface-hover">Automated Reports</a>
            <a href="#/technology" class="block px-3 py-2 rounded-md text-sm font-medium text-content-secondary hover:bg-surface-hover">Documentation & Pipeline</a>
            <a href="#/about" class="block px-3 py-2 rounded-md text-sm font-medium text-content-secondary hover:bg-surface-hover">Research & Failure Modes</a>
            ${user ? `
              <a href="#/settings" class="block px-3 py-2 rounded-md text-sm font-medium text-content-secondary hover:bg-surface-hover">System Settings</a>
              ${user.role === 'ROLE_ADMIN' ? `<a href="#/admin" class="block px-3 py-2 rounded-md text-sm font-medium text-accent hover:bg-surface-hover">Admin Operations</a>` : ''}
            ` : ''}
          </div>
        </div>
      </div>
    </nav>
  `;
}
