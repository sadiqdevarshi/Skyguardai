import { api } from '../services/api.js';
import { renderSidebar } from '../components/Sidebar.js';
import { createAnomalyInvestigationChart } from '../services/charts.js';
import { showToast } from '../components/Toast.js';
import { showModal } from '../components/Modal.js';

export async function renderAnomalyDetailView(anomalyId) {
  const anomaly = await api.getAnomalyDetail(anomalyId || 1);

  const container = document.createElement('div');
  container.className = 'flex-1 flex w-full min-h-[calc(100vh-4rem)]';

  container.innerHTML = `
    ${renderSidebar('/anomalies')}

    <div class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl">
      
      <!-- Breadcrumb & Header -->
      <div class="space-y-2 border-b border-aeris-850 pb-4">
        <a href="#/anomalies" class="text-xs text-cyan-400 hover:underline inline-flex items-center space-x-1">
          <span>← Back to Anomaly Workspace</span>
        </a>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-3">
              <span class="${anomaly.severity === 'CRITICAL' ? 'badge-critical' : 'badge-warning'} font-mono text-xs">${anomaly.severity}</span>
              <h1 class="text-2xl font-bold text-white tracking-tight">Incident #${anomaly.id}: ${anomaly.anomalyType} on ${anomaly.parameter}</h1>
            </div>
            <p class="text-xs text-slate-400 mt-1">Station: <strong class="text-slate-200">${anomaly.stationCode}</strong> (${anomaly.stationName}) • Region: ${anomaly.region}</p>
          </div>

          <!-- Status & Resolution Actions -->
          <div class="flex items-center space-x-3">
            <span id="current-anomaly-status" class="px-3 py-1 rounded-full text-xs font-bold font-mono ${anomaly.status === 'OPEN' ? 'bg-amber-950 text-amber-300 border border-amber-800' : (anomaly.status === 'ACKNOWLEDGED' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800')}">
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

      <!-- Investigation Metrics Panel -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-slate-400 uppercase">OBSERVED TELEMETRY</span>
          <div class="text-2xl font-mono font-bold text-rose-400">${anomaly.observedValue}</div>
          <div class="text-[10px] text-slate-400 font-mono">Flagged Transducer Value</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-slate-400 uppercase">EXPECTED BASELINE</span>
          <div class="text-2xl font-mono font-bold text-cyan-400">${anomaly.expectedBaselineValue != null ? anomaly.expectedBaselineValue : 'N/A'}</div>
          <div class="text-[10px] text-slate-400 font-mono">Diurnal Model Target</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-slate-400 uppercase">CONFIDENCE SCORE</span>
          <div class="text-2xl font-mono font-bold text-emerald-400">${anomaly.confidenceScore}%</div>
          <div class="text-[10px] text-slate-400 font-mono">Statistical Certainty</div>
        </div>

        <div class="atmospheric-card p-4 space-y-1">
          <span class="text-[10px] font-mono text-slate-400 uppercase">DETECTED TIMESTAMP</span>
          <div class="text-xs font-mono font-bold text-slate-200 mt-1">${new Date(anomaly.detectedAt).toLocaleTimeString()}</div>
          <div class="text-[10px] text-slate-400 font-mono">${new Date(anomaly.detectedAt).toLocaleDateString()}</div>
        </div>
      </div>

      <!-- Anomaly Chart: Observed vs Expected Baseline with Confidence Ribbon -->
      <div class="atmospheric-card p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-aeris-800">
          <div>
            <h3 class="text-sm font-bold text-white">Temporal Telemetry Deviation vs Statistical Envelope</h3>
            <span class="text-xs text-slate-400">Observed transducer divergence against the 95% confidence meteorological envelope</span>
          </div>
          <div class="flex items-center space-x-3 font-mono text-xs">
            <span class="text-rose-400">● Observed Event</span>
            <span class="text-cyan-400">--- Expected Baseline</span>
            <span class="text-slate-400">■ 95% Confidence Band</span>
          </div>
        </div>

        <div class="w-full h-[320px]">
          <canvas id="anomaly-investigation-chart"></canvas>
        </div>
      </div>

      <!-- Root Cause & Field Recommendation Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Root Cause Analysis -->
        <div class="atmospheric-card p-6 space-y-3 border-l-4 border-l-amber-500">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-100">Meteorological & Physical Diagnosis</h3>
            <span class="text-[10px] font-mono text-amber-400">ROOT CAUSE</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed font-sans">${anomaly.rootCauseExplanation}</p>
          <div class="pt-2 border-t border-aeris-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div>Cross-Parameter Corroboration: <strong class="text-cyan-400">ISOLATED CHANNEL</strong></div>
            <div>Neighboring Station Delta Check: <strong class="text-slate-200">NO CORRELATION</strong></div>
          </div>
        </div>

        <!-- Recommended Action -->
        <div class="atmospheric-card p-6 space-y-3 border-l-4 border-l-cyan-500">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-100">Prescribed Engineering Action</h3>
            <span class="text-[10px] font-mono text-cyan-400">REMEDIATION</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed font-sans">${anomaly.recommendedAction}</p>
          <div class="pt-2 border-t border-aeris-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div>Suggested Action: <strong class="text-amber-400">ON-SITE RE-CALIBRATION / POWER RESET</strong></div>
            <div>Dispatch Priority: <strong class="text-white">${anomaly.severity}</strong></div>
          </div>
        </div>

      </div>

      <!-- Operational Audit Timeline -->
      <div class="atmospheric-card p-5 space-y-4">
        <h3 class="text-sm font-bold text-white pb-2 border-b border-aeris-800">Incident Lifecycle & Audit Trail</h3>
        
        <div class="space-y-3 text-xs font-mono">
          <div class="flex items-start space-x-3">
            <span class="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
            <div>
              <span class="text-slate-200 font-bold">AUTOMATED DETECTION & ISOLATION</span>
              <span class="text-slate-500 text-[11px] ml-2">${new Date(anomaly.detectedAt).toLocaleString()}</span>
              <p class="text-slate-400 font-sans text-xs">Flagged by Spring Boot AnomalyDetectionService. Quality quarantine applied to station observation record.</p>
            </div>
          </div>

          ${anomaly.acknowledgedAt ? `
            <div class="flex items-start space-x-3">
              <span class="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
              <div>
                <span class="text-slate-200 font-bold">OPERATOR ACKNOWLEDGEMENT</span>
                <span class="text-slate-500 text-[11px] ml-2">${new Date(anomaly.acknowledgedAt).toLocaleString()}</span>
                <p class="text-slate-400 font-sans text-xs">${anomaly.remarks || 'Acknowledged by duty meteorological operator.'}</p>
              </div>
            </div>
          ` : ''}

          ${anomaly.resolvedAt ? `
            <div class="flex items-start space-x-3">
              <span class="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <div>
                <span class="text-slate-200 font-bold">INCIDENT RESOLUTION</span>
                <span class="text-slate-500 text-[11px] ml-2">${new Date(anomaly.resolvedAt).toLocaleString()}</span>
                <p class="text-slate-400 font-sans text-xs">Telemetry restored to nominal state.</p>
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
          <div class="space-y-3">
            <p class="text-slate-300">Enter engineering remarks or calibration outcome before marking this incident as RESOLVED:</p>
            <textarea id="modal-resolve-remarks" rows="3" class="w-full p-2.5 bg-aeris-950 border border-aeris-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-400" placeholder="e.g. Cleaned hygrometer mesh and recalibrated zero-point offset. Transducer readings returned to physical baseline."></textarea>
          </div>
        `,
        confirmText: 'Mark Resolved',
        confirmClass: 'btn-primary',
        onConfirm: async () => {
          const remarks = document.getElementById('modal-resolve-remarks').value;
          await api.updateAnomalyStatus(anomaly.id, 'RESOLVED', remarks);
          showToast(`Anomaly #${anomaly.id} marked as RESOLVED`, 'success');
          // Reload view
          window.location.hash = '#/anomalies';
        }
      });
    };
  }

  return container;
}
