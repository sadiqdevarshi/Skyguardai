import { api } from '../services/api.js';

export async function renderMonitoringView() {
  const stations = await api.getStations();
  const analytics = await api.getAnalyticsSummary();

  const container = document.createElement('div');
  container.className = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6';

  let currentFilter = 'ALL';

  const renderContent = () => {
    const filteredStations = stations.filter(st => {
      if (currentFilter === 'ONLINE') return st.status === 'ONLINE';
      if (currentFilter === 'DEGRADED') return st.status === 'DEGRADED';
      if (currentFilter === 'OFFLINE') return st.status === 'OFFLINE';
      return true;
    });

    return `
      <!-- View Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span class="text-xs font-mono text-accent uppercase tracking-widest font-semibold">ENVIRONMENTAL INTELLIGENCE</span>
          <h1 class="text-xl sm:text-2xl font-bold text-content-primary tracking-tight mt-0.5">
            Real-Time Atmospheric Monitoring Matrix
          </h1>
          <p class="text-xs text-content-secondary mt-0.5">
            Live telemetry observation streams across active Automatic Weather Station nodes.
          </p>
        </div>

        <div class="flex items-center space-x-2">
          <a href="#/live" class="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Switch to 3D Sensor View</span>
          </a>
        </div>
      </div>

      <!-- Network Overview Counters -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">ACTIVE ONLINE STATIONS</span>
          <div class="flex items-baseline space-x-1 font-mono">
            <span class="text-2xl font-bold text-content-primary tabular-nums">${analytics.onlineStations}</span>
            <span class="text-xs text-content-muted font-normal">/ ${analytics.totalStations}</span>
          </div>
          <span class="text-[10px] text-content-muted block">Transmission: 100% on-time</span>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">NETWORK MEAN TEMP</span>
          <div class="flex items-baseline space-x-1 font-mono">
            <span class="text-2xl font-bold text-content-primary tabular-nums">${analytics.networkAvgTemperature}</span>
            <span class="text-xs text-content-muted font-normal">°C</span>
          </div>
          <span class="text-[10px] text-content-muted block">Diurnal Mean (24h)</span>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">MEAN PRESSURE</span>
          <div class="flex items-baseline space-x-1 font-mono">
            <span class="text-2xl font-bold text-content-primary tabular-nums">${analytics.networkAvgPressure}</span>
            <span class="text-xs text-content-muted font-normal">hPa</span>
          </div>
          <span class="text-[10px] text-content-muted block">Hydrostatic equilibrium</span>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">MEAN HUMIDITY</span>
          <div class="flex items-baseline space-x-1 font-mono">
            <span class="text-2xl font-bold text-content-primary tabular-nums">${analytics.networkAvgHumidity}</span>
            <span class="text-xs text-content-muted font-normal">%</span>
          </div>
          <span class="text-[10px] text-content-muted block">Psychrometric average</span>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-subtle rounded-md border border-border text-xs">
        <div class="flex items-center space-x-1">
          <span class="text-content-muted font-mono mr-2 text-[11px]">FILTER:</span>
          <button class="filter-btn px-2.5 py-1 rounded font-medium transition-colors ${currentFilter === 'ALL' ? 'bg-surface text-content-primary font-semibold border border-border shadow-card' : 'text-content-secondary hover:text-content-primary'}" data-filter="ALL">All (${stations.length})</button>
          <button class="filter-btn px-2.5 py-1 rounded font-medium transition-colors ${currentFilter === 'ONLINE' ? 'bg-surface text-content-primary font-semibold border border-border shadow-card' : 'text-content-secondary hover:text-content-primary'}" data-filter="ONLINE">Online (${analytics.onlineStations})</button>
          <button class="filter-btn px-2.5 py-1 rounded font-medium transition-colors ${currentFilter === 'DEGRADED' ? 'bg-surface text-content-primary font-semibold border border-border shadow-card' : 'text-content-secondary hover:text-content-primary'}" data-filter="DEGRADED">Degraded (${analytics.degradedStations})</button>
        </div>

        <div class="flex items-center space-x-2 text-[11px] font-mono text-content-muted">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>POLL: 10s</span>
        </div>
      </div>

      <!-- Station Telemetry Stream Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${filteredStations.map(st => `
          <div class="atmospheric-card p-5 space-y-3.5">
            
            <div class="flex items-start justify-between">
              <div>
                <span class="text-xs font-mono font-bold text-content-secondary">${st.stationCode}</span>
                <h3 class="text-sm font-bold text-content-primary mt-0.5">${st.name}</h3>
                <span class="text-xs text-content-muted">${st.region} • ${st.elevationMeters}m MSL</span>
              </div>
              <span class="${st.status === 'ONLINE' ? 'status-online' : (st.status === 'DEGRADED' ? 'status-degraded' : 'status-offline')}">
                ${st.status}
              </span>
            </div>

            <!-- Parameters Grid -->
            <div class="grid grid-cols-3 gap-2 p-2.5 rounded bg-subtle border border-border font-mono text-center">
              <div class="space-y-0.5">
                <span class="text-[9px] text-content-muted uppercase block">TEMPERATURE</span>
                <div class="text-xs font-bold text-content-primary tabular-nums">${st.currentTemperature != null ? st.currentTemperature + '°C' : '--'}</div>
              </div>
              <div class="space-y-0.5">
                <span class="text-[9px] text-content-muted uppercase block">PRESSURE</span>
                <div class="text-xs font-bold text-content-primary tabular-nums">${st.currentPressure != null ? st.currentPressure : '--'} <span class="text-[9px] font-normal text-content-muted">hPa</span></div>
              </div>
              <div class="space-y-0.5">
                <span class="text-[9px] text-content-muted uppercase block">HUMIDITY</span>
                <div class="text-xs font-bold text-content-primary tabular-nums">${st.currentHumidity != null ? st.currentHumidity + '%' : '--'}</div>
              </div>
            </div>

            <!-- Battery & Anomaly Alert Bar -->
            <div class="flex items-center justify-between text-[11px] font-mono text-content-muted pt-1 border-t border-border">
              <div class="flex items-center space-x-1.5">
                <span>Battery: ${st.batteryLevel}%</span>
              </div>
              
              ${st.activeAnomalyCount > 0 ? `
                <span class="text-amber-600 dark:text-amber-400 font-semibold">
                  ${st.activeAnomalyCount} Flagged
                </span>
              ` : `
                <span class="text-content-muted">0 Anomalies</span>
              `}
            </div>

            <!-- Deep Dive Action -->
            <div class="pt-1">
              <a href="#/stations/${st.id}" class="btn-secondary w-full text-xs py-1.5 justify-center">
                Deep Analytical Inspection →
              </a>
            </div>

          </div>
        `).join('')}
      </div>
    `;
  };

  const updateView = () => {
    container.innerHTML = renderContent();
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.onclick = () => {
        currentFilter = btn.dataset.filter;
        updateView();
      };
    });
  };

  updateView();
  return container;
}
