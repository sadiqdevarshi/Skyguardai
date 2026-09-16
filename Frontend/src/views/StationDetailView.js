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
      <div class="space-y-2 border-b border-aeris-850 pb-4">
        <a href="#/stations" class="text-xs text-cyan-400 hover:underline inline-flex items-center space-x-1">
          <span>← Back to Station Inventory</span>
        </a>
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-3">
              <h1 class="text-2xl font-bold text-white tracking-tight">${station.name}</h1>
              <span class="font-mono text-xs px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">${station.stationCode}</span>
              <span class="${station.status === 'ONLINE' ? 'badge-online' : (station.status === 'DEGRADED' ? 'badge-degraded' : 'badge-offline')}">
                ${station.status}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">${station.region} • Lat: ${station.latitude}, Lon: ${station.longitude} • Elevation: ${station.elevationMeters}m MSL</p>
          </div>

          <div class="flex items-center space-x-3 font-mono text-xs text-slate-300">
            <span class="p-2 rounded bg-aeris-900 border border-aeris-800">Battery: <strong class="text-emerald-400">${station.batteryLevel}%</strong></span>
            <span class="p-2 rounded bg-aeris-900 border border-aeris-800">Ping: <strong class="text-cyan-400">12ms</strong></span>
          </div>
        </div>
      </div>

      <!-- Current Telemetry Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-slate-400 uppercase">CURRENT TEMPERATURE</span>
          <div class="text-2xl font-mono font-bold text-amber-400">${station.currentTemperature != null ? station.currentTemperature + ' °C' : '--'}</div>
          <div class="text-[10px] text-slate-400 font-mono">Transducer: Vaisala Platinum RTD</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-slate-400 uppercase">ATMOSPHERIC PRESSURE</span>
          <div class="text-2xl font-mono font-bold text-cyan-400">${station.currentPressure != null ? station.currentPressure + ' hPa' : '--'}</div>
          <div class="text-[10px] text-slate-400 font-mono">Transducer: Setra 278 Barometer</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-slate-400 uppercase">RELATIVE HUMIDITY</span>
          <div class="text-2xl font-mono font-bold text-blue-400">${station.currentHumidity != null ? station.currentHumidity + ' %' : '--'}</div>
          <div class="text-[10px] text-slate-400 font-mono">Transducer: Rotronic Capacitive</div>
        </div>
      </div>

      <!-- High-Resolution Telemetry Chart -->
      <div class="atmospheric-card p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-aeris-800">
          <div>
            <h3 class="text-sm font-bold text-white">Historical Telemetry Stream (Last 24 Hours)</h3>
            <span class="text-xs text-slate-400">Continuous sampling synchronized to UTC meteorological cycles</span>
          </div>
          <div class="flex items-center space-x-3 font-mono text-xs">
            <span class="text-amber-400">● Temperature</span>
            <span class="text-cyan-400">● Barometric Pressure</span>
            <span class="text-blue-400">--- Humidity</span>
          </div>
        </div>

        <div class="w-full h-[320px]">
          <canvas id="station-detail-chart"></canvas>
        </div>
      </div>

      <!-- Sensor Array Health & Calibration Table -->
      <div class="atmospheric-card p-5 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-aeris-800">
          <h3 class="text-sm font-bold text-white">Installed Sensor Transducers & Health Scores</h3>
          <span class="text-xs font-mono text-slate-400">3 CHANNELS MONITORED</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-aeris-800 font-mono text-slate-400 text-[11px]">
                <th class="pb-2">PARAMETER</th>
                <th class="pb-2">HARDWARE MODEL</th>
                <th class="pb-2">SERIAL NUMBER</th>
                <th class="pb-2">HEALTH SCORE</th>
                <th class="pb-2">STATUS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-aeris-850">
              ${(station.sensors || []).map(sensor => `
                <tr>
                  <td class="py-3 font-mono font-bold ${sensor.parameter === 'TEMPERATURE' ? 'text-amber-400' : (sensor.parameter === 'ATMOSPHERIC_PRESSURE' ? 'text-cyan-400' : 'text-blue-400')}">
                    ${sensor.parameter}
                  </td>
                  <td class="py-3 font-medium text-slate-200">${sensor.model}</td>
                  <td class="py-3 font-mono text-slate-400">${sensor.serialNumber}</td>
                  <td class="py-3 font-mono font-bold ${sensor.healthScore < 70 ? 'text-amber-400' : 'text-emerald-400'}">${sensor.healthScore}%</td>
                  <td class="py-3">
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
        <div class="p-5 rounded-xl bg-amber-950/30 border border-amber-800/80 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-amber-400 flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>Active Incident Flagged on this Station</span>
            </h3>
            <span class="badge-critical">${station.activeAnomalies[0].severity}</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">${station.activeAnomalies[0].rootCauseExplanation}</p>
          <div class="pt-2 flex justify-between items-center text-xs font-mono">
            <span class="text-slate-400">Observed: <strong class="text-white">${station.activeAnomalies[0].observedValue}</strong> vs Expected: <strong class="text-slate-300">${station.activeAnomalies[0].expectedBaselineValue}</strong></span>
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
