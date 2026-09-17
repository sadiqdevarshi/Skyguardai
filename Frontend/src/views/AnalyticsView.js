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
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-content-primary tracking-tight">Meteorological Analytics & Longitudinal Trends</h1>
          <p class="text-xs text-content-secondary mt-0.5">Statistical distributions, cross-sensor correlations, and network reliability metrics.</p>
        </div>

        <div class="flex items-center space-x-2 font-mono text-xs">
          <span class="p-2 rounded-lg bg-subtle border border-border text-content-secondary">
            WMO QUALITY: <strong class="text-content-primary tabular-nums font-semibold">${analytics.networkHealthPercentage}%</strong>
          </span>
        </div>
      </div>

      <!-- Anomaly Distribution Charts Grid (2 columns) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Parameter Distribution Chart -->
        <div class="atmospheric-card p-5 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-border">
            <div>
              <h3 class="text-sm font-bold text-content-primary">Anomalies by Atmospheric Parameter</h3>
              <span class="text-xs text-content-muted">Total detected incidents grouped by parameter channel</span>
            </div>
            <span class="text-xs font-mono text-content-muted font-medium">HISTOGRAM</span>
          </div>

          <div class="w-full h-[240px]">
            <canvas id="chart-by-param"></canvas>
          </div>
        </div>

        <!-- Anomaly Type Distribution Chart -->
        <div class="atmospheric-card p-5 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-border">
            <div>
              <h3 class="text-sm font-bold text-content-primary">Anomalies by Failure Classification</h3>
              <span class="text-xs text-content-muted">Spike vs Step Change vs Flatline Persistence</span>
            </div>
            <span class="text-xs font-mono text-content-muted font-medium">CLASSIFICATION</span>
          </div>

          <div class="w-full h-[240px]">
            <canvas id="chart-by-type"></canvas>
          </div>
        </div>

      </div>

      <!-- Station Reliability Score Table -->
      <div class="atmospheric-card p-5 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-border">
          <h3 class="text-sm font-bold text-content-primary">Station Telemetry Reliability & Health Index</h3>
          <span class="text-xs font-mono text-content-muted">6 AWS STATIONS MONITORED</span>
        </div>

        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Station Code</th>
                <th>Name</th>
                <th>Region</th>
                <th>Battery</th>
                <th>Anomaly Count</th>
                <th>Quality Index</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              ${stations.map(st => {
                const score = st.status === 'ONLINE' ? 98.5 : (st.status === 'DEGRADED' ? 72.0 : 40.0);
                const sClass = st.status === 'ONLINE' ? 'status-online' : (st.status === 'DEGRADED' ? 'status-warning' : 'status-critical');
                return `
                  <tr>
                    <td class="font-mono font-medium text-content-primary">${st.stationCode}</td>
                    <td class="font-medium text-content-primary">${st.name}</td>
                    <td class="text-content-secondary">${st.region}</td>
                    <td class="font-mono text-content-primary tabular-nums">${st.batteryLevel}%</td>
                    <td class="font-mono text-content-primary tabular-nums">${st.activeAnomalyCount}</td>
                    <td class="font-mono text-content-primary tabular-nums font-medium">${score}%</td>
                    <td>
                      <span class="${sClass}">
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
      createDistributionChart(canvasParam, analytics.anomaliesByParameter, 'By Parameter');
    }
    if (canvasType && analytics.anomaliesByType) {
      createDistributionChart(canvasType, analytics.anomaliesByType, 'By Type');
    }
  }, 50);

  return container;
}

