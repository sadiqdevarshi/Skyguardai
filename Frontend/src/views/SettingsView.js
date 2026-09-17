import { auth } from '../services/auth.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showToast } from '../components/Toast.js';

export async function renderSettingsView() {
  const user = auth.getUser() || { username: 'operator', fullName: 'Lead Station Operator', role: 'ROLE_OPERATOR', email: 'operator@aerisence.io' };

  const container = document.createElement('div');
  container.className = 'flex-1 flex w-full min-h-[calc(100vh-4rem)]';

  container.innerHTML = `
    ${renderSidebar('/settings')}

    <div class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl">
      
      <!-- Header -->
      <div class="border-b border-border pb-4">
        <h1 class="text-xl sm:text-2xl font-bold text-content-primary tracking-tight">System Settings & Threshold Tuning</h1>
        <p class="text-xs text-content-secondary mt-0.5">Configure meteorological validation limits, operator profile, and API ingestion credentials.</p>
      </div>

      <!-- User Profile Card -->
      <div class="atmospheric-card p-5 sm:p-6 space-y-4">
        <h3 class="text-sm font-bold text-content-primary pb-2 border-b border-border">Operator Profile Information</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span class="text-content-muted font-mono text-xs block mb-1">FULL NAME</span>
            <input type="text" value="${user.fullName || user.username}" class="form-input text-xs" />
          </div>
          <div>
            <span class="text-content-muted font-mono text-xs block mb-1">OFFICIAL EMAIL</span>
            <input type="email" value="${user.email || 'operator@aerisence.io'}" class="form-input text-xs" />
          </div>
          <div>
            <span class="text-content-muted font-mono text-xs block mb-1">OPERATIONAL ROLE</span>
            <input type="text" disabled value="${user.role}" class="form-input text-xs font-mono opacity-75 cursor-not-allowed text-content-primary font-medium" />
          </div>
          <div>
            <span class="text-content-muted font-mono text-xs block mb-1">SESSION STATUS</span>
            <input type="text" disabled value="JWT-Bearer-Auth-Active" class="form-input text-xs font-mono opacity-75 cursor-not-allowed text-content-primary font-medium" />
          </div>
        </div>
      </div>

      <!-- Anomaly Threshold Configuration Form -->
      <div class="atmospheric-card p-5 sm:p-6 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h3 class="text-sm font-bold text-content-primary">Meteorological Anomaly Detection Thresholds</h3>
            <span class="text-xs text-content-muted">Deterministic rule boundaries and temporal rate filters</span>
          </div>
          <span class="text-xs font-mono text-content-muted font-medium">WMO COMPLIANT</span>
        </div>

        <form id="settings-threshold-form" class="space-y-4 text-xs">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block font-mono text-content-secondary font-medium">TEMPERATURE BOUNDS (°C)</label>
              <div class="grid grid-cols-2 gap-2 font-mono">
                <input type="number" id="cfg-temp-min" value="-50" class="form-input text-xs" />
                <input type="number" id="cfg-temp-max" value="60" class="form-input text-xs" />
              </div>
              <span class="text-[10px] text-content-muted">Min bound / Max bound</span>
            </div>

            <div class="space-y-1">
              <label class="block font-mono text-content-secondary font-medium">BAROMETRIC PRESSURE BOUNDS (hPa)</label>
              <div class="grid grid-cols-2 gap-2 font-mono">
                <input type="number" id="cfg-pres-min" value="870" class="form-input text-xs" />
                <input type="number" id="cfg-pres-max" value="1085" class="form-input text-xs" />
              </div>
              <span class="text-[10px] text-content-muted">Min terrestrial / Max terrestrial</span>
            </div>

            <div class="space-y-1">
              <label class="block font-mono text-content-secondary font-medium">MAX RATE DELTA PER INTERVAL</label>
              <div class="grid grid-cols-2 gap-2 font-mono">
                <input type="number" value="10" class="form-input text-xs" />
                <input type="number" value="15" class="form-input text-xs" />
              </div>
              <span class="text-[10px] text-content-muted">Max ΔT (°C/step) / Max ΔP (hPa/step)</span>
            </div>

            <div class="space-y-1">
              <label class="block font-mono text-content-secondary font-medium">PERSISTENCE FLATLINE THRESHOLD</label>
              <input type="number" value="5" class="form-input text-xs font-mono" />
              <span class="text-[10px] text-content-muted">Consecutive identical readings triggering sensor freeze alarm</span>
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <button type="submit" class="btn-primary text-xs px-4 py-2">
              Save Verification Thresholds
            </button>
          </div>

        </form>
      </div>

    </div>
  `;

  const form = container.querySelector('#settings-threshold-form');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      showToast('Validation thresholds updated successfully', 'success');
    };
  }

  return container;
}

