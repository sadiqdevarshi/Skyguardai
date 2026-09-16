import { renderHomeView } from './views/HomeView.js';
import { renderAboutView } from './views/AboutView.js';
import { renderTechnologyView } from './views/TechnologyView.js';
import { renderMonitoringView } from './views/MonitoringView.js';
import { renderLoginView } from './views/LoginView.js';
import { renderRegisterView } from './views/RegisterView.js';
import { renderDashboardView } from './views/DashboardView.js';
import { renderStationsView } from './views/StationsView.js';
import { renderStationDetailView } from './views/StationDetailView.js';
import { renderLiveView } from './views/LiveView.js';
import { renderAnomaliesView } from './views/AnomaliesView.js';
import { renderAnomalyDetailView } from './views/AnomalyDetailView.js';
import { renderAlertsView } from './views/AlertsView.js';
import { renderAnalyticsView } from './views/AnalyticsView.js';
import { renderReportsView } from './views/ReportsView.js';
import { renderSettingsView } from './views/SettingsView.js';
import { renderAdminView } from './views/AdminView.js';
import { renderNavbar } from './components/Navbar.js';
import { renderFooter } from './components/Footer.js';

let currentCleanup = null;

export async function navigate(hash) {
  const path = hash.replace(/^#/, '') || '/';
  const viewContainer = document.getElementById('view-container');
  const navbarContainer = document.getElementById('navbar-container');
  const footerContainer = document.getElementById('footer-container');

  if (!viewContainer) return;

  // Cleanup active 3D scenes or animation frames if any
  if (currentCleanup && typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  // Update Navbar & Footer
  if (navbarContainer) {
    navbarContainer.innerHTML = renderNavbar();
    attachNavbarEvents();
  }
  if (footerContainer) {
    // Show footer on public and info pages, hide/compact on operational if needed
    footerContainer.innerHTML = renderFooter();
  }

  // Route Dispatcher
  viewContainer.innerHTML = '<div class="flex items-center justify-center min-h-[50vh]"><span class="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></span></div>';

  try {
    let viewElement = null;

    if (path === '/' || path === '') {
      viewElement = await renderHomeView();
    } else if (path === '/about') {
      viewElement = await renderAboutView();
    } else if (path === '/technology') {
      viewElement = await renderTechnologyView();
    } else if (path === '/monitoring') {
      viewElement = await renderMonitoringView();
    } else if (path === '/login') {
      viewElement = await renderLoginView();
    } else if (path === '/register') {
      viewElement = await renderRegisterView();
    } else if (path === '/dashboard') {
      viewElement = await renderDashboardView();
    } else if (path === '/stations') {
      viewElement = await renderStationsView();
    } else if (path.startsWith('/stations/')) {
      const stationId = path.split('/')[2];
      viewElement = await renderStationDetailView(stationId);
    } else if (path === '/live') {
      viewElement = await renderLiveView();
    } else if (path === '/anomalies') {
      viewElement = await renderAnomaliesView();
    } else if (path.startsWith('/anomalies/')) {
      const anomalyId = path.split('/')[2];
      viewElement = await renderAnomalyDetailView(anomalyId);
    } else if (path === '/alerts') {
      viewElement = await renderAlertsView();
    } else if (path === '/analytics') {
      viewElement = await renderAnalyticsView();
    } else if (path === '/reports') {
      viewElement = await renderReportsView();
    } else if (path === '/settings') {
      viewElement = await renderSettingsView();
    } else if (path === '/admin') {
      viewElement = await renderAdminView();
    } else {
      viewElement = await renderHomeView();
    }

    viewContainer.innerHTML = '';
    if (viewElement) {
      viewContainer.appendChild(viewElement);
      if (viewElement.cleanup) {
        currentCleanup = viewElement.cleanup;
      }
    }

    window.scrollTo(0, 0);
  } catch (error) {
    console.error('[Aerisence Router] Route render error:', error);
    viewContainer.innerHTML = `
      <div class="max-w-md mx-auto my-20 atmospheric-card p-6 text-center space-y-4">
        <h2 class="text-base font-bold text-rose-400">Navigation Exception</h2>
        <p class="text-xs text-slate-300 font-mono">${error.message}</p>
        <a href="#/" class="btn-primary text-xs px-4 py-2">Return to Safety (Home)</a>
      </div>
    `;
  }
}

function attachNavbarEvents() {
  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      import('./services/auth.js').then(({ auth }) => {
        auth.logout();
        navigate('#/');
      });
    };
  }

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.onclick = () => {
      mobileMenu.classList.toggle('hidden');
    };
  }
}
