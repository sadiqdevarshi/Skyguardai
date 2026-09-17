import { api } from '../services/api.js';
import { renderSidebar } from '../components/Sidebar.js';
import { createAnomalyInvestigationChart } from '../services/charts.js';
import { showToast } from '../components/Toast.js';
import { showModal } from '../components/Modal.js';

export async function renderAnomalyDetailView(anomalyId) {
  const anomaly = await api.getAnomalyDetail(anomalyId || 1);

  const container = document.createElement('div');
  container.className = 'flex-1 flex w-full min-h-[calc(100vh-4rem)]';

  const sevClass = anomaly.severity === 'CRITICAL' ? 'status-critical' : 'status-warning';
  const statusClass = anomaly.status === 'OPEN' ? 'status-warning' : (anomaly.status === 'ACKNOWLEDGED' ? 'status-online' : 'text-content-muted');

  container.innerHTML = `
    ${renderSidebar('/anomalies')}

    <div class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl">
      
      <!-- Breadcrumb & Header -->
      <div class="space-y-2 border-b border-border pb-4">
        <a href="#/anomalies" class="text-xs text-accent hover:underline inline-flex items-center space-x-1 font-medium">
          <span>← Back to Anomaly Workspace</span>
        </a>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-3">
              <span class="${sevClass} font-mono text-xs">${anomaly.severity}</span>
              <h1 class="text-2xl font-bold text-content-primary tracking-tight">Incident #${anomaly.id}: ${anomaly.anomalyType} on ${anomaly.parameter}</h1>
            </div>
            <p class="text-xs text-content-secondary mt-1">Station: <strong class="text-content-primary">${anomaly.stationCode}</strong> (${anomaly.stationName}) • Region: ${anomaly.region}</p>
          </div>

          <!-- Status & Resolution Actions -->
          <div class="flex items-center space-x-3">
            <span id="current-anomaly-status" class="${statusClass} font-mono font-medium text-xs">
              ${anomaly.status}
            </span>

            ${anomaly.status !== 'RESOLVED' ? `
              <button id="resolve-anomaly-btn" class="btn-primary text-xs px-4 py-2">
                Acknowledge & Resolve Incident
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Investigation Metrics Panel (Disciplined Neutral Hierarchy) -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">OBSERVED TELEMETRY</span>
          <div class="text-2xl font-mono font-bold text-content-primary tabular-nums">${anomaly.observedValue}</div>
          <div class="text-[10px] text-content-muted font-mono">Flagged Transducer Value</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">EXPECTED BASELINE</span>
          <div class="text-2xl font-mono font-bold text-content-primary tabular-nums">${anomaly.expectedBaselineValue != null ? anomaly.expectedBaselineValue : 'N/A'}</div>
          <div class="text-[10px] text-content-muted font-mono">Diurnal Model Target</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">CONFIDENCE SCORE</span>
          <div class="text-2xl font-mono font-bold text-content-primary tabular-nums">${anomaly.confidenceScore}%</div>
          <div class="text-[10px] text-content-muted font-mono">Statistical Certainty</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">DETECTED TIMESTAMP</span>
          <div class="text-xs font-mono font-semibold text-content-primary mt-1 tabular-nums">${new Date(anomaly.detectedAt).toLocaleTimeString()}</div>
          <div class="text-[10px] text-content-muted font-mono">${new Date(anomaly.detectedAt).toLocaleDateString()}</div>
        </div>
      </div>

      <!-- Anomaly Chart: Observed vs Expected Baseline with Confidence Ribbon -->
      <div class="atmospheric-card p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
          <div>
            <h3 class="text-sm font-bold text-content-primary">Temporal Telemetry Deviation vs Statistical Envelope</h3>
            <span class="text-xs text-content-muted">Observed transducer divergence against the 95% confidence meteorological envelope</span>
          </div>
          <div class="flex items-center space-x-3 font-mono text-xs text-content-muted">
            <span class="text-rose-600 dark:text-rose-400 font-medium">● Observed Event</span>
            <span>- - Expected Baseline</span>
            <span>■ 95% Confidence Band</span>
          </div>
        </div>

        <div class="w-full h-[320px]">
          <canvas id="anomaly-investigation-chart"></canvas>
        </div>
      </div>

      <!-- Root Cause & Field Recommendation Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Root Cause Analysis -->
        <div class="atmospheric-card p-6 space-y-3">
          <div class="flex items-center justify-between border-b border-border pb-2">
            <h3 class="text-sm font-bold text-content-primary">Meteorological & Physical Diagnosis</h3>
            <span class="text-[10px] font-mono text-content-muted font-semibold uppercase">ROOT CAUSE</span>
          </div>
          <p class="text-xs text-content-secondary leading-relaxed font-sans">${anomaly.rootCauseExplanation}</p>
          <div class="pt-2 border-t border-border text-[11px] font-mono text-content-muted space-y-1">
            <div>Cross-Parameter Corroboration: <strong class="text-content-primary">ISOLATED CHANNEL</strong></div>
            <div>Neighboring Station Delta Check: <strong class="text-content-primary">NO CORRELATION</strong></div>
          </div>
        </div>

        <!-- Recommended Action -->
        <div class="atmospheric-card p-6 space-y-3">
          <div class="flex items-center justify-between border-b border-border pb-2">
            <h3 class="text-sm font-bold text-content-primary">Prescribed Engineering Action</h3>
            <span class="text-[10px] font-mono text-accent font-semibold uppercase">REMEDIATION</span>
          </div>
          <p class="text-xs text-content-secondary leading-relaxed font-sans">${anomaly.recommendedAction}</p>
          <div class="pt-2 border-t border-border text-[11px] font-mono text-content-muted space-y-1">
            <div>Suggested Action: <strong class="text-content-primary">ON-SITE RE-CALIBRATION / POWER RESET</strong></div>
            <div>Dispatch Priority: <strong class="text-content-primary">${anomaly.severity}</strong></div>
          </div>
        </div>

      </div>

      <!-- Operational Audit Timeline -->
      <div class="atmospheric-card p-5 space-y-4">
        <h3 class="text-sm font-bold text-content-primary pb-2 border-b border-border">Incident Lifecycle & Audit Trail</h3>
        
        <div class="space-y-3 text-xs font-mono">
          <div class="flex items-start space-x-3">
            <span class="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
            <div>
              <span class="text-content-primary font-semibold">AUTOMATED DETECTION & ISOLATION</span>
              <span class="text-content-muted text-[11px] ml-2">${new Date(anomaly.detectedAt).toLocaleString()}</span>
              <p class="text-content-secondary font-sans text-xs">Flagged by Spring Boot AnomalyDetectionService. Quality quarantine applied to station observation record.</p>
            </div>
          </div>

          ${anomaly.acknowledgedAt ? `
            <div class="flex items-start space-x-3">
              <span class="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
              <div>
                <span class="text-content-primary font-semibold">OPERATOR ACKNOWLEDGEMENT</span>
                <span class="text-content-muted text-[11px] ml-2">${new Date(anomaly.acknowledgedAt).toLocaleString()}</span>
                <p class="text-content-secondary font-sans text-xs">${anomaly.remarks || 'Acknowledged by duty meteorological operator.'}</p>
              </div>
            </div>
          ` : ''}

          ${anomaly.resolvedAt ? `
            <div class="flex items-start space-x-3">
              <span class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <div>
                <span class="text-content-primary font-semibold">INCIDENT RESOLUTION</span>
                <span class="text-content-muted text-[11px] ml-2">${new Date(anomaly.resolvedAt).toLocaleString()}</span>
                <p class="text-content-secondary font-sans text-xs">Telemetry restored to nominal state.</p>
              </div>
            </div>
          ` : ''}
        </div>
      </div>

    </div>
  `;

  // Attach Chart
  setTimeout(() => {
    const canvas = container.querySelector('#anomaly-investigation-chart');
    if (canvas) {
      createAnomalyInvestigationChart(canvas, anomaly);
    }
  }, 50);

  // Attach Resolve Action
  const resolveBtn = container.querySelector('#resolve-anomaly-btn');
  if (resolveBtn) {
    resolveBtn.onclick = () => {
      showModal({
        title: `Resolve Incident #${anomaly.id}`,
        content: `
          <div class="space-y-3 text-left">
            <p class="text-content-secondary text-xs">Enter engineering remarks or calibration outcome before marking this incident as RESOLVED:</p>
            <textarea id="modal-resolve-remarks" rows="3" class="form-input font-mono text-xs" placeholder="e.g. Cleaned hygrometer mesh and recalibrated zero-point offset. Transducer readings returned to physical baseline."></textarea>
          </div>
        `,
        confirmText: 'Mark Resolved',
        confirmClass: 'btn-primary',
        onConfirm: async () => {
          const remarks = document.getElementById('modal-resolve-remarks').value;
          await api.updateAnomalyStatus(anomaly.id, 'RESOLVED', remarks);
          showToast(`Anomaly #${anomaly.id} marked as RESOLVED`, 'success');
          window.location.hash = '#/anomalies';
        }
      });
    };
  }

  return container;
}

