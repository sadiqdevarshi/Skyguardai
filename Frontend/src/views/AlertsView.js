import { api } from '../services/api.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showToast } from '../components/Toast.js';

export async function renderAlertsView() {
  const alerts = await api.getAlerts();

  const container = document.createElement('div');
  container.className = 'flex-1 flex w-full min-h-[calc(100vh-4rem)]';

  const renderContent = () => {
    const unackCount = alerts.filter(a => !a.acknowledged).length;

    return `
      ${renderSidebar('/alerts')}

      <div class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-content-primary tracking-tight">Alert Triage & Notification Center</h1>
            <p class="text-xs text-content-secondary mt-0.5">Real-time alerts triggered by anomaly threshold violations.</p>
          </div>

          <div class="flex items-center space-x-2 font-mono text-xs">
            <span class="p-2 rounded-lg bg-subtle border border-border text-content-secondary">
              <strong class="text-content-primary tabular-nums font-semibold">${unackCount}</strong> Unacknowledged
            </span>
          </div>
        </div>

        <!-- Alert Cards Feed -->
        <div class="space-y-3">
          ${alerts.map(alert => {
            const sevClass = alert.severity === 'CRITICAL' ? 'status-critical' : 'status-warning';
            return `
              <div class="atmospheric-card p-5 space-y-3 ${alert.acknowledged ? 'opacity-70' : ''}">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div class="flex items-center space-x-2.5">
                    <span class="${sevClass} font-mono">${alert.severity}</span>
                    <span class="font-mono text-xs px-2 py-0.5 rounded bg-subtle text-content-secondary border border-border">${alert.stationCode}</span>
                    <h3 class="text-sm font-bold text-content-primary">${alert.title}</h3>
                  </div>

                  <div class="flex items-center space-x-3 text-xs font-mono text-content-muted">
                    <span class="tabular-nums">${new Date(alert.createdAt).toLocaleString()}</span>
                    ${alert.acknowledged ? `
                      <span class="status-online">ACKNOWLEDGED (${alert.acknowledgedBy || 'operator'})</span>
                    ` : `
                      <button class="ack-btn btn-primary text-xs px-3 py-1 font-mono" data-id="${alert.id}">
                        Acknowledge Alert
                      </button>
                    `}
                  </div>
                </div>

                <p class="text-xs text-content-secondary leading-relaxed">${alert.message}</p>

                ${alert.anomalyId ? `
                  <div class="pt-2 border-t border-border flex justify-end">
                    <a href="#/anomalies/${alert.anomalyId}" class="text-xs text-accent hover:underline font-medium">
                      View Associated Anomaly Record →
                    </a>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
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

