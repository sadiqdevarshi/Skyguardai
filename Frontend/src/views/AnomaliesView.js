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

    const openCount = anomalies.filter(a => a.status === 'OPEN').length;

    return `
      ${renderSidebar('/anomalies')}

      <div class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-content-primary tracking-tight">Meteorological Anomaly Workspace</h1>
            <p class="text-xs text-content-secondary mt-0.5">Continuous physical rule-based & statistical divergence incident tracking.</p>
          </div>

          <div class="flex items-center space-x-2 font-mono text-xs">
            <span class="p-2 rounded-lg bg-subtle border border-border text-content-secondary">
              <strong class="text-content-primary tabular-nums font-semibold">${openCount}</strong> OPEN INCIDENTS
            </span>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-subtle rounded-lg border border-border text-xs">
          <div class="flex flex-wrap items-center gap-3">
            <div>
              <label class="text-content-muted font-mono mr-1">PARAMETER:</label>
              <select id="filter-param" class="form-input py-1.5 inline-block w-auto">
                <option value="ALL" ${paramFilter === 'ALL' ? 'selected' : ''}>All Parameters</option>
                <option value="TEMPERATURE" ${paramFilter === 'TEMPERATURE' ? 'selected' : ''}>Temperature</option>
                <option value="ATMOSPHERIC_PRESSURE" ${paramFilter === 'ATMOSPHERIC_PRESSURE' ? 'selected' : ''}>Atmospheric Pressure</option>
                <option value="RELATIVE_HUMIDITY" ${paramFilter === 'RELATIVE_HUMIDITY' ? 'selected' : ''}>Relative Humidity</option>
              </select>
            </div>

            <div>
              <label class="text-content-muted font-mono mr-1">SEVERITY:</label>
              <select id="filter-severity" class="form-input py-1.5 inline-block w-auto">
                <option value="ALL" ${severityFilter === 'ALL' ? 'selected' : ''}>All Severities</option>
                <option value="CRITICAL" ${severityFilter === 'CRITICAL' ? 'selected' : ''}>Critical Only</option>
                <option value="WARNING" ${severityFilter === 'WARNING' ? 'selected' : ''}>Warning Only</option>
                <option value="INFO" ${severityFilter === 'INFO' ? 'selected' : ''}>Info Only</option>
              </select>
            </div>

            <div>
              <label class="text-content-muted font-mono mr-1">STATUS:</label>
              <select id="filter-status" class="form-input py-1.5 inline-block w-auto">
                <option value="ALL" ${statusFilter === 'ALL' ? 'selected' : ''}>All States</option>
                <option value="OPEN" ${statusFilter === 'OPEN' ? 'selected' : ''}>Open</option>
                <option value="ACKNOWLEDGED" ${statusFilter === 'ACKNOWLEDGED' ? 'selected' : ''}>Acknowledged</option>
                <option value="RESOLVED" ${statusFilter === 'RESOLVED' ? 'selected' : ''}>Resolved</option>
              </select>
            </div>
          </div>

          <span class="text-content-muted font-mono">${filtered.length} matching events</span>
        </div>

        <!-- Anomaly Cards List -->
        <div class="space-y-4">
          ${filtered.map(anom => {
            const sevClass = anom.severity === 'CRITICAL' ? 'status-critical' : (anom.severity === 'WARNING' ? 'status-warning' : 'status-online');
            const stateClass = anom.status === 'OPEN' ? 'status-warning' : (anom.status === 'ACKNOWLEDGED' ? 'status-online' : 'text-content-muted');
            return `
              <div class="atmospheric-card p-5 sm:p-6 space-y-4">
                
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div class="flex items-center space-x-3">
                    <span class="${sevClass} font-mono">${anom.severity}</span>
                    <span class="font-mono text-xs px-2 py-0.5 rounded bg-subtle text-content-secondary border border-border">${anom.stationCode}</span>
                    <h3 class="text-sm font-bold text-content-primary">${anom.stationName}</h3>
                  </div>

                  <div class="flex items-center space-x-3 font-mono text-xs">
                    <span class="text-content-muted">${new Date(anom.detectedAt).toLocaleString()}</span>
                    <span class="${stateClass} font-mono font-medium">
                      ${anom.status}
                    </span>
                  </div>
                </div>

                <!-- Anomaly Parameter and Observed Delta -->
                <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-subtle border border-border font-mono text-xs">
                  <div>
                    <span class="text-[10px] text-content-muted uppercase block">PARAMETER / TYPE</span>
                    <span class="font-bold text-content-primary">${anom.parameter}</span>
                    <span class="text-[11px] text-content-secondary block font-medium">${anom.anomalyType}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-content-muted uppercase block">OBSERVED VALUE</span>
                    <span class="font-bold text-content-primary text-sm tabular-nums">${anom.observedValue}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-content-muted uppercase block">EXPECTED BASELINE</span>
                    <span class="font-bold text-content-secondary text-sm tabular-nums">${anom.expectedBaselineValue != null ? anom.expectedBaselineValue : 'N/A'}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-content-muted uppercase block">STATISTICAL CONFIDENCE</span>
                    <span class="font-bold text-content-primary tabular-nums">${anom.confidenceScore}%</span>
                  </div>
                </div>

                <!-- Root cause explanation snippet -->
                <div class="space-y-1 text-xs">
                  <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">PHYSICAL DIAGNOSTIC ANALYSIS</span>
                  <p class="text-content-secondary leading-relaxed">${anom.rootCauseExplanation}</p>
                </div>

                <!-- Bottom CTA -->
                <div class="pt-2 flex justify-end items-center border-t border-border">
                  <a href="#/anomalies/${anom.id}" class="btn-primary text-xs px-4 py-1.5 flex items-center space-x-1.5">
                    <span>Open Full Investigation Workbench</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </a>
                </div>

              </div>
            `;
          }).join('')}
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

