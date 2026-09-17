import { auth } from '../services/auth.js';

export function renderSidebar(activeRoute = '/dashboard') {
  const user = auth.getUser();

  const links = [
    { href: '#/dashboard', label: 'Mission Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '#/monitoring', label: 'Monitoring Matrix', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { href: '#/stations', label: 'Weather Stations', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { href: '#/live', label: 'Live 3D Stream', icon: 'M13 10V3L4 14h7v7l9-11h-7z', badge: 'LIVE' },
    { href: '#/anomalies', label: 'Anomaly Engine', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { href: '#/alerts', label: 'Alert Triage', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { href: '#/analytics', label: 'Analytics & Trends', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
    { href: '#/reports', label: 'Report Builder', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { href: '#/settings', label: 'Configuration', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];

  if (user && user.role === 'ROLE_ADMIN') {
    links.push({
      href: '#/admin',
      label: 'Admin Operations',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      badge: 'ROOT'
    });
  }

  return `
    <aside class="w-64 bg-surface border-r border-border p-4 flex flex-col justify-between hidden lg:flex shrink-0 transition-colors duration-200">
      <div class="space-y-6">
        
        <!-- Section: Navigation -->
        <div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-content-faint px-3">WORKSPACE</span>
          <nav class="mt-2 space-y-1">
            ${links.map(link => {
              const isActive = activeRoute.startsWith(link.href.replace('#', ''));
              return `
                <a href="${link.href}" class="flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${isActive ? 'bg-accent-subtle text-accent font-semibold border border-accent/20' : 'text-content-secondary hover:text-content-primary hover:bg-surface-hover'}">
                  <div class="flex items-center space-x-2.5">
                    <svg class="w-4 h-4 ${isActive ? 'text-accent' : 'text-content-muted'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="${link.icon}"></path>
                    </svg>
                    <span>${link.label}</span>
                  </div>
                  ${link.badge ? `
                    <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">${link.badge}</span>
                  ` : ''}
                </a>
              `;
            }).join('')}
          </nav>
        </div>

        <!-- Section: Telemetry State Card -->
        <div class="p-3.5 rounded-lg bg-subtle border border-border text-xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-medium text-content-primary">Station Ingestion</span>
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p class="text-[11px] text-content-muted leading-snug">6 active AWS nodes streaming barometric, thermal & humidity telemetry.</p>
          <div class="pt-1 border-t border-border flex justify-between font-mono text-[10px] text-content-muted">
            <span>PING: 14ms</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-semibold">VERIFIED: 100%</span>
          </div>
        </div>

      </div>

      <!-- User footer -->
      <div class="pt-4 border-t border-border flex items-center justify-between text-xs">
        <div class="flex items-center space-x-2">
          <div class="w-7 h-7 rounded-full bg-accent text-content-inverted flex items-center justify-center font-bold text-[11px]">
            ${user ? (user.username || 'U').charAt(0).toUpperCase() : 'G'}
          </div>
          <div class="flex flex-col">
            <span class="text-content-primary font-medium text-[11px]">${user ? user.fullName || user.username : 'Guest User'}</span>
            <span class="text-[9px] font-mono text-accent font-semibold">${user ? user.role.replace('ROLE_', '') : 'OBSERVER'}</span>
          </div>
        </div>
      </div>
    </aside>
  `;
}
