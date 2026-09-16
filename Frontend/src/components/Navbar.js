import { auth } from '../services/auth.js';

export function renderNavbar() {
  const user = auth.getUser();
  const currentPath = window.location.hash.slice(1) || '/';

  const isOperationalRoute = [
    '/dashboard', '/stations', '/monitoring', '/live',
    '/anomalies', '/alerts', '/analytics', '/reports', '/settings', '/admin'
  ].some(route => currentPath.startsWith(route));

  return `
    <nav class="bg-aeris-950/80 backdrop-blur-xl border-b border-aeris-800/80 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Brand Logo & Identity -->
          <div class="flex items-center space-x-3">
            <a href="#/" class="flex items-center space-x-3 group">
              <!-- Official Aerisence Precision SVG Logo -->
              <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-700 flex items-center justify-center p-1.5 shadow-glow-cyan">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-aeris-950">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 3"></circle>
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-lg tracking-wider text-slate-100 font-sans uppercase">Aerisence</span>
                <span class="text-[10px] font-mono tracking-widest text-cyan-400 -mt-1">METEOROLOGICAL OBS</span>
              </div>
            </a>
          </div>

          <!-- Desktop Navigation Links -->
          <div class="hidden md:flex items-center space-x-1">
            <a href="#/" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${currentPath === '/' ? 'text-cyan-400 bg-aeris-900' : 'text-slate-300 hover:text-white hover:bg-aeris-900/50'}">Home</a>
            <a href="#/about" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${currentPath === '/about' ? 'text-cyan-400 bg-aeris-900' : 'text-slate-300 hover:text-white hover:bg-aeris-900/50'}">About</a>
            <a href="#/technology" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${currentPath === '/technology' ? 'text-cyan-400 bg-aeris-900' : 'text-slate-300 hover:text-white hover:bg-aeris-900/50'}">Technology</a>
            <a href="#/monitoring" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${currentPath === '/monitoring' ? 'text-cyan-400 bg-aeris-900' : 'text-slate-300 hover:text-white hover:bg-aeris-900/50'}">Monitoring</a>
            <a href="#/live" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${currentPath === '/live' ? 'text-cyan-400 bg-aeris-900' : 'text-slate-300 hover:text-white hover:bg-aeris-900/50'}">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live 3D</span>
            </a>
            
            <div class="h-4 w-[1px] bg-aeris-800 mx-2"></div>
            
            <a href="#/dashboard" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${currentPath.startsWith('/dashboard') ? 'text-cyan-400 bg-aeris-900' : 'text-slate-300 hover:text-white hover:bg-aeris-900/50'}">Dashboard</a>
            <a href="#/stations" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${currentPath.startsWith('/stations') ? 'text-cyan-400 bg-aeris-900' : 'text-slate-300 hover:text-white hover:bg-aeris-900/50'}">Stations</a>
            <a href="#/anomalies" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${currentPath.startsWith('/anomalies') ? 'text-cyan-400 bg-aeris-900' : 'text-slate-300 hover:text-white hover:bg-aeris-900/50'}">Anomalies</a>
            <a href="#/analytics" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${currentPath.startsWith('/analytics') ? 'text-cyan-400 bg-aeris-900' : 'text-slate-300 hover:text-white hover:bg-aeris-900/50'}">Analytics</a>
          </div>

          <!-- User Session / Auth Controls -->
          <div class="flex items-center space-x-3">
            ${user ? `
              <div class="flex items-center space-x-2">
                <a href="#/alerts" class="relative p-2 rounded-lg bg-aeris-900 hover:bg-aeris-800 text-slate-300 hover:text-white transition-colors" title="Alerts">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                  <span class="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
                </a>
                <div class="flex items-center space-x-2 pl-2">
                  <div class="flex flex-col text-right">
                    <span class="text-xs font-medium text-slate-200">${user.fullName || user.username}</span>
                    <span class="text-[10px] font-mono text-cyan-400">${user.role.replace('ROLE_', '')}</span>
                  </div>
                  <a href="#/settings" class="w-8 h-8 rounded-full bg-cyan-900/40 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-300 hover:border-cyan-400 transition-colors">
                    ${(user.username || 'U').charAt(0).toUpperCase()}
                  </a>
                </div>
                ${user.role === 'ROLE_ADMIN' ? `
                  <a href="#/admin" class="btn-secondary text-xs px-2.5 py-1">Admin</a>
                ` : ''}
                <button id="nav-logout-btn" class="text-slate-400 hover:text-red-400 p-1.5 transition-colors" title="Logout">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
              </div>
            ` : `
              <div class="flex items-center space-x-2">
                <a href="#/login" class="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors">Sign In</a>
                <a href="#/register" class="btn-primary text-xs px-3.5 py-1.5">Register Station</a>
              </div>
            `}

            <!-- Mobile menu button -->
            <button id="mobile-menu-toggle" class="md:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-aeris-900">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div id="mobile-menu" class="hidden md:hidden border-t border-aeris-800 bg-aeris-950 px-4 pt-2 pb-4 space-y-1">
        <a href="#/" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-aeris-900">Home</a>
        <a href="#/about" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-aeris-900">About</a>
        <a href="#/technology" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-aeris-900">Technology</a>
        <a href="#/monitoring" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-aeris-900">Monitoring</a>
        <a href="#/live" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-aeris-900">Live 3D Network</a>
        <a href="#/dashboard" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-aeris-900">Dashboard</a>
        <a href="#/stations" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-aeris-900">Stations</a>
        <a href="#/anomalies" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-aeris-900">Anomalies</a>
        <a href="#/analytics" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-aeris-900">Analytics</a>
        <a href="#/reports" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-aeris-900">Reports</a>
        ${user ? `
          <a href="#/settings" class="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-aeris-900">Settings</a>
          ${user.role === 'ROLE_ADMIN' ? `<a href="#/admin" class="block px-3 py-2 rounded-md text-sm font-medium text-cyan-400 hover:bg-aeris-900">Admin Operations</a>` : ''}
        ` : ''}
      </div>
    </nav>
  `;
}
