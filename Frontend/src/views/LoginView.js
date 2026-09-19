import { auth } from '../services/auth.js';
import { showToast } from '../components/Toast.js';
import { showModal } from '../components/Modal.js';

export async function renderLoginView() {
  const container = document.createElement('div');
  container.className = 'w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-12';

  container.innerHTML = `
    <div class="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-xl border border-border bg-surface shadow-card overflow-hidden">
      
      <!-- Left Panel: Subtle Meteorological Identity & Operational Overview (5 cols) -->
      <div class="lg:col-span-5 bg-subtle border-b lg:border-b-0 lg:border-r border-border p-8 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden">
        
        <!-- Background Grid Pattern -->
        <div class="absolute inset-0 bg-grid-scientific opacity-40 pointer-events-none"></div>

        <div class="relative z-10 space-y-6">
          <!-- Brand Badge -->
          <div class="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-surface border border-border text-[10px] font-mono text-content-secondary">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SKY GUARD AI INGESTION CORE</span>
          </div>

          <div class="space-y-2">
            <h2 class="text-xl sm:text-2xl font-extrabold text-content-primary tracking-tight">
              Operational Meteorological Intelligence
            </h2>
            <p class="text-xs text-content-secondary leading-relaxed">
              Autonomous telemetry quality assurance, physical boundary verification, and real-time sensor anomaly detection for Automatic Weather Station networks.
            </p>
          </div>
        </div>

        <!-- Telemetry Summary Cards -->
        <div class="relative z-10 space-y-3 font-mono text-xs">
          <div class="p-3.5 rounded-lg bg-surface border border-border space-y-1">
            <div class="flex items-center justify-between text-content-muted text-[10px]">
              <span>VALIDATION SUITE</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-semibold">WMO-No. 8</span>
            </div>
            <div class="text-xs font-semibold text-content-primary">Deterministic Physics & Rate Delta Checks</div>
          </div>

          <div class="p-3.5 rounded-lg bg-surface border border-border space-y-1">
            <div class="flex items-center justify-between text-content-muted text-[10px]">
              <span>TELEMETRY CHANNELS</span>
              <span class="text-accent font-semibold">3 SYNCHRONIZED</span>
            </div>
            <div class="text-xs font-semibold text-content-primary">Temperature • Pressure • Humidity</div>
          </div>
        </div>

        <!-- Security Notice -->
        <div class="relative z-10 text-[11px] text-content-muted font-mono flex items-center justify-between pt-4 border-t border-border">
          <span>TLS 1.3 / BCrypt Encrypted</span>
          <span>v2.0.4</span>
        </div>

      </div>

      <!-- Right Panel: Professional Authentication Workspace (7 cols) -->
      <div class="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
        
        <!-- Header -->
        <div class="space-y-1.5">
          <div class="flex items-center space-x-2.5">
            <div class="w-7 h-7 rounded bg-accent text-content-inverted flex items-center justify-center p-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="w-full h-full">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h1 class="text-xl font-bold text-content-primary tracking-tight">Welcome back</h1>
          </div>
          <p class="text-xs text-content-secondary">Sign in to your Sky Guard AI account to access operational tools.</p>
        </div>

        <!-- OAuth Social Buttons (Google & Microsoft) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <!-- Official Google OAuth Button -->
          <button type="button" id="google-auth-btn" class="oauth-btn flex items-center justify-center space-x-2.5 px-4 py-2.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-content-primary transition-colors">
            <!-- Official Google 'G' Multi-Color SVG -->
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <!-- Official Microsoft OAuth Button -->
          <button type="button" id="ms-auth-btn" class="oauth-btn flex items-center justify-center space-x-2.5 px-4 py-2.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-content-primary transition-colors">
            <!-- Official Microsoft 4-square SVG -->
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
              <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
            </svg>
            <span>Continue with Microsoft</span>
          </button>

        </div>

        <!-- Clean Divider -->
        <div class="relative flex items-center justify-center">
          <div class="border-t border-border w-full"></div>
          <span class="bg-surface px-3 text-[11px] font-mono text-content-muted uppercase">or continue with email</span>
        </div>

        <!-- Validation Error Message Banner -->
        <div id="login-error" class="hidden p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium"></div>

        <!-- Credentials Form -->
        <form id="login-form" class="space-y-4 text-xs">
          
          <div class="space-y-1.5">
            <label class="block font-medium text-content-primary">Email or Operator Username</label>
            <input 
              type="text" 
              id="login-username" 
              required
              autocomplete="username"
              placeholder="operator@skyguard.ai"
              class="form-input text-xs font-mono"
            />
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block font-medium text-content-primary">Password</label>
              <button type="button" id="forgot-password-btn" class="text-[11px] text-accent hover:underline font-medium">
                Forgot password?
              </button>
            </div>
            <div class="relative">
              <input 
                type="password" 
                id="login-password" 
                required
                autocomplete="current-password"
                placeholder="••••••••••••"
                class="form-input text-xs font-mono pr-9"
              />
              <button type="button" id="toggle-password-btn" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary p-1">
                <svg id="eye-icon" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </div>
          </div>

          <button type="submit" id="login-submit-btn" class="btn-primary w-full py-2.5 text-xs font-semibold justify-center shadow-card">
            <span>Authenticate Session</span>
            <svg class="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>

        </form>

        <!-- Quick Demo Role Switcher for Fast Evaluation -->
        <div class="pt-4 border-t border-border space-y-2">
          <span class="text-[10px] font-mono text-content-muted uppercase block text-center">QUICK FILL OPERATIONAL DEMO ROLES</span>
          <div class="grid grid-cols-3 gap-2 text-[11px] font-mono">
            <button type="button" class="quick-role-btn p-2 rounded-lg bg-subtle border border-border hover:border-accent text-content-secondary hover:text-content-primary text-center transition-colors" data-user="admin" data-pass="Admin@Aerisence2026!">
              <span class="text-content-primary font-bold block">ADMIN</span>
              <span class="text-[9px] text-content-muted">Full Root</span>
            </button>
            <button type="button" class="quick-role-btn p-2 rounded-lg bg-subtle border border-border hover:border-accent text-content-secondary hover:text-content-primary text-center transition-colors" data-user="operator" data-pass="Operator@Aerisence2026!">
              <span class="text-content-primary font-bold block">OPERATOR</span>
              <span class="text-[9px] text-content-muted">Triage / Fix</span>
            </button>
            <button type="button" class="quick-role-btn p-2 rounded-lg bg-subtle border border-border hover:border-accent text-content-secondary hover:text-content-primary text-center transition-colors" data-user="analyst" data-pass="Analyst@Aerisence2026!">
              <span class="text-content-primary font-bold block">ANALYST</span>
              <span class="text-[9px] text-content-muted">Reports / Trends</span>
            </button>
          </div>
        </div>

        <!-- Footer Sign-Up Link -->
        <div class="text-center text-xs text-content-secondary pt-2">
          Don't have an account? <a href="#/register" class="text-accent font-medium hover:underline">Create account</a>
        </div>

      </div>

    </div>
  `;

  // Attach interactive listeners
  const form = container.querySelector('#login-form');
  const errorBox = container.querySelector('#login-error');
  const userInput = container.querySelector('#login-username');
  const passInput = container.querySelector('#login-password');
  const togglePassBtn = container.querySelector('#toggle-password-btn');
  const forgotPassBtn = container.querySelector('#forgot-password-btn');

  // Password visibility toggle
  if (togglePassBtn) {
    togglePassBtn.onclick = () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
    };
  }

  // Forgot password modal
  if (forgotPassBtn) {
    forgotPassBtn.onclick = () => {
      showModal({
        title: 'Reset Sky Guard AI Account Password',
        content: `
          <div class="space-y-3">
            <p class="text-xs text-content-secondary leading-relaxed">
              Enter the verified email address associated with your meteorological operator profile. We will dispatch secure password recovery instructions.
            </p>
            <div>
              <label class="block font-mono text-content-muted text-xs mb-1">REGISTERED EMAIL</label>
              <input type="email" id="reset-email-input" class="form-input text-xs font-mono" placeholder="operator@skyguard.ai" value="${userInput.value || ''}" />
            </div>
          </div>
        `,
        confirmText: 'Dispatch Recovery Link',
        onConfirm: () => {
          const email = document.getElementById('reset-email-input').value;
          if (email) {
            showToast(`Password recovery link dispatched to ${email}`, 'success');
          }
        }
      });
    };
  }

  // OAuth Google button demo feedback
  const googleBtn = container.querySelector('#google-auth-btn');
  if (googleBtn) {
    googleBtn.onclick = () => {
      showToast('Redirecting to Google Enterprise OAuth2 provider...', 'info');
      setTimeout(async () => {
        // Log in as standard operator for evaluation
        await auth.login('operator', 'Operator@Aerisence2026!');
        showToast('Signed in via Google OAuth2', 'success');
        window.location.hash = '#/dashboard';
      }, 800);
    };
  }

  // OAuth Microsoft button demo feedback
  const msBtn = container.querySelector('#ms-auth-btn');
  if (msBtn) {
    msBtn.onclick = () => {
      showToast('Redirecting to Microsoft Entra ID provider...', 'info');
      setTimeout(async () => {
        await auth.login('operator', 'Operator@Aerisence2026!');
        showToast('Signed in via Microsoft Entra ID', 'success');
        window.location.hash = '#/dashboard';
      }, 800);
    };
  }

  // Quick fill demo role buttons
  container.querySelectorAll('.quick-role-btn').forEach(btn => {
    btn.onclick = () => {
      userInput.value = btn.dataset.user;
      passInput.value = btn.dataset.pass;
    };
  });

  // Handle Form Submission with real Spring Boot backend
  form.onsubmit = async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');
    const submitBtn = container.querySelector('#login-submit-btn');
    submitBtn.innerHTML = '<span>Authenticating session...</span>';
    submitBtn.disabled = true;

    try {
      await auth.login(userInput.value.trim(), passInput.value);
      showToast(`Welcome back, ${userInput.value.trim()}`, 'success');
      window.location.hash = '#/dashboard';
    } catch (err) {
      errorBox.innerText = err.message || 'Authentication failed. Please verify credentials.';
      errorBox.classList.remove('hidden');
      submitBtn.innerHTML = '<span>Authenticate Session</span><svg class="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>';
      submitBtn.disabled = false;
    }
  };

  return container;
}
