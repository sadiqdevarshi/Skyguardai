import { api } from '../services/api.js';

export async function renderMonitoringView() {
  const stations = await api.getStations();
  const analytics = await api.getAnalyticsSummary();

  const container = document.createElement('div');
  container.className = 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8';

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
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span class="text-xs font-mono text-accent uppercase tracking-widest font-semibold">ENVIRONMENTAL INTELLIGENCE</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight mt-1">
            Real-Time Atmospheric Monitoring Matrix
          </h1>
          <p class="text-xs sm:text-sm text-content-secondary mt-1">
            Live telemetry observation streams across active Automatic Weather Station nodes.
          </p>
        </div>

        <div class="flex items-center space-x-2">
          <a href="#/live" class="btn-secondary text-xs px-3.5 py-2 flex items-center space-x-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Switch to 3D Sensor View</span>
          </a>
        </div>
      </div>

      <!-- Network Overview Counters -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider">ACTIVE ONLINE STATIONS</span>
          <div class="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">${analytics.onlineStations} <span class="text-xs font-normal text-content-muted">/ ${analytics.totalStations}</span></div>
          <div class="text-[10px] text-content-muted font-mono">Transmission: 100% On-Time</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider">NETWORK MEAN TEMP</span>
          <div class="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400">${analytics.networkAvgTemperature}°C</div>
          <div class="text-[10px] text-content-muted font-mono">Diurnal Mean (24h)</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider">MEAN BAROMETRIC PRESSURE</span>
          <div class="text-2xl font-mono font-bold text-sky-600 dark:text-sky-400">${analytics.networkAvgPressure} <span class="text-xs font-normal">hPa</span></div>
          <div class="text-[10px] text-content-muted font-mono">Hydrostatic Equilibrium</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider">MEAN RELATIVE HUMIDITY</span>
          <div class="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">${analytics.networkAvgHumidity}%</div>
          <div class="text-[10px] text-content-muted font-mono">Psychrometric Average</div>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 p-3 bg-subtle rounded-xl border border-border">
        <div class="flex items-center space-x-1.5 text-xs">
          <span class="text-content-muted font-mono mr-2">FILTER:</span>
          <button class="filter-btn px-3 py-1.5 rounded-md font-medium transition-colors ${currentFilter === 'ALL' ? 'bg-surface text-accent font-semibold border border-accent/20 shadow-sm' : 'text-content-secondary hover:text-content-primary'}" data-filter="ALL">All Stations (${stations.length})</button>
          <button class="filter-btn px-3 py-1.5 rounded-md font-medium transition-colors ${currentFilter === 'ONLINE' ? 'bg-surface text-accent font-semibold border border-accent/20 shadow-sm' : 'text-content-secondary hover:text-content-primary'}" data-filter="ONLINE">Online (${analytics.onlineStations})</button>
          <button class="filter-btn px-3 py-1.5 rounded-md font-medium transition-colors ${currentFilter === 'DEGRADED' ? 'bg-surface text-accent font-semibold border border-accent/20 shadow-sm' : 'text-content-secondary hover:text-content-primary'}" data-filter="DEGRADED">Degraded (${analytics.degradedStations})</button>
        </div>

        <div class="flex items-center space-x-2 text-xs font-mono text-content-muted">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>AUTO-REFRESH: 10s</span>
        </div>
      </div>

      <!-- Station Telemetry Stream Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${filteredStations.map(st => `
          <div class="atmospheric-card p-6 space-y-4 ${st.status === 'DEGRADED' ? 'border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/10' : ''}">
            
            <div class="flex items-start justify-between">
              <div>
                <span class="text-xs font-mono font-bold text-accent">${st.stationCode}</span>
                <h3 class="text-base font-bold text-content-primary mt-0.5">${st.name}</h3>
                <span class="text-xs text-content-muted">${st.region} • ${st.elevationMeters}m MSL</span>
              </div>
              <span class="${st.status === 'ONLINE' ? 'badge-online' : (st.status === 'DEGRADED' ? 'badge-degraded' : 'badge-offline')}">
                ${st.status}
              </span>
            </div>

            <!-- Parameters Grid -->
            <div class="grid grid-cols-3 gap-2 p-3 rounded-lg bg-subtle border border-border font-mono text-center">
              <div class="space-y-0.5">
                <span class="text-[9px] text-content-muted uppercase">TEMPERATURE</span>
                <div class="text-sm font-bold text-amber-600 dark:text-amber-400">${st.currentTemperature != null ? st.currentTemperature + '°C' : '--'}</div>
              </div>
              <div class="space-y-0.5">
                <span class="text-[9px] text-content-muted uppercase">PRESSURE</span>
                <div class="text-sm font-bold text-sky-600 dark:text-sky-400">${st.currentPressure != null ? st.currentPressure : '--'} <span class="text-[9px] font-normal">hPa</span></div>
              </div>
              <div class="space-y-0.5">
                <span class="text-[9px] text-content-muted uppercase">HUMIDITY</span>
                <div class="text-sm font-bold text-blue-600 dark:text-blue-400">${st.currentHumidity != null ? st.currentHumidity + '%' : '--'}</div>
              </div>
            </div>

            <!-- Battery & Anomaly Alert Bar -->
            <div class="flex items-center justify-between text-xs font-mono text-content-muted pt-1 border-t border-border">
              <div class="flex items-center space-x-1.5">
                <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <span>Battery: ${st.batteryLevel}%</span>
              </div>
              
              ${st.activeAnomalyCount > 0 ? `
                <span class="text-amber-600 dark:text-amber-400 font-semibold flex items-center space-x-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                  <span>${st.activeAnomalyCount} Flagged</span>
                </span>
              ` : `
                <span class="text-emerald-600 dark:text-emerald-400 font-medium">0 Anomalies</span>
              `}
            </div>

            <!-- Deep Dive Action -->
            <div class="pt-2">
              <a href="#/stations/${st.id}" class="btn-secondary w-full text-xs py-2 justify-center">
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
