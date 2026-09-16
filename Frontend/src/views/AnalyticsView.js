import { api } from '../services/api.js';
import { renderSidebar } from '../components/Sidebar.js';
import { createDistributionChart } from '../services/charts.js';

export async function renderAnalyticsView() {
  const analytics = await api.getAnalyticsSummary();
  const stations = await api.getStations();

  const container = document.createElement('div');
  container.className = 'flex-1 flex w-full min-h-[calc(100vh-4rem)]';

  container.innerHTML = `
    ${renderSidebar('/analytics')}

    <div class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aeris-850 pb-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">Meteorological Analytics & Longitudinal Trends</h1>
          <p class="text-xs text-slate-400 mt-0.5">Statistical distributions, cross-sensor correlations, and network reliability metrics.</p>
        </div>

        <div class="flex items-center space-x-2 font-mono text-xs">
          <span class="p-2 rounded bg-aeris-900 border border-aeris-800 text-cyan-400 font-bold">WMO QUALITY: ${analytics.networkHealthPercentage}%</span>
        </div>
      </div>

      <!-- Anomaly Distribution Charts Grid (2 columns) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Parameter Distribution Chart -->
        <div class="atmospheric-card p-5 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-aeris-800">
            <div>
              <h3 class="text-sm font-bold text-white">Anomalies by Atmospheric Parameter</h3>
              <span class="text-xs text-slate-400">Total detected incidents grouped by parameter channel</span>
            </div>
            <span class="text-xs font-mono text-cyan-400">HISTOGRAM</span>
          </div>

          <div class="w-full h-[240px]">
            <canvas id="chart-by-param"></canvas>
          </div>
        </div>

        <!-- Anomaly Type Distribution Chart -->
        <div class="atmospheric-card p-5 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-aeris-800">
            <div>
              <h3 class="text-sm font-bold text-white">Anomalies by Failure Classification</h3>
              <span class="text-xs text-slate-400">Spike vs Step Change vs Flatline Persistence</span>
            </div>
            <span class="text-xs font-mono text-amber-400">CLASSIFICATION</span>
          </div>

          <div class="w-full h-[240px]">
            <canvas id="chart-by-type"></canvas>
          </div>
        </div>

      </div>

      <!-- Station Reliability Score Table -->
      <div class="atmospheric-card p-5 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-aeris-800">
          <h3 class="text-sm font-bold text-white">Station Telemetry Reliability & Health Index</h3>
          <span class="text-xs font-mono text-slate-400">6 AWS STATIONS MONITORED</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-aeris-800 font-mono text-slate-400 text-[11px]">
                <th class="pb-2">STATION CODE</th>
                <th class="pb-2">NAME</th>
                <th class="pb-2">REGION</th>
                <th class="pb-2 font-mono">BATTERY</th>
                <th class="pb-2 font-mono">ANOMALY COUNT</th>
                <th class="pb-2 font-mono">QUALITY INDEX</th>
                <th class="pb-2">HEALTH STATUS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-aeris-850">
              ${stations.map(st => {
                const score = st.status === 'ONLINE' ? 98.5 : (st.status === 'DEGRADED' ? 72.0 : 40.0);
                return `
                  <tr class="hover:bg-aeris-900/40">
                    <td class="py-3 font-mono font-bold text-cyan-400">${st.stationCode}</td>
                    <td class="py-3 font-medium text-slate-200">${st.name}</td>
                    <td class="py-3 text-slate-400">${st.region}</td>
                    <td class="py-3 font-mono text-emerald-400">${st.batteryLevel}%</td>
                    <td class="py-3 font-mono font-bold ${st.activeAnomalyCount > 0 ? 'text-amber-400' : 'text-slate-400'}">${st.activeAnomalyCount}</td>
                    <td class="py-3 font-mono font-bold ${score > 90 ? 'text-emerald-400' : 'text-amber-400'}">${score}%</td>
                    <td class="py-3">
                      <span class="${st.status === 'ONLINE' ? 'badge-online' : 'badge-degraded'}">
                        ${st.status}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  // Attach Charts
  setTimeout(() => {
    const canvasParam = container.querySelector('#chart-by-param');
    const canvasType = container.querySelector('#chart-by-type');

    if (canvasParam && analytics.anomaliesByParameter) {
      createDistributionChart(canvasParam, analytics.anomaliesByParameter, 'By Parameter', '#06B6D4');
    }
    if (canvasType && analytics.anomaliesByType) {
      createDistributionChart(canvasType, analytics.anomaliesByType, 'By Type', '#F59E0B');
    }
  }, 50);

  return container;
}
