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
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aeris-900 pb-6">
        <div>
          <span class="text-xs font-mono text-cyan-400 uppercase tracking-widest">ENVIRONMENTAL INTELLIGENCE</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Real-Time Atmospheric Monitoring Matrix
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Live telemetry observation streams across active Automatic Weather Station nodes.
          </p>
        </div>

        <div class="flex items-center space-x-2">
          <a href="#/live" class="btn-primary text-xs px-3.5 py-2 flex items-center space-x-1.5">
            <span class="w-2 h-2 rounded-full bg-slate-950 animate-pulse"></span>
            <span>Switch to 3D Sensor View</span>
          </a>
        </div>
      </div>

      <!-- Network Overview Counters -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-slate-400 uppercase">ACTIVE ONLINE STATIONS</span>
          <div class="text-2xl font-mono font-bold text-emerald-400">${analytics.onlineStations} <span class="text-xs font-normal text-slate-400">/ ${analytics.totalStations}</span></div>
          <div class="text-[10px] text-slate-400 font-mono">Transmission: 100% On-Time</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-slate-400 uppercase">NETWORK MEAN TEMP</span>
          <div class="text-2xl font-mono font-bold text-amber-400">${analytics.networkAvgTemperature}°C</div>
          <div class="text-[10px] text-slate-400 font-mono">Diurnal Mean (24h)</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-slate-400 uppercase">MEAN BAROMETRIC PRESSURE</span>
          <div class="text-2xl font-mono font-bold text-cyan-400">${analytics.networkAvgPressure} <span class="text-xs font-normal">hPa</span></div>
          <div class="text-[10px] text-slate-400 font-mono">Hydrostatic Equilibrium</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-slate-400 uppercase">MEAN RELATIVE HUMIDITY</span>
          <div class="text-2xl font-mono font-bold text-blue-400">${analytics.networkAvgHumidity}%</div>
          <div class="text-[10px] text-slate-400 font-mono">Psychrometric Average</div>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 p-3 bg-aeris-900/60 rounded-xl border border-aeris-800">
        <div class="flex items-center space-x-1.5 text-xs">
          <span class="text-slate-400 font-mono mr-2">FILTER:</span>
          <button class="filter-btn px-3 py-1 rounded-md font-medium transition-colors ${currentFilter === 'ALL' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'}" data-filter="ALL">All Stations (${stations.length})</button>
          <button class="filter-btn px-3 py-1 rounded-md font-medium transition-colors ${currentFilter === 'ONLINE' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'}" data-filter="ONLINE">Online (${analytics.onlineStations})</button>
          <button class="filter-btn px-3 py-1 rounded-md font-medium transition-colors ${currentFilter === 'DEGRADED' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'}" data-filter="DEGRADED">Degraded (${analytics.degradedStations})</button>
        </div>

        <div class="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>AUTO-REFRESH: 10s</span>
        </div>
      </div>

      <!-- Station Telemetry Stream Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${filteredStations.map(st => `
          <div class="atmospheric-card p-6 space-y-4 border ${st.status === 'DEGRADED' ? 'border-amber-700/60 bg-amber-950/10' : 'border-aeris-800'}">
            
            <div class="flex items-start justify-between">
              <div>
                <span class="text-xs font-mono font-bold text-cyan-400">${st.stationCode}</span>
                <h3 class="text-base font-bold text-slate-100 mt-0.5">${st.name}</h3>
                <span class="text-xs text-slate-400">${st.region} • ${st.elevationMeters}m MSL</span>
              </div>
              <span class="${st.status === 'ONLINE' ? 'badge-online' : (st.status === 'DEGRADED' ? 'badge-degraded' : 'badge-offline')}">
                ${st.status}
              </span>
            </div>

            <!-- Parameters Grid -->
            <div class="grid grid-cols-3 gap-2 p-3 rounded-lg bg-aeris-950/80 border border-aeris-800/80 font-mono text-center">
              <div class="space-y-0.5">
                <span class="text-[9px] text-slate-400 uppercase">TEMPERATURE</span>
                <div class="text-sm font-bold text-amber-400">${st.currentTemperature != null ? st.currentTemperature + '°C' : '--'}</div>
              </div>
              <div class="space-y-0.5">
                <span class="text-[9px] text-slate-400 uppercase">PRESSURE</span>
                <div class="text-sm font-bold text-cyan-400">${st.currentPressure != null ? st.currentPressure : '--'} <span class="text-[9px] font-normal">hPa</span></div>
              </div>
              <div class="space-y-0.5">
                <span class="text-[9px] text-slate-400 uppercase">HUMIDITY</span>
                <div class="text-sm font-bold text-blue-400">${st.currentHumidity != null ? st.currentHumidity + '%' : '--'}</div>
              </div>
            </div>

            <!-- Battery & Anomaly Alert Bar -->
            <div class="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-aeris-800/80">
              <div class="flex items-center space-x-1.5">
                <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <span>Battery: ${st.batteryLevel}%</span>
              </div>
              
              ${st.activeAnomalyCount > 0 ? `
                <span class="text-amber-400 font-semibold flex items-center space-x-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                  <span>${st.activeAnomalyCount} Anomaly</span>
                </span>
              ` : `
                <span class="text-emerald-400">0 Anomalies</span>
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
