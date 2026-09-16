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
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aeris-850 pb-4">
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">Mission Control Dashboard</h1>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">TELEMETRY SYNCED</span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">Real-time Automatic Weather Station health and anomaly diagnostics.</p>
        </div>

        <div class="flex items-center space-x-2">
          <a href="#/live" class="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live 3D View</span>
          </a>
          <a href="#/reports" class="btn-primary text-xs px-3.5 py-1.5">Generate Report</a>
        </div>
      </div>

      <!-- KPI Stat Cards Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <!-- Total Stations -->
        <div class="atmospheric-card p-4 space-y-1">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[10px] font-mono uppercase">ONLINE STATIONS</span>
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div class="text-2xl font-mono font-bold text-white">${analytics.onlineStations} <span class="text-xs font-normal text-slate-400">/ ${analytics.totalStations}</span></div>
          <div class="text-[11px] font-mono text-emerald-400">${analytics.degradedStations} Degraded • ${analytics.offlineStations} Offline</div>
        </div>

        <!-- Network Health Index -->
        <div class="atmospheric-card p-4 space-y-1">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[10px] font-mono uppercase">NETWORK HEALTH</span>
            <span class="text-[10px] font-mono text-cyan-400">WMO-QCI</span>
          </div>
          <div class="text-2xl font-mono font-bold text-cyan-400">${analytics.networkHealthPercentage}%</div>
          <div class="text-[11px] text-slate-400 font-mono">Data Quality Index</div>
        </div>

        <!-- Active Open Anomalies -->
        <div class="atmospheric-card p-4 space-y-1">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[10px] font-mono uppercase">ACTIVE ANOMALIES</span>
            <span class="w-2 h-2 rounded-full ${analytics.openAnomalies > 0 ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}"></span>
          </div>
          <div class="text-2xl font-mono font-bold text-amber-400">${analytics.openAnomalies}</div>
          <div class="text-[11px] font-mono text-slate-400">${analytics.criticalAnomalies} Critical • ${analytics.openAnomalies - analytics.criticalAnomalies} Warning</div>
        </div>

        <!-- Unacknowledged Alerts -->
        <div class="atmospheric-card p-4 space-y-1">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[10px] font-mono uppercase">PENDING ALERTS</span>
            <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </div>
          <div class="text-2xl font-mono font-bold ${unackAlerts.length > 0 ? 'text-red-400' : 'text-slate-100'}">${unackAlerts.length}</div>
          <div class="text-[11px] text-slate-400 font-mono">Requires Operator Triage</div>
        </div>

      </div>

      <!-- Main Operational Charts & Telemetry Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Primary Network Telemetry Chart (2 Cols) -->
        <div class="lg:col-span-2 atmospheric-card p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-white">Representative Station Telemetry (Alpine AWS-101)</h3>
              <span class="text-xs text-slate-400">24-hour diurnal cycle multi-parameter tracking</span>
            </div>
            <div class="flex items-center space-x-2 text-[11px] font-mono">
              <span class="text-amber-400">● Temp</span>
              <span class="text-cyan-400">● Pressure</span>
              <span class="text-blue-400">● Humidity</span>
            </div>
          </div>

          <div class="w-full h-[280px]">
            <canvas id="dashboard-telemetry-chart"></canvas>
          </div>
        </div>

        <!-- Right Quick Triage Panel -->
        <div class="atmospheric-card p-5 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-aeris-800">
            <h3 class="text-sm font-bold text-white">Critical Incident Feed</h3>
            <a href="#/anomalies" class="text-xs text-cyan-400 hover:underline">View All →</a>
          </div>

          <div class="space-y-3">
            ${anomalies.length > 0 ? anomalies.slice(0, 3).map(anom => `
              <div class="p-3 rounded-lg bg-aeris-950/80 border border-aeris-800 space-y-2 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-cyan-400">${anom.stationCode}</span>
                  <span class="${anom.severity === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}">${anom.severity}</span>
                </div>
                <div class="font-medium text-slate-200">${anom.parameter}: ${anom.anomalyType}</div>
                <p class="text-[11px] text-slate-400 leading-snug line-clamp-2">${anom.rootCauseExplanation}</p>
                <div class="pt-1 flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Val: <strong class="text-white">${anom.observedValue}</strong></span>
                  <a href="#/anomalies/${anom.id}" class="text-cyan-400 hover:underline">Investigate →</a>
                </div>
              </div>
            `).join('') : `
              <div class="p-6 text-center text-xs text-slate-400 font-mono">
                No active anomalies detected across network.
              </div>
            `}
          </div>
        </div>

      </div>

      <!-- Station Network Summary Table -->
      <div class="atmospheric-card p-5 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-aeris-800">
          <h3 class="text-sm font-bold text-white">Weather Stations Ingestion Status</h3>
          <a href="#/stations" class="text-xs text-cyan-400 hover:underline">Manage Stations →</a>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-aeris-800 font-mono text-slate-400 text-[11px]">
                <th class="pb-2">CODE</th>
                <th class="pb-2">STATION NAME</th>
                <th class="pb-2">REGION</th>
                <th class="pb-2">STATUS</th>
                <th class="pb-2 font-mono">TEMP</th>
                <th class="pb-2 font-mono">PRESSURE</th>
                <th class="pb-2 font-mono">HUMIDITY</th>
                <th class="pb-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-aeris-850">
              ${stations.map(st => `
                <tr class="hover:bg-aeris-900/40 transition-colors">
                  <td class="py-3 font-mono font-bold text-cyan-400">${st.stationCode}</td>
                  <td class="py-3 font-medium text-slate-200">${st.name}</td>
                  <td class="py-3 text-slate-400">${st.region}</td>
                  <td class="py-3">
                    <span class="${st.status === 'ONLINE' ? 'badge-online' : (st.status === 'DEGRADED' ? 'badge-degraded' : 'badge-offline')}">
                      ${st.status}
                    </span>
                  </td>
                  <td class="py-3 font-mono font-semibold text-amber-400">${st.currentTemperature != null ? st.currentTemperature + '°C' : '--'}</td>
                  <td class="py-3 font-mono font-semibold text-cyan-400">${st.currentPressure != null ? st.currentPressure + ' hPa' : '--'}</td>
                  <td class="py-3 font-mono font-semibold text-blue-400">${st.currentHumidity != null ? st.currentHumidity + '%' : '--'}</td>
                  <td class="py-3 text-right">
                    <a href="#/stations/${st.id}" class="text-xs text-cyan-400 hover:underline">Telemetry →</a>
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
