import { api } from '../services/api.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showModal } from '../components/Modal.js';
import { showToast } from '../components/Toast.js';

export async function renderStationsView() {
  const stations = await api.getStations();

  const container = document.createElement('div');
  container.className = 'flex-1 flex w-full min-h-[calc(100vh-4rem)]';

  let searchQuery = '';
  let statusFilter = 'ALL';
  let viewMode = 'GRID'; // 'GRID' or 'TABLE'

  const renderContent = () => {
    const filtered = stations.filter(st => {
      const matchSearch = st.stationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || st.status === statusFilter;
      return matchSearch && matchStatus;
    });

    return `
      ${renderSidebar('/stations')}

      <div class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aeris-850 pb-4">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">Weather Station Inventory</h1>
            <p class="text-xs text-slate-400 mt-0.5">Manage deployed automatic weather stations, sensor arrays, and calibration telemetry.</p>
          </div>

          <button id="add-station-btn" class="btn-primary text-xs px-3.5 py-2 flex items-center space-x-1.5 self-start sm:self-auto">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span>Register New AWS Node</span>
          </button>
        </div>

        <!-- Search and Filter Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-aeris-900/60 rounded-xl border border-aeris-800">
          <div class="flex flex-1 min-w-[240px] items-center space-x-2">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              id="station-search-input" 
              placeholder="Search by station code, name, or geographic region..."
              value="${searchQuery}"
              class="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div class="flex items-center space-x-2 text-xs">
            <select id="station-status-filter" class="bg-aeris-950 border border-aeris-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none">
              <option value="ALL" ${statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
              <option value="ONLINE" ${statusFilter === 'ONLINE' ? 'selected' : ''}>Online Only</option>
              <option value="DEGRADED" ${statusFilter === 'DEGRADED' ? 'selected' : ''}>Degraded Only</option>
              <option value="OFFLINE" ${statusFilter === 'OFFLINE' ? 'selected' : ''}>Offline Only</option>
            </select>

            <div class="flex border border-aeris-800 rounded-lg overflow-hidden">
              <button id="view-grid-btn" class="p-1.5 ${viewMode === 'GRID' ? 'bg-cyan-950 text-cyan-300' : 'bg-aeris-950 text-slate-400'}" title="Grid View">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              </button>
              <button id="view-table-btn" class="p-1.5 ${viewMode === 'TABLE' ? 'bg-cyan-950 text-cyan-300' : 'bg-aeris-950 text-slate-400'}" title="Table View">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Station Results Content -->
        ${viewMode === 'GRID' ? `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filtered.map(st => `
              <div class="atmospheric-card p-6 space-y-4 flex flex-col justify-between">
                <div class="space-y-3">
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

                  <p class="text-xs text-slate-400 leading-snug line-clamp-2">${st.description || 'Continuous meteorological boundary observation array.'}</p>

                  <div class="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-aeris-950 border border-aeris-800 font-mono text-center text-xs">
                    <div>
                      <span class="text-[9px] text-slate-500 uppercase block">TEMP</span>
                      <span class="font-bold text-amber-400">${st.currentTemperature != null ? st.currentTemperature + '°' : '--'}</span>
                    </div>
                    <div>
                      <span class="text-[9px] text-slate-500 uppercase block">PRES</span>
                      <span class="font-bold text-cyan-400">${st.currentPressure != null ? st.currentPressure : '--'}</span>
                    </div>
                    <div>
                      <span class="text-[9px] text-slate-500 uppercase block">HUM</span>
                      <span class="font-bold text-blue-400">${st.currentHumidity != null ? st.currentHumidity + '%' : '--'}</span>
                    </div>
                  </div>
                </div>

                <div class="pt-3 border-t border-aeris-800 flex items-center justify-between">
                  <span class="text-[10px] font-mono text-slate-400">Bat: ${st.batteryLevel}%</span>
                  <a href="#/stations/${st.id}" class="btn-primary text-xs px-3 py-1.5">
                    Inspect Station →
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="atmospheric-card p-4 overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-aeris-800 font-mono text-slate-400 text-[11px]">
                  <th class="pb-2">STATION CODE</th>
                  <th class="pb-2">NAME</th>
                  <th class="pb-2">REGION</th>
                  <th class="pb-2">ELEVATION</th>
                  <th class="pb-2">STATUS</th>
                  <th class="pb-2 font-mono">TEMP</th>
                  <th class="pb-2 font-mono">PRESSURE</th>
                  <th class="pb-2 font-mono">HUMIDITY</th>
                  <th class="pb-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-aeris-850">
                ${filtered.map(st => `
                  <tr class="hover:bg-aeris-900/40">
                    <td class="py-3 font-mono font-bold text-cyan-400">${st.stationCode}</td>
                    <td class="py-3 font-medium text-slate-200">${st.name}</td>
                    <td class="py-3 text-slate-400">${st.region}</td>
                    <td class="py-3 font-mono text-slate-400">${st.elevationMeters}m</td>
                    <td class="py-3">
                      <span class="${st.status === 'ONLINE' ? 'badge-online' : (st.status === 'DEGRADED' ? 'badge-degraded' : 'badge-offline')}">
                        ${st.status}
                      </span>
                    </td>
                    <td class="py-3 font-mono font-bold text-amber-400">${st.currentTemperature != null ? st.currentTemperature + '°C' : '--'}</td>
                    <td class="py-3 font-mono font-bold text-cyan-400">${st.currentPressure != null ? st.currentPressure + ' hPa' : '--'}</td>
                    <td class="py-3 font-mono font-bold text-blue-400">${st.currentHumidity != null ? st.currentHumidity + '%' : '--'}</td>
                    <td class="py-3 text-right">
                      <a href="#/stations/${st.id}" class="text-xs text-cyan-400 hover:underline">Inspect →</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}

      </div>
    `;
  };

  const updateView = () => {
    container.innerHTML = renderContent();

    const searchInput = container.querySelector('#station-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        searchQuery = e.target.value;
        updateView();
      };
    }

    const filterSelect = container.querySelector('#station-status-filter');
    if (filterSelect) {
      filterSelect.onchange = (e) => {
        statusFilter = e.target.value;
        updateView();
      };
    }

    const gridBtn = container.querySelector('#view-grid-btn');
    if (gridBtn) {
      gridBtn.onclick = () => {
        viewMode = 'GRID';
        updateView();
      };
    }

    const tableBtn = container.querySelector('#view-table-btn');
    if (tableBtn) {
      tableBtn.onclick = () => {
        viewMode = 'TABLE';
        updateView();
      };
    }

    const addBtn = container.querySelector('#add-station-btn');
    if (addBtn) {
      addBtn.onclick = () => {
        showModal({
          title: 'Register New Weather Station Node',
          content: `
            <div class="space-y-3">
              <div>
                <label class="block text-slate-400 font-mono mb-1">STATION IDENTIFIER (e.g. AWS-808-SEA)</label>
                <input id="modal-new-code" type="text" class="w-full p-2 bg-aeris-950 border border-aeris-800 rounded text-white font-mono" placeholder="AWS-808-SEA" />
              </div>
              <div>
                <label class="block text-slate-400 font-mono mb-1">FACILITY / OBSERVATORY NAME</label>
                <input id="modal-new-name" type="text" class="w-full p-2 bg-aeris-950 border border-aeris-800 rounded text-white" placeholder="Nordic Fjord Marine Mast" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-slate-400 font-mono mb-1">REGION</label>
                  <input id="modal-new-region" type="text" class="w-full p-2 bg-aeris-950 border border-aeris-800 rounded text-white" placeholder="Scandinavian Coast" />
                </div>
                <div>
                  <label class="block text-slate-400 font-mono mb-1">ELEVATION (m MSL)</label>
                  <input id="modal-new-elev" type="number" class="w-full p-2 bg-aeris-950 border border-aeris-800 rounded text-white font-mono" placeholder="45" />
                </div>
              </div>
            </div>
          `,
          onConfirm: () => {
            const code = document.getElementById('modal-new-code').value || 'AWS-808-SEA';
            const name = document.getElementById('modal-new-name').value || 'New AWS Node';
            const region = document.getElementById('modal-new-region').value || 'Field Region';
            const elev = parseFloat(document.getElementById('modal-new-elev').value) || 120.0;
            stations.push({
              id: stations.length + 1,
              stationCode: code,
              name: name,
              region: region,
              elevationMeters: elev,
              status: 'ONLINE',
              batteryLevel: 100.0,
              currentTemperature: 18.0,
              currentPressure: 1013.0,
              currentHumidity: 60.0,
              activeAnomalyCount: 0
            });
            showToast(`Station ${code} registered successfully`, 'success');
            updateView();
          }
        });
      };
    }
  };

  updateView();
  return container;
}
