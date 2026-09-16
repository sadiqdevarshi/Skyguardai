import { api } from '../services/api.js';
import { renderSidebar } from '../components/Sidebar.js';

export async function renderAnomaliesView() {
  const anomalies = await api.getAnomalies();

  const container = document.createElement('div');
  container.className = 'flex-1 flex w-full min-h-[calc(100vh-4rem)]';

  let paramFilter = 'ALL';
  let severityFilter = 'ALL';
  let statusFilter = 'ALL';

  const renderContent = () => {
    const filtered = anomalies.filter(a => {
      const matchParam = paramFilter === 'ALL' || a.parameter === paramFilter;
      const matchSev = severityFilter === 'ALL' || a.severity === severityFilter;
      const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
      return matchParam && matchSev && matchStatus;
    });

    return `
      ${renderSidebar('/anomalies')}

      <div class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aeris-850 pb-4">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">Meteorological Anomaly Workspace</h1>
            <p class="text-xs text-slate-400 mt-0.5">Continuous physical rule-based & statistical divergence incident tracking.</p>
          </div>

          <div class="flex items-center space-x-2 font-mono text-xs">
            <span class="p-2 rounded bg-aeris-900 border border-aeris-800 text-amber-400 font-bold">${anomalies.filter(a => a.status === 'OPEN').length} OPEN INCIDENTS</span>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-aeris-900/60 rounded-xl border border-aeris-800 text-xs">
          <div class="flex flex-wrap items-center gap-3">
            <div>
              <label class="text-slate-400 font-mono mr-1">PARAMETER:</label>
              <select id="filter-param" class="bg-aeris-950 border border-aeris-800 text-slate-300 rounded px-2 py-1">
                <option value="ALL" ${paramFilter === 'ALL' ? 'selected' : ''}>All Parameters</option>
                <option value="TEMPERATURE" ${paramFilter === 'TEMPERATURE' ? 'selected' : ''}>Temperature</option>
                <option value="ATMOSPHERIC_PRESSURE" ${paramFilter === 'ATMOSPHERIC_PRESSURE' ? 'selected' : ''}>Atmospheric Pressure</option>
                <option value="RELATIVE_HUMIDITY" ${paramFilter === 'RELATIVE_HUMIDITY' ? 'selected' : ''}>Relative Humidity</option>
              </select>
            </div>

            <div>
              <label class="text-slate-400 font-mono mr-1">SEVERITY:</label>
              <select id="filter-severity" class="bg-aeris-950 border border-aeris-800 text-slate-300 rounded px-2 py-1">
                <option value="ALL" ${severityFilter === 'ALL' ? 'selected' : ''}>All Severities</option>
                <option value="CRITICAL" ${severityFilter === 'CRITICAL' ? 'selected' : ''}>Critical Only</option>
                <option value="WARNING" ${severityFilter === 'WARNING' ? 'selected' : ''}>Warning Only</option>
                <option value="INFO" ${severityFilter === 'INFO' ? 'selected' : ''}>Info Only</option>
              </select>
            </div>

            <div>
              <label class="text-slate-400 font-mono mr-1">STATUS:</label>
              <select id="filter-status" class="bg-aeris-950 border border-aeris-800 text-slate-300 rounded px-2 py-1">
                <option value="ALL" ${statusFilter === 'ALL' ? 'selected' : ''}>All States</option>
                <option value="OPEN" ${statusFilter === 'OPEN' ? 'selected' : ''}>Open</option>
                <option value="ACKNOWLEDGED" ${statusFilter === 'ACKNOWLEDGED' ? 'selected' : ''}>Acknowledged</option>
                <option value="RESOLVED" ${statusFilter === 'RESOLVED' ? 'selected' : ''}>Resolved</option>
              </select>
            </div>
          </div>

          <span class="text-slate-400 font-mono">${filtered.length} matching events</span>
        </div>

        <!-- Anomaly Cards List -->
        <div class="space-y-4">
          ${filtered.map(anom => `
            <div class="atmospheric-card p-6 space-y-4 border ${anom.severity === 'CRITICAL' ? 'border-red-900/60 bg-red-950/10' : 'border-amber-900/40 bg-amber-950/10'}">
              
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center space-x-3">
                  <span class="${anom.severity === 'CRITICAL' ? 'badge-critical' : 'badge-warning'} font-mono">${anom.severity}</span>
                  <span class="font-mono font-bold text-cyan-400 text-xs">${anom.stationCode}</span>
                  <h3 class="text-sm font-bold text-white">${anom.stationName}</h3>
                </div>

                <div class="flex items-center space-x-2 font-mono text-xs">
                  <span class="text-slate-400">${new Date(anom.detectedAt).toLocaleString()}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${anom.status === 'OPEN' ? 'bg-amber-950 text-amber-300 border border-amber-800' : (anom.status === 'ACKNOWLEDGED' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800')}">
                    ${anom.status}
                  </span>
                </div>
              </div>

              <!-- Anomaly Parameter and Observed Delta -->
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-aeris-950 border border-aeris-800/80 font-mono text-xs">
                <div>
                  <span class="text-[10px] text-slate-500 uppercase block">PARAMETER / TYPE</span>
                  <span class="font-bold text-slate-200">${anom.parameter}</span>
                  <span class="text-[11px] text-cyan-400 block">${anom.anomalyType}</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-500 uppercase block">OBSERVED VALUE</span>
                  <span class="font-bold text-rose-400 text-sm">${anom.observedValue}</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-500 uppercase block">EXPECTED BASELINE</span>
                  <span class="font-bold text-slate-300 text-sm">${anom.expectedBaselineValue != null ? anom.expectedBaselineValue : 'N/A'}</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-500 uppercase block">STATISTICAL CONFIDENCE</span>
                  <span class="font-bold text-emerald-400">${anom.confidenceScore}%</span>
                </div>
              </div>

              <!-- Root cause explanation snippet -->
              <div class="space-y-1 text-xs">
                <span class="text-[10px] font-mono text-slate-400 uppercase">PHYSICAL DIAGNOSTIC ANALYSIS</span>
                <p class="text-slate-300 leading-relaxed">${anom.rootCauseExplanation}</p>
              </div>

              <!-- Bottom CTA -->
              <div class="pt-2 flex justify-end items-center border-t border-aeris-800/80">
                <a href="#/anomalies/${anom.id}" class="btn-primary text-xs px-4 py-1.5 flex items-center space-x-1.5">
                  <span>Open Full Investigation Workbench</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
              </div>

            </div>
          `).join('')}
        </div>

      </div>
    `;
  };

  const updateView = () => {
    container.innerHTML = renderContent();

    const paramSel = container.querySelector('#filter-param');
    if (paramSel) {
      paramSel.onchange = (e) => {
        paramFilter = e.target.value;
        updateView();
      };
    }

    const sevSel = container.querySelector('#filter-severity');
    if (sevSel) {
      sevSel.onchange = (e) => {
        severityFilter = e.target.value;
        updateView();
      };
    }

    const statusSel = container.querySelector('#filter-status');
    if (statusSel) {
      statusSel.onchange = (e) => {
        statusFilter = e.target.value;
        updateView();
      };
    }
  };

  updateView();
  return container;
}
