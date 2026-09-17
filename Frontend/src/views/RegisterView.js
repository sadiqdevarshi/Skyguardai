import { auth } from '../services/auth.js';
import { showToast } from '../components/Toast.js';

export async function renderRegisterView() {
  const container = document.createElement('div');
  container.className = 'w-full min-h-[80vh] flex items-center justify-center px-4 py-12';

  container.innerHTML = `
    <div class="max-w-md w-full atmospheric-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
      
      <div class="text-center space-y-2">
        <h2 class="text-xl font-bold text-content-primary tracking-tight">Register Weather Operator</h2>
        <p class="text-xs text-content-secondary">Provision a new meteorological station operator account</p>
      </div>

      <div id="register-error" class="hidden p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium"></div>

      <form id="register-form" class="space-y-4 text-xs">
        <div class="space-y-1.5">
          <label class="block font-medium text-content-primary">Full Name</label>
          <input 
            type="text" 
            id="reg-fullname" 
            required
            placeholder="e.g. Dr. Jane Mitchell"
            class="form-input text-xs"
          />
        </div>

        <div class="space-y-1.5">
          <label class="block font-medium text-content-primary">Operator Username</label>
          <input 
            type="text" 
            id="reg-username" 
            required
            placeholder="e.g. jmitchell_ops"
            class="form-input text-xs font-mono"
          />
        </div>

        <div class="space-y-1.5">
          <label class="block font-medium text-content-primary">Official Email</label>
          <input 
            type="email" 
            id="reg-email" 
            required
            placeholder="operator@observatory.org"
            class="form-input text-xs"
          />
        </div>

        <div class="space-y-1.5">
          <label class="block font-medium text-content-primary">Password</label>
          <input 
            type="password" 
            id="reg-password" 
            required
            placeholder="Minimum 6 characters"
            class="form-input text-xs font-mono"
          />
        </div>

        <div class="space-y-1.5">
          <label class="block font-medium text-content-primary">Operational Role</label>
          <select id="reg-role" class="form-input text-xs">
            <option value="ROLE_OPERATOR">Station Operator</option>
            <option value="ROLE_ANALYST">Meteorological Data Analyst</option>
            <option value="ROLE_VIEWER">Public Observer</option>
          </select>
        </div>

        <button type="submit" id="reg-submit-btn" class="btn-primary w-full py-2.5 text-xs font-semibold justify-center">
          Create Account & Ingest →
        </button>
      </form>

      <div class="text-center text-xs text-content-secondary">
        Already have credentials? <a href="#/login" class="text-accent font-medium hover:underline">Sign In</a>
      </div>

    </div>
  `;

  const form = container.querySelector('#register-form');
  const errorBox = container.querySelector('#register-error');

  form.onsubmit = async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');
    const submitBtn = container.querySelector('#reg-submit-btn');
    submitBtn.innerText = 'Creating account...';
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
      errorBox.innerText = err.message || 'Registration failed.';
      errorBox.classList.remove('hidden');
      submitBtn.innerText = 'Create Account & Ingest →';
      submitBtn.disabled = false;
    }
  };

  return container;
}

