import { auth } from '../services/auth.js';
import { showToast } from '../components/Toast.js';

export async function renderLoginView() {
  const container = document.createElement('div');
  container.className = 'w-full min-h-[80vh] flex items-center justify-center px-4 py-12';

  container.innerHTML = `
    <div class="max-w-md w-full atmospheric-card p-8 space-y-6 relative overflow-hidden">
      
      <!-- Header & Brand -->
      <div class="text-center space-y-2">
        <div class="inline-flex w-10 h-10 rounded-lg bg-teal-600 text-white items-center justify-center p-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Aerisence Mission Access</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">Enter authenticated operator or analyst credentials</p>
      </div>

      <!-- Error Message Banner -->
      <div id="login-error" class="hidden p-3 rounded-lg bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium"></div>

      <!-- Form -->
      <form id="login-form" class="space-y-4 text-xs">
        <div class="space-y-1.5">
          <label class="block font-medium text-slate-700 dark:text-slate-300">Username or Email</label>
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
            <label class="block font-medium text-slate-700 dark:text-slate-300">Password</label>
            <span class="text-[11px] text-slate-500 font-mono">Encrypted BCrypt</span>
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
      <div class="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <span class="text-[10px] font-mono text-slate-500 uppercase block text-center">QUICK FILL OPERATIONAL ROLES</span>
        <div class="grid grid-cols-3 gap-2 text-[11px] font-mono">
          <button type="button" class="quick-role-btn p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-center transition-colors" data-user="admin" data-pass="Admin@Aerisence2026!">
            <span class="text-teal-700 dark:text-teal-400 font-bold block">ADMIN</span>
            <span class="text-[9px] text-slate-500">Full Ops</span>
          </button>
          <button type="button" class="quick-role-btn p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-center transition-colors" data-user="operator" data-pass="Operator@Aerisence2026!">
            <span class="text-emerald-700 dark:text-emerald-400 font-bold block">OPERATOR</span>
            <span class="text-[9px] text-slate-500">Triage</span>
          </button>
          <button type="button" class="quick-role-btn p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-center transition-colors" data-user="analyst" data-pass="Analyst@Aerisence2026!">
            <span class="text-amber-700 dark:text-amber-400 font-bold block">ANALYST</span>
            <span class="text-[9px] text-slate-500">Reports</span>
          </button>
        </div>
      </div>

      <div class="text-center text-xs text-slate-500 dark:text-slate-400">
        Need to register a new station? <a href="#/register" class="text-teal-700 dark:text-teal-400 font-medium hover:underline">Register account</a>
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
