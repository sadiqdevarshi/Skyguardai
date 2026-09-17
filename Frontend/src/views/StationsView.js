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
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-content-primary tracking-tight">Weather Station Inventory</h1>
            <p class="text-xs text-content-secondary mt-0.5">Manage deployed automatic weather stations, sensor arrays, and calibration telemetry.</p>
          </div>

          <button id="add-station-btn" class="btn-primary text-xs px-3.5 py-1.5 flex items-center space-x-1.5 self-start sm:self-auto">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span>Register New Node</span>
          </button>
        </div>

        <!-- Search and Filter Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-subtle rounded-md border border-border">
          <div class="flex flex-1 min-w-[240px] items-center space-x-2 bg-surface px-2.5 py-1.5 rounded border border-border">
            <svg class="w-3.5 h-3.5 text-content-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              id="station-search-input" 
              placeholder="Search station code, name, or region..."
              value="${searchQuery}"
              class="w-full bg-transparent text-xs text-content-primary placeholder-content-faint focus:outline-none"
            />
          </div>

          <div class="flex items-center space-x-2 text-xs">
            <select id="station-status-filter" class="form-input py-1 text-xs">
              <option value="ALL" ${statusFilter === 'ALL' ? 'selected' : ''}>All Statuses</option>
              <option value="ONLINE" ${statusFilter === 'ONLINE' ? 'selected' : ''}>Online Only</option>
              <option value="DEGRADED" ${statusFilter === 'DEGRADED' ? 'selected' : ''}>Degraded Only</option>
              <option value="OFFLINE" ${statusFilter === 'OFFLINE' ? 'selected' : ''}>Offline Only</option>
            </select>

            <div class="flex border border-border rounded overflow-hidden">
              <button id="view-grid-btn" class="p-1.5 ${viewMode === 'GRID' ? 'bg-accent text-content-inverted' : 'bg-surface text-content-muted hover:text-content-primary'}" title="Grid View">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              </button>
              <button id="view-table-btn" class="p-1.5 ${viewMode === 'TABLE' ? 'bg-accent text-content-inverted' : 'bg-surface text-content-muted hover:text-content-primary'}" title="Table View">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Station Results Content -->
        ${viewMode === 'GRID' ? `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${filtered.map(st => `
              <div class="atmospheric-card p-5 space-y-3 flex flex-col justify-between">
                <div class="space-y-2.5">
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

                  <p class="text-xs text-content-secondary leading-snug line-clamp-2">${st.description || 'Continuous meteorological boundary observation array.'}</p>

                  <div class="grid grid-cols-3 gap-2 p-2.5 rounded bg-subtle border border-border font-mono text-center text-xs">
                    <div>
                      <span class="text-[9px] text-content-muted uppercase block">TEMP</span>
                      <span class="font-bold text-content-primary tabular-nums">${st.currentTemperature != null ? st.currentTemperature + '°' : '--'}</span>
                    </div>
                    <div>
                      <span class="text-[9px] text-content-muted uppercase block">PRES</span>
                      <span class="font-bold text-content-primary tabular-nums">${st.currentPressure != null ? st.currentPressure : '--'}</span>
                    </div>
                    <div>
                      <span class="text-[9px] text-content-muted uppercase block">HUM</span>
                      <span class="font-bold text-content-primary tabular-nums">${st.currentHumidity != null ? st.currentHumidity + '%' : '--'}</span>
                    </div>
                  </div>
                </div>

                <div class="pt-2.5 border-t border-border flex items-center justify-between">
                  <span class="text-[10px] font-mono text-content-muted">Bat: ${st.batteryLevel}%</span>
                  <a href="#/stations/${st.id}" class="btn-primary text-xs px-3 py-1">
                    Inspect Node →
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="atmospheric-card overflow-hidden">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Station Code</th>
                  <th>Name</th>
                  <th>Region</th>
                  <th>Elevation</th>
                  <th>Status</th>
                  <th>Temp</th>
                  <th>Pressure</th>
                  <th>Humidity</th>
                  <th class="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(st => `
                  <tr>
                    <td class="font-mono font-bold text-content-secondary">${st.stationCode}</td>
                    <td class="font-medium text-content-primary">${st.name}</td>
                    <td class="text-content-muted">${st.region}</td>
                    <td class="font-mono text-content-muted">${st.elevationMeters}m</td>
                    <td>
                      <span class="${st.status === 'ONLINE' ? 'status-online' : (st.status === 'DEGRADED' ? 'status-degraded' : 'status-offline')}">
                        ${st.status}
                      </span>
                    </td>
                    <td class="font-mono text-content-primary tabular-nums">${st.currentTemperature != null ? st.currentTemperature + '°C' : '--'}</td>
                    <td class="font-mono text-content-primary tabular-nums">${st.currentPressure != null ? st.currentPressure + ' hPa' : '--'}</td>
                    <td class="font-mono text-content-primary tabular-nums">${st.currentHumidity != null ? st.currentHumidity + '%' : '--'}</td>
                    <td class="text-right">
                      <a href="#/stations/${st.id}" class="text-xs text-accent hover:underline font-medium">Inspect →</a>
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
            <div class="space-y-3 text-left">
              <div>
                <label class="block text-content-muted font-mono text-xs mb-1">STATION IDENTIFIER (e.g. AWS-808-SEA)</label>
                <input id="modal-new-code" type="text" class="form-input font-mono" placeholder="AWS-808-SEA" />
              </div>
              <div>
                <label class="block text-content-muted font-mono text-xs mb-1">FACILITY / OBSERVATORY NAME</label>
                <input id="modal-new-name" type="text" class="form-input" placeholder="Nordic Fjord Marine Mast" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-content-muted font-mono text-xs mb-1">REGION</label>
                  <input id="modal-new-region" type="text" class="form-input" placeholder="Scandinavian Coast" />
                </div>
                <div>
                  <label class="block text-content-muted font-mono text-xs mb-1">ELEVATION (m MSL)</label>
                  <input id="modal-new-elev" type="number" class="form-input font-mono" placeholder="45" />
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
