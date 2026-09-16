import { api } from '../services/api.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showToast } from '../components/Toast.js';

export async function renderAlertsView() {
  const alerts = await api.getAlerts();

  const container = document.createElement('div');
  container.className = 'flex-1 flex w-full min-h-[calc(100vh-4rem)]';

  const renderContent = () => {
    return `
      ${renderSidebar('/alerts')}

      <div class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aeris-850 pb-4">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">Alert Triage & Notification Center</h1>
            <p class="text-xs text-slate-400 mt-0.5">Real-time alerts triggered by anomaly threshold violations.</p>
          </div>

          <div class="flex items-center space-x-2 font-mono text-xs">
            <span class="p-2 rounded bg-aeris-900 border border-aeris-800 text-amber-400">
              ${alerts.filter(a => !a.acknowledged).length} Unacknowledged
            </span>
          </div>
        </div>

        <!-- Alert Cards Feed -->
        <div class="space-y-3">
          ${alerts.map(alert => `
            <div class="atmospheric-card p-5 space-y-3 border ${alert.acknowledged ? 'border-aeris-850 bg-aeris-950/40 opacity-75' : (alert.severity === 'CRITICAL' ? 'border-red-800/80 bg-red-950/15' : 'border-amber-800/60 bg-amber-950/15')}">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center space-x-2.5">
                  <span class="${alert.severity === 'CRITICAL' ? 'badge-critical' : 'badge-warning'} font-mono">${alert.severity}</span>
                  <span class="font-mono font-bold text-cyan-400 text-xs">${alert.stationCode}</span>
                  <h3 class="text-sm font-bold text-white">${alert.title}</h3>
                </div>

                <div class="flex items-center space-x-3 text-xs font-mono text-slate-400">
                  <span>${new Date(alert.createdAt).toLocaleString()}</span>
                  ${alert.acknowledged ? `
                    <span class="badge-online">ACKNOWLEDGED (${alert.acknowledgedBy || 'operator'})</span>
                  ` : `
                    <button class="ack-btn btn-primary text-xs px-3 py-1 font-mono" data-id="${alert.id}">
                      Acknowledge Alert
                    </button>
                  `}
                </div>
              </div>

              <p class="text-xs text-slate-300 leading-relaxed">${alert.message}</p>

              ${alert.anomalyId ? `
                <div class="pt-2 border-t border-aeris-800 flex justify-end">
                  <a href="#/anomalies/${alert.anomalyId}" class="text-xs text-cyan-400 hover:underline">
                    View Associated Anomaly Record →
                  </a>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

      </div>
    `;
  };

  const updateView = () => {
    container.innerHTML = renderContent();

    container.querySelectorAll('.ack-btn').forEach(btn => {
      btn.onclick = async () => {
        const id = btn.dataset.id;
        btn.innerText = 'Acknowledging...';
        btn.disabled = true;
        await api.acknowledgeAlert(id);
        showToast('Alert acknowledged successfully', 'success');
        updateView();
      };
    });
  };

  updateView();
  return container;
}
