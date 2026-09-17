import { auth } from '../services/auth.js';
import { showToast } from '../components/Toast.js';

export async function renderRegisterView() {
  const container = document.createElement('div');
  container.className = 'w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-12';

  container.innerHTML = `
    <div class="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-xl border border-border bg-surface shadow-card overflow-hidden">
      
      <!-- Left Panel: Meteorological Identity (5 cols) -->
      <div class="lg:col-span-5 bg-subtle border-b lg:border-b-0 lg:border-r border-border p-8 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden">
        
        <!-- Background Grid Pattern -->
        <div class="absolute inset-0 bg-grid-scientific opacity-40 pointer-events-none"></div>

        <div class="relative z-10 space-y-6">
          <!-- Brand Badge -->
          <div class="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-surface border border-border text-[10px] font-mono text-content-secondary">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>OPERATIONAL ONBOARDING</span>
          </div>

          <div class="space-y-2">
            <h2 class="text-xl sm:text-2xl font-extrabold text-content-primary tracking-tight">
              Join the Meteorological Intelligence Network
            </h2>
            <p class="text-xs text-content-secondary leading-relaxed">
              Provision a station operator, data analyst, or public observer profile to monitor Automatic Weather Station networks.
            </p>
          </div>
        </div>

        <!-- System Governance Highlights -->
        <div class="relative z-10 space-y-3 font-mono text-xs">
          <div class="p-3.5 rounded-lg bg-surface border border-border space-y-1">
            <div class="flex items-center justify-between text-content-muted text-[10px]">
              <span>ROLE-BASED GOVERNANCE</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-semibold">SPRING SEC</span>
            </div>
            <div class="text-xs font-semibold text-content-primary">Granular Transducer Triage Permissions</div>
          </div>

          <div class="p-3.5 rounded-lg bg-surface border border-border space-y-1">
            <div class="flex items-center justify-between text-content-muted text-[10px]">
              <span>AUDIT COMPLIANCE</span>
              <span class="text-accent font-semibold">WMO STANDARD</span>
            </div>
            <div class="text-xs font-semibold text-content-primary">Immutable Sensor Calibration Logs</div>
          </div>
        </div>

        <div class="relative z-10 text-[11px] text-content-muted font-mono flex items-center justify-between pt-4 border-t border-border">
          <span>Enterprise SSO Compatible</span>
          <span>v2.0.4</span>
        </div>

      </div>

      <!-- Right Panel: Registration Form (7 cols) -->
      <div class="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
        
        <div class="space-y-1.5">
          <h1 class="text-xl font-bold text-content-primary tracking-tight">Create Operator Account</h1>
          <p class="text-xs text-content-secondary">Register your credentials to access the Aerisence telemetry pipeline.</p>
        </div>

        <!-- Error message banner -->
        <div id="register-error" class="hidden p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium"></div>

        <form id="register-form" class="space-y-4 text-xs">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block font-medium text-content-primary">Full Name</label>
              <input 
                type="text" 
                id="reg-fullname" 
                required
                placeholder="Dr. Jane Mitchell"
                class="form-input text-xs"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block font-medium text-content-primary">Operator Username</label>
              <input 
                type="text" 
                id="reg-username" 
                required
                placeholder="jmitchell_ops"
                class="form-input text-xs font-mono"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block font-medium text-content-primary">Official Email Address</label>
            <input 
              type="email" 
              id="reg-email" 
              required
              placeholder="operator@observatory.org"
              class="form-input text-xs font-mono"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block font-medium text-content-primary">Password</label>
            <input 
              type="password" 
              id="reg-password" 
              required
              placeholder="Minimum 6 characters (BCrypt encrypted)"
              class="form-input text-xs font-mono"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block font-medium text-content-primary">Operational Role</label>
            <select id="reg-role" class="form-input text-xs font-mono">
              <option value="ROLE_OPERATOR">Station Operator (Triage & Anomaly Resolution)</option>
              <option value="ROLE_ANALYST">Meteorological Data Analyst (Reports & Trends)</option>
              <option value="ROLE_VIEWER">Public Observer (Read-Only Telemetry)</option>
            </select>
          </div>

          <button type="submit" id="reg-submit-btn" class="btn-primary w-full py-2.5 text-xs font-semibold justify-center shadow-card">
            <span>Create Account & Provision Session</span>
            <svg class="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>

        </form>

        <div class="text-center text-xs text-content-secondary pt-2">
          Already have an account? <a href="#/login" class="text-accent font-medium hover:underline">Sign In</a>
        </div>

      </div>

    </div>
  `;

  const form = container.querySelector('#register-form');
  const errorBox = container.querySelector('#register-error');

  form.onsubmit = async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');
    const submitBtn = container.querySelector('#reg-submit-btn');
    submitBtn.innerHTML = '<span>Creating operator account...</span>';
    submitBtn.disabled = true;

    try {
      await auth.register({
        fullName: container.querySelector('#reg-fullname').value.trim(),
        username: container.querySelector('#reg-username').value.trim(),
        email: container.querySelector('#reg-email').value.trim(),
        password: container.querySelector('#reg-password').value,
        role: container.querySelector('#reg-role').value
      });
      showToast('Account registered successfully', 'success');
      window.location.hash = '#/dashboard';
    } catch (err) {
      errorBox.innerText = err.message || 'Registration failed. Please check form values.';
      errorBox.classList.remove('hidden');
      submitBtn.innerHTML = '<span>Create Account & Provision Session</span><svg class="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>';
      submitBtn.disabled = false;
    }
  };

  return container;
}
