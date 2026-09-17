import { auth } from '../services/auth.js';
import { showToast } from '../components/Toast.js';

export async function renderLoginView() {
  const container = document.createElement('div');
  container.className = 'w-full min-h-[80vh] flex items-center justify-center px-4 py-12';

  container.innerHTML = `
    <div class="max-w-md w-full atmospheric-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
      
      <!-- Header & Brand -->
      <div class="text-center space-y-2">
        <div class="inline-flex w-10 h-10 rounded-lg bg-accent text-content-inverted items-center justify-center p-2 shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="w-full h-full">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-content-primary tracking-tight">Aerisence Mission Access</h2>
        <p class="text-xs text-content-secondary">Enter authenticated operator or analyst credentials</p>
      </div>

      <!-- Error Message Banner -->
      <div id="login-error" class="hidden p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium"></div>

      <!-- Form -->
      <form id="login-form" class="space-y-4 text-xs">
        <div class="space-y-1.5">
          <label class="block font-medium text-content-primary">Username or Email</label>
          <input 
            type="text" 
            id="login-username" 
            required
            placeholder="e.g. operator or admin"
            class="form-input text-xs font-mono"
          />
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block font-medium text-content-primary">Password</label>
            <span class="text-[11px] text-content-muted font-mono">Encrypted BCrypt</span>
          </div>
          <input 
            type="password" 
            id="login-password" 
            required
            placeholder="••••••••••••"
            class="form-input text-xs font-mono"
          />
        </div>

        <button type="submit" id="login-submit-btn" class="btn-primary w-full py-2.5 text-xs font-semibold justify-center">
          Authenticate Session →
        </button>
      </form>

      <!-- Quick Demo Access Credentials -->
      <div class="pt-4 border-t border-border space-y-2">
        <span class="text-[10px] font-mono text-content-muted uppercase block text-center">QUICK FILL OPERATIONAL ROLES</span>
        <div class="grid grid-cols-3 gap-2 text-[11px] font-mono">
          <button type="button" class="quick-role-btn p-2 rounded-lg bg-subtle border border-border hover:border-accent text-content-secondary hover:text-content-primary text-center transition-colors" data-user="admin" data-pass="Admin@Aerisence2026!">
            <span class="text-content-primary font-bold block">ADMIN</span>
            <span class="text-[9px] text-content-muted">Full Ops</span>
          </button>
          <button type="button" class="quick-role-btn p-2 rounded-lg bg-subtle border border-border hover:border-accent text-content-secondary hover:text-content-primary text-center transition-colors" data-user="operator" data-pass="Operator@Aerisence2026!">
            <span class="text-content-primary font-bold block">OPERATOR</span>
            <span class="text-[9px] text-content-muted">Triage</span>
          </button>
          <button type="button" class="quick-role-btn p-2 rounded-lg bg-subtle border border-border hover:border-accent text-content-secondary hover:text-content-primary text-center transition-colors" data-user="analyst" data-pass="Analyst@Aerisence2026!">
            <span class="text-content-primary font-bold block">ANALYST</span>
            <span class="text-[9px] text-content-muted">Reports</span>
          </button>
        </div>
      </div>

      <div class="text-center text-xs text-content-secondary">
        Need to register a new station? <a href="#/register" class="text-accent font-medium hover:underline">Register account</a>
      </div>

    </div>
  `;

  // Attach handlers
  const form = container.querySelector('#login-form');
  const errorBox = container.querySelector('#login-error');
  const userInput = container.querySelector('#login-username');
  const passInput = container.querySelector('#login-password');

  container.querySelectorAll('.quick-role-btn').forEach(btn => {
    btn.onclick = () => {
      userInput.value = btn.dataset.user;
      passInput.value = btn.dataset.pass;
    };
  });

  form.onsubmit = async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');
    const submitBtn = container.querySelector('#login-submit-btn');
    submitBtn.innerText = 'Authenticating...';
    submitBtn.disabled = true;

    try {
      await auth.login(userInput.value.trim(), passInput.value);
      showToast(`Welcome back, ${userInput.value.trim()}`, 'success');
      window.location.hash = '#/dashboard';
    } catch (err) {
      errorBox.innerText = err.message || 'Authentication failed. Please check your credentials.';
      errorBox.classList.remove('hidden');
      submitBtn.innerText = 'Authenticate Session →';
      submitBtn.disabled = false;
    }
  };

  return container;
}

