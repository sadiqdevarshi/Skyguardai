export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const borderColors = {
    info: 'border-cyan-500 bg-aeris-900/90 text-cyan-200',
    success: 'border-emerald-500 bg-emerald-950/90 text-emerald-200',
    warning: 'border-amber-500 bg-amber-950/90 text-amber-200',
    error: 'border-rose-500 bg-rose-950/90 text-rose-200'
  };

  toast.className = `pointer-events-auto px-4 py-3 rounded-lg border shadow-lg backdrop-blur-md text-xs font-medium flex items-center space-x-2 transition-all transform duration-300 translate-y-2 opacity-0 ${borderColors[type] || borderColors.info}`;
  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full ${type === 'error' ? 'bg-rose-400' : (type === 'warning' ? 'bg-amber-400' : 'bg-cyan-400')}"></span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger fade in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
