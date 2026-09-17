export function showModal({ title, content, onConfirm, confirmText = 'Confirm', confirmClass = 'btn-primary' }) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="bg-surface border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div class="flex items-center justify-between pb-3 border-b border-border">
        <h3 class="text-sm font-semibold text-content-primary">${title}</h3>
        <button id="modal-close-btn" class="text-content-muted hover:text-content-primary p-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body text-xs text-content-secondary space-y-3">
        ${content}
      </div>

      <div class="flex items-center justify-end space-x-3 pt-3 border-t border-border">
        <button id="modal-cancel-btn" class="btn-secondary text-xs px-3 py-1.5">Cancel</button>
        <button id="modal-confirm-btn" class="${confirmClass} text-xs px-4 py-1.5">${confirmText}</button>
      </div>
    </div>
  `;

  container.classList.remove('hidden');

  const close = () => {
    container.classList.add('hidden');
    container.innerHTML = '';
  };

  document.getElementById('modal-close-btn').onclick = close;
  document.getElementById('modal-cancel-btn').onclick = close;
  document.getElementById('modal-confirm-btn').onclick = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    close();
  };
}

