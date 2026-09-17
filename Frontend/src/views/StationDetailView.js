import { api } from '../services/api.js';
import { renderSidebar } from '../components/Sidebar.js';
import { createTelemetryChart } from '../services/charts.js';

export async function renderStationDetailView(stationId) {
  const station = await api.getStationDetail(stationId || 1);

  const container = document.createElement('div');
  container.className = 'flex-1 flex w-full min-h-[calc(100vh-4rem)]';

  container.innerHTML = `
    ${renderSidebar('/stations')}

    <div class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl">
      
      <!-- Back Breadcrumb & Header -->
      <div class="space-y-2 border-b border-border pb-4">
        <a href="#/stations" class="text-xs text-accent hover:underline inline-flex items-center space-x-1 font-medium">
          <span>← Back to Station Inventory</span>
        </a>
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-3">
              <h1 class="text-2xl font-bold text-content-primary tracking-tight">${station.name}</h1>
              <span class="font-mono text-xs px-2.5 py-0.5 rounded bg-accent-subtle text-accent border border-accent/20 font-semibold">${station.stationCode}</span>
              <span class="${station.status === 'ONLINE' ? 'badge-online' : (station.status === 'DEGRADED' ? 'badge-degraded' : 'badge-offline')}">
                ${station.status}
              </span>
            </div>
            <p class="text-xs text-content-secondary mt-1">${station.region} • Lat: ${station.latitude}, Lon: ${station.longitude} • Elevation: ${station.elevationMeters}m MSL</p>
          </div>

          <div class="flex items-center space-x-3 font-mono text-xs text-content-secondary">
            <span class="p-2 rounded-lg bg-subtle border border-border">Battery: <strong class="text-emerald-600 dark:text-emerald-400 font-semibold">${station.batteryLevel}%</strong></span>
            <span class="p-2 rounded-lg bg-subtle border border-border">Ping: <strong class="text-accent font-semibold">12ms</strong></span>
          </div>
        </div>
      </div>

      <!-- Current Telemetry Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider">CURRENT TEMPERATURE</span>
          <div class="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400">${station.currentTemperature != null ? station.currentTemperature + ' °C' : '--'}</div>
          <div class="text-[10px] text-content-muted font-mono">Transducer: Vaisala Platinum RTD</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider">ATMOSPHERIC PRESSURE</span>
          <div class="text-2xl font-mono font-bold text-sky-600 dark:text-sky-400">${station.currentPressure != null ? station.currentPressure + ' hPa' : '--'}</div>
          <div class="text-[10px] text-content-muted font-mono">Transducer: Setra 278 Barometer</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider">RELATIVE HUMIDITY</span>
          <div class="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">${station.currentHumidity != null ? station.currentHumidity + ' %' : '--'}</div>
          <div class="text-[10px] text-content-muted font-mono">Transducer: Rotronic Capacitive</div>
        </div>
      </div>

      <!-- High-Resolution Telemetry Chart -->
      <div class="atmospheric-card p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
          <div>
            <h3 class="text-sm font-bold text-content-primary">Historical Telemetry Stream (Last 24 Hours)</h3>
            <span class="text-xs text-content-muted">Continuous sampling synchronized to UTC meteorological cycles</span>
          </div>
          <div class="flex items-center space-x-3 font-mono text-xs">
            <span class="text-amber-600 dark:text-amber-400 font-medium">● Temperature</span>
            <span class="text-sky-600 dark:text-sky-400 font-medium">● Barometric Pressure</span>
            <span class="text-blue-600 dark:text-blue-400 font-medium">--- Humidity</span>
          </div>
        </div>

        <div class="w-full h-[320px]">
          <canvas id="station-detail-chart"></canvas>
        </div>
      </div>

      <!-- Sensor Array Health & Calibration Table -->
      <div class="atmospheric-card p-5 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-border">
          <h3 class="text-sm font-bold text-content-primary">Installed Sensor Transducers & Health Scores</h3>
          <span class="text-xs font-mono text-content-muted">3 CHANNELS MONITORED</span>
        </div>

        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Hardware Model</th>
                <th>Serial Number</th>
                <th>Health Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(station.sensors || []).map(sensor => `
                <tr>
                  <td class="font-mono font-bold ${sensor.parameter === 'TEMPERATURE' ? 'text-amber-600 dark:text-amber-400' : (sensor.parameter === 'ATMOSPHERIC_PRESSURE' ? 'text-sky-600 dark:text-sky-400' : 'text-blue-600 dark:text-blue-400')}">
                    ${sensor.parameter}
                  </td>
                  <td class="font-medium text-content-primary">${sensor.model}</td>
                  <td class="font-mono text-content-muted">${sensor.serialNumber}</td>
                  <td class="font-mono font-bold ${sensor.healthScore < 70 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}">${sensor.healthScore}%</td>
                  <td>
                    <span class="${sensor.healthScore < 70 ? 'badge-warning' : 'badge-online'}">
                      ${sensor.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Station Active Anomalies Alert Box -->
      ${station.activeAnomalies && station.activeAnomalies.length > 0 ? `
        <div class="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Active Incident Flagged on this Station</span>
            </h3>
            <span class="badge-critical">${station.activeAnomalies[0].severity}</span>
          </div>
          <p class="text-xs text-content-secondary leading-relaxed">${station.activeAnomalies[0].rootCauseExplanation}</p>
          <div class="pt-2 flex justify-between items-center text-xs font-mono">
            <span class="text-content-muted">Observed: <strong class="text-content-primary">${station.activeAnomalies[0].observedValue}</strong> vs Expected: <strong class="text-content-secondary">${station.activeAnomalies[0].expectedBaselineValue}</strong></span>
            <a href="#/anomalies/${station.activeAnomalies[0].id}" class="btn-secondary text-xs px-3 py-1">
              Open Full Anomaly Investigation →
            </a>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  // Render Telemetry Chart on Mount
  setTimeout(() => {
    const canvas = container.querySelector('#station-detail-chart');
    if (canvas && station.recentHistory) {
      createTelemetryChart(canvas, station.recentHistory.slice(-24).reverse());
    }
  }, 50);

  return container;
}
