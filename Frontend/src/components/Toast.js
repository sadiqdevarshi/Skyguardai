export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const typeStyles = {
    info: 'border-teal-500 bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-200 border',
    success: 'border-emerald-500 bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-200 border',
    warning: 'border-amber-500 bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-200 border',
    error: 'border-rose-500 bg-white dark:bg-slate-900 text-rose-800 dark:text-rose-200 border'
  };

  const dotColors = {
    info: 'bg-teal-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500'
  };

  toast.className = `pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-xs font-medium flex items-center space-x-2.5 transition-all transform duration-300 translate-y-2 opacity-0 ${typeStyles[type] || typeStyles.info}`;
  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full ${dotColors[type] || dotColors.info}"></span>
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
