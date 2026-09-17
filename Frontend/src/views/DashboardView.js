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
            <span class="status-online font-mono text-[10px]">SYNCED</span>
          </div>
          <p class="text-xs text-content-secondary mt-0.5">Real-time Automatic Weather Station health and anomaly diagnostics.</p>
        </div>

        <div class="flex items-center space-x-2">
          <a href="#/live" class="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Live 3D View</span>
          </a>
          <a href="#/reports" class="btn-primary text-xs px-3.5 py-1.5">Generate Report</a>
        </div>
      </div>

      <!-- KPI Stat Cards Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <!-- Total Stations -->
        <div class="atmospheric-card p-4 space-y-1">
          <div class="flex items-center justify-between text-content-muted">
            <span class="text-[10px] font-mono uppercase tracking-wider">ONLINE STATIONS</span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <div class="flex items-baseline space-x-1 font-mono">
            <span class="text-2xl font-bold text-content-primary tabular-nums">${analytics.onlineStations}</span>
            <span class="text-xs text-content-muted font-normal">/ ${analytics.totalStations}</span>
          </div>
          <div class="text-[11px] font-mono text-content-muted">${analytics.degradedStations} Degraded • ${analytics.offlineStations} Offline</div>
        </div>

        <!-- Network Health Index -->
        <div class="atmospheric-card p-4 space-y-1">
          <div class="flex items-center justify-between text-content-muted">
            <span class="text-[10px] font-mono uppercase tracking-wider">NETWORK HEALTH</span>
            <span class="text-[10px] font-mono text-content-muted">WMO-QCI</span>
          </div>
          <div class="flex items-baseline space-x-1 font-mono">
            <span class="text-2xl font-bold text-content-primary tabular-nums">${analytics.networkHealthPercentage}</span>
            <span class="text-xs text-content-muted font-normal">%</span>
          </div>
          <div class="text-[11px] text-content-muted font-mono">Data Quality Index</div>
        </div>

        <!-- Active Open Anomalies -->
        <div class="atmospheric-card p-4 space-y-1">
          <div class="flex items-center justify-between text-content-muted">
            <span class="text-[10px] font-mono uppercase tracking-wider">ACTIVE ANOMALIES</span>
            <span class="w-1.5 h-1.5 rounded-full ${analytics.openAnomalies > 0 ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
          </div>
          <div class="flex items-baseline space-x-1 font-mono">
            <span class="text-2xl font-bold ${analytics.openAnomalies > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-content-primary'} tabular-nums">${analytics.openAnomalies}</span>
            <span class="text-xs text-content-muted font-normal">events</span>
          </div>
          <div class="text-[11px] font-mono text-content-muted">${analytics.criticalAnomalies} Critical • ${analytics.openAnomalies - analytics.criticalAnomalies} Warning</div>
        </div>

        <!-- Unacknowledged Alerts -->
        <div class="atmospheric-card p-4 space-y-1">
          <div class="flex items-center justify-between text-content-muted">
            <span class="text-[10px] font-mono uppercase tracking-wider">PENDING ALERTS</span>
            <span class="w-1.5 h-1.5 rounded-full ${unackAlerts.length > 0 ? 'bg-rose-500' : 'bg-emerald-500'}"></span>
          </div>
          <div class="flex items-baseline space-x-1 font-mono">
            <span class="text-2xl font-bold ${unackAlerts.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-content-primary'} tabular-nums">${unackAlerts.length}</span>
            <span class="text-xs text-content-muted font-normal">queued</span>
          </div>
          <div class="text-[11px] text-content-muted font-mono">Requires Operator Triage</div>
        </div>

      </div>

      <!-- Main Operational Charts & Telemetry Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <!-- Primary Network Telemetry Chart (2 Cols) -->
        <div class="lg:col-span-2 atmospheric-card p-5 space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-border">
            <div>
              <h3 class="text-sm font-semibold text-content-primary">Representative Station Telemetry (Alpine AWS-101)</h3>
              <span class="text-xs text-content-muted">24-hour diurnal multi-parameter observation history</span>
            </div>
            <div class="flex items-center space-x-3 text-[11px] font-mono text-content-muted">
              <span>— Temp</span>
              <span>- - Pressure</span>
              <span>·· Humidity</span>
            </div>
          </div>

          <div class="w-full h-[280px]">
            <canvas id="dashboard-telemetry-chart"></canvas>
          </div>
        </div>

        <!-- Right Quick Triage Panel -->
        <div class="atmospheric-card p-5 space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-border">
            <h3 class="text-sm font-semibold text-content-primary">Active Incident Feed</h3>
            <a href="#/anomalies" class="text-xs text-accent hover:underline font-medium">View All →</a>
          </div>

          <div class="space-y-2.5">
            ${anomalies.length > 0 ? anomalies.slice(0, 3).map(anom => `
              <div class="p-3 rounded bg-subtle border border-border space-y-1.5 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-content-primary">${anom.stationCode}</span>
                  <span class="${anom.severity === 'CRITICAL' ? 'status-critical' : 'status-warning'}">${anom.severity}</span>
                </div>
                <div class="font-medium text-content-primary">${anom.parameter}: ${anom.anomalyType}</div>
                <p class="text-[11px] text-content-secondary leading-snug line-clamp-2">${anom.rootCauseExplanation}</p>
                <div class="pt-1 flex justify-between items-center text-[10px] font-mono text-content-muted">
                  <span>Val: <strong class="text-content-primary tabular-nums">${anom.observedValue}</strong></span>
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
      <div class="atmospheric-card p-5 space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-border">
          <h3 class="text-sm font-semibold text-content-primary">Weather Stations Ingestion Status</h3>
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
                  <td class="font-mono font-bold text-content-secondary">${st.stationCode}</td>
                  <td class="font-medium text-content-primary">${st.name}</td>
                  <td class="text-content-muted">${st.region}</td>
                  <td>
                    <span class="${st.status === 'ONLINE' ? 'status-online' : (st.status === 'DEGRADED' ? 'status-degraded' : 'status-offline')}">
                      ${st.status}
                    </span>
                  </td>
                  <td class="font-mono text-content-primary tabular-nums">${st.currentTemperature != null ? st.currentTemperature + '°C' : '--'}</td>
                  <td class="font-mono text-content-primary tabular-nums">${st.currentPressure != null ? st.currentPressure + ' hPa' : '--'}</td>
                  <td class="font-mono text-content-primary tabular-nums">${st.currentHumidity != null ? st.currentHumidity + '%' : '--'}</td>
                  <td class="text-right">
                    <a href="#/stations/${st.id}" class="text-xs text-accent hover:underline font-medium">Telemetry →</a>
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
