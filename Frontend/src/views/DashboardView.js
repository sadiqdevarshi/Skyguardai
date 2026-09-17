import { api } from '../services/api.js';
import { renderSidebar } from '../components/Sidebar.js';
import { createTelemetryChart } from '../services/charts.js';

export async function renderDashboardView() {
  const [stations, anomalies, alerts, analytics] = await Promise.all([
    api.getStations(),
    api.getAnomalies({ status: 'OPEN' }),
    api.getAlerts(),
    api.getAnalyticsSummary()
  ]);

  const container = document.createElement('div');
  container.className = 'flex-1 flex w-full min-h-[calc(100vh-4rem)]';

  const unackAlerts = alerts.filter(a => !a.acknowledged);

  container.innerHTML = `
    <!-- Sidebar -->
    ${renderSidebar('/dashboard')}

    <!-- Main Operational Workspace -->
    <div class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-xl sm:text-2xl font-bold text-content-primary tracking-tight">Mission Control Dashboard</h1>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">TELEMETRY SYNCED</span>
          </div>
          <p class="text-xs text-content-secondary mt-0.5">Real-time Automatic Weather Station health and anomaly diagnostics.</p>
        </div>

        <div class="flex items-center space-x-2">
          <a href="#/live" class="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live 3D View</span>
          </a>
          <a href="#/reports" class="btn-primary text-xs px-3.5 py-1.5">Generate Report</a>
        </div>
      </div>

      <!-- KPI Stat Cards Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <!-- Total Stations -->
        <div class="atmospheric-card p-4 space-y-1">
          <div class="flex items-center justify-between text-content-muted">
            <span class="text-[10px] font-mono uppercase tracking-wider">ONLINE STATIONS</span>
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div class="text-2xl font-mono font-bold text-content-primary">${analytics.onlineStations} <span class="text-xs font-normal text-content-muted">/ ${analytics.totalStations}</span></div>
          <div class="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">${analytics.degradedStations} Degraded • ${analytics.offlineStations} Offline</div>
        </div>

        <!-- Network Health Index -->
        <div class="atmospheric-card p-4 space-y-1">
          <div class="flex items-center justify-between text-content-muted">
            <span class="text-[10px] font-mono uppercase tracking-wider">NETWORK HEALTH</span>
            <span class="text-[10px] font-mono text-accent font-semibold">WMO-QCI</span>
          </div>
          <div class="text-2xl font-mono font-bold text-accent">${analytics.networkHealthPercentage}%</div>
          <div class="text-[11px] text-content-muted font-mono">Data Quality Index</div>
        </div>

        <!-- Active Open Anomalies -->
        <div class="atmospheric-card p-4 space-y-1">
          <div class="flex items-center justify-between text-content-muted">
            <span class="text-[10px] font-mono uppercase tracking-wider">ACTIVE ANOMALIES</span>
            <span class="w-2 h-2 rounded-full ${analytics.openAnomalies > 0 ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}"></span>
          </div>
          <div class="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400">${analytics.openAnomalies}</div>
          <div class="text-[11px] font-mono text-content-muted">${analytics.criticalAnomalies} Critical • ${analytics.openAnomalies - analytics.criticalAnomalies} Warning</div>
        </div>

        <!-- Unacknowledged Alerts -->
        <div class="atmospheric-card p-4 space-y-1">
          <div class="flex items-center justify-between text-content-muted">
            <span class="text-[10px] font-mono uppercase tracking-wider">PENDING ALERTS</span>
            <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </div>
          <div class="text-2xl font-mono font-bold ${unackAlerts.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-content-primary'}">${unackAlerts.length}</div>
          <div class="text-[11px] text-content-muted font-mono">Requires Operator Triage</div>
        </div>

      </div>

      <!-- Main Operational Charts & Telemetry Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Primary Network Telemetry Chart (2 Cols) -->
        <div class="lg:col-span-2 atmospheric-card p-5 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-border">
            <div>
              <h3 class="text-sm font-bold text-content-primary">Representative Station Telemetry (Alpine AWS-101)</h3>
              <span class="text-xs text-content-muted">24-hour diurnal cycle multi-parameter tracking</span>
            </div>
            <div class="flex items-center space-x-2 text-[11px] font-mono">
              <span class="text-amber-600 dark:text-amber-400 font-medium">● Temp</span>
              <span class="text-sky-600 dark:text-sky-400 font-medium">● Pressure</span>
              <span class="text-blue-600 dark:text-blue-400 font-medium">● Humidity</span>
            </div>
          </div>

          <div class="w-full h-[280px]">
            <canvas id="dashboard-telemetry-chart"></canvas>
          </div>
        </div>

        <!-- Right Quick Triage Panel -->
        <div class="atmospheric-card p-5 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-border">
            <h3 class="text-sm font-bold text-content-primary">Critical Incident Feed</h3>
            <a href="#/anomalies" class="text-xs text-accent hover:underline font-medium">View All →</a>
          </div>

          <div class="space-y-3">
            ${anomalies.length > 0 ? anomalies.slice(0, 3).map(anom => `
              <div class="p-3.5 rounded-lg bg-subtle border border-border space-y-2 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-accent">${anom.stationCode}</span>
                  <span class="${anom.severity === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}">${anom.severity}</span>
                </div>
                <div class="font-semibold text-content-primary">${anom.parameter}: ${anom.anomalyType}</div>
                <p class="text-[11px] text-content-secondary leading-snug line-clamp-2">${anom.rootCauseExplanation}</p>
                <div class="pt-1 flex justify-between items-center text-[10px] font-mono text-content-muted">
                  <span>Val: <strong class="text-content-primary">${anom.observedValue}</strong></span>
                  <a href="#/anomalies/${anom.id}" class="text-accent hover:underline font-semibold">Investigate →</a>
                </div>
              </div>
            `).join('') : `
              <div class="p-6 text-center text-xs text-content-muted font-mono">
                No active anomalies detected across network.
              </div>
            `}
          </div>
        </div>

      </div>

      <!-- Station Network Summary Table -->
      <div class="atmospheric-card p-5 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-border">
          <h3 class="text-sm font-bold text-content-primary">Weather Stations Ingestion Status</h3>
          <a href="#/stations" class="text-xs text-accent hover:underline font-medium">Manage Stations →</a>
        </div>

        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Station Name</th>
                <th>Region</th>
                <th>Status</th>
                <th>Temp</th>
                <th>Pressure</th>
                <th>Humidity</th>
                <th class="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              ${stations.map(st => `
                <tr>
                  <td class="font-mono font-bold text-accent">${st.stationCode}</td>
                  <td class="font-medium text-content-primary">${st.name}</td>
                  <td>${st.region}</td>
                  <td>
                    <span class="${st.status === 'ONLINE' ? 'badge-online' : (st.status === 'DEGRADED' ? 'badge-degraded' : 'badge-offline')}">
                      ${st.status}
                    </span>
                  </td>
                  <td class="font-mono font-semibold text-amber-600 dark:text-amber-400">${st.currentTemperature != null ? st.currentTemperature + '°C' : '--'}</td>
                  <td class="font-mono font-semibold text-sky-600 dark:text-sky-400">${st.currentPressure != null ? st.currentPressure + ' hPa' : '--'}</td>
                  <td class="font-mono font-semibold text-blue-600 dark:text-blue-400">${st.currentHumidity != null ? st.currentHumidity + '%' : '--'}</td>
                  <td class="text-right">
                    <a href="#/stations/${st.id}" class="text-xs text-accent hover:underline font-semibold">Telemetry →</a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  // Render Telemetry Chart on Mount
  setTimeout(async () => {
    const canvas = container.querySelector('#dashboard-telemetry-chart');
    if (canvas) {
      const stationDetail = await api.getStationDetail(1);
      if (stationDetail && stationDetail.recentHistory) {
        createTelemetryChart(canvas, stationDetail.recentHistory.slice(-24).reverse());
      }
    }
  }, 50);

  return container;
}
