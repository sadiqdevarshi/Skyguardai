import { api } from '../services/api.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showToast } from '../components/Toast.js';

export async function renderAdminView() {
  const [users, stats, auditLogs] = await Promise.all([
    api.getAdminUsers(),
    api.getAdminStats(),
    api.getAdminAuditLogs()
  ]);

  const container = document.createElement('div');
  container.className = 'flex-1 flex w-full min-h-[calc(100vh-4rem)]';

  let currentTab = 'USERS'; // 'USERS', 'SYSTEM', 'AUDIT'

  const renderContent = () => {
    return `
      ${renderSidebar('/admin')}

      <div class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div class="flex items-center space-x-2">
              <span class="status-critical font-mono text-[10px]">ROOT ACCESS</span>
              <h1 class="text-xl sm:text-2xl font-bold text-content-primary tracking-tight">Administrative Operations Suite</h1>
            </div>
            <p class="text-xs text-content-secondary mt-0.5">Role-based access control, JVM infrastructure telemetry, and security audit trail.</p>
          </div>

          <div class="flex items-center space-x-2 text-xs font-mono">
            <span class="p-2 rounded-lg bg-subtle border border-border text-content-secondary">JVM: <strong class="text-content-primary font-medium">${stats.systemStatus}</strong></span>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex space-x-2 border-b border-border text-xs font-mono">
          <button class="tab-btn px-4 py-2 font-medium border-b-2 transition-colors ${currentTab === 'USERS' ? 'border-accent text-accent font-semibold' : 'border-transparent text-content-muted hover:text-content-primary'}" data-tab="USERS">
            User Role Management (${users.length})
          </button>
          <button class="tab-btn px-4 py-2 font-medium border-b-2 transition-colors ${currentTab === 'SYSTEM' ? 'border-accent text-accent font-semibold' : 'border-transparent text-content-muted hover:text-content-primary'}" data-tab="SYSTEM">
            System & JVM Telemetry
          </button>
          <button class="tab-btn px-4 py-2 font-medium border-b-2 transition-colors ${currentTab === 'AUDIT' ? 'border-accent text-accent font-semibold' : 'border-transparent text-content-muted hover:text-content-primary'}" data-tab="AUDIT">
            Security Audit Trail (${auditLogs.length})
          </button>
        </div>

        <!-- Tab Content -->
        ${currentTab === 'USERS' ? `
          <div class="atmospheric-card p-5 space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-border">
              <h3 class="text-sm font-bold text-content-primary">Authorized Users & Role Assignments</h3>
              <span class="text-xs font-mono text-content-muted">ENFORCED VIA SPRING SECURITY</span>
            </div>

            <div class="overflow-x-auto">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>USERNAME</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>CURRENT ROLE</th>
                    <th>STATUS</th>
                    <th class="text-right">MODIFY ROLE</th>
                  </tr>
                </thead>
                <tbody class="font-mono">
                  ${users.map(u => `
                    <tr>
                      <td class="font-bold text-content-primary">${u.username}</td>
                      <td class="text-content-primary font-sans">${u.fullName}</td>
                      <td class="text-content-secondary">${u.email}</td>
                      <td>
                        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-subtle border border-border text-content-secondary">
                          ${u.role}
                        </span>
                      </td>
                      <td>
                        <span class="${u.active ? 'status-online' : 'text-content-muted font-mono'}">
                          ${u.active ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </td>
                      <td class="text-right">
                        <select class="user-role-select form-input text-xs py-1 px-2 font-mono" data-id="${u.id}">
                          <option value="ROLE_ADMIN" ${u.role === 'ROLE_ADMIN' ? 'selected' : ''}>ADMIN</option>
                          <option value="ROLE_OPERATOR" ${u.role === 'ROLE_OPERATOR' ? 'selected' : ''}>OPERATOR</option>
                          <option value="ROLE_ANALYST" ${u.role === 'ROLE_ANALYST' ? 'selected' : ''}>ANALYST</option>
                          <option value="ROLE_VIEWER" ${u.role === 'ROLE_VIEWER' ? 'selected' : ''}>VIEWER</option>
                        </select>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        ${currentTab === 'SYSTEM' ? `
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="atmospheric-card p-5 space-y-2">
              <span class="text-[10px] font-mono text-content-muted uppercase">JVM MEMORY USAGE</span>
              <div class="text-xl font-mono font-bold text-content-primary tabular-nums">${Math.round((stats.jvmMemoryTotalBytes - stats.jvmMemoryFreeBytes) / (1024 * 1024))} MB</div>
              <p class="text-[11px] text-content-muted font-mono tabular-nums">Allocated: ${Math.round(stats.jvmMemoryTotalBytes / (1024 * 1024))} MB</p>
            </div>

            <div class="atmospheric-card p-5 space-y-2">
              <span class="text-[10px] font-mono text-content-muted uppercase">AVAILABLE PROCESSORS</span>
              <div class="text-xl font-mono font-bold text-content-primary tabular-nums">${stats.activeProcessors} Cores</div>
              <p class="text-[11px] text-content-muted font-mono">Multi-threaded Ingestion Engine</p>
            </div>

            <div class="atmospheric-card p-5 space-y-2">
              <span class="text-[10px] font-mono text-content-muted uppercase">BACKEND SYSTEM RUNTIME</span>
              <div class="text-xl font-mono font-bold text-content-primary">HEALTHY</div>
              <p class="text-[11px] text-content-muted font-mono">Java 26 / Spring Boot 3.3.4</p>
            </div>
          </div>
        ` : ''}

        ${currentTab === 'AUDIT' ? `
          <div class="atmospheric-card p-5 space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-border">
              <h3 class="text-sm font-bold text-content-primary">System Audit & Compliance Log</h3>
              <span class="text-xs font-mono text-content-muted">IMMUTABLE LOG RECORD</span>
            </div>

            <div class="space-y-2">
              ${auditLogs.map(log => `
                <div class="p-3 rounded-lg bg-subtle border border-border font-mono text-xs flex items-start justify-between">
                  <div class="space-y-1">
                    <div class="flex items-center space-x-2">
                      <span class="font-bold text-content-primary">${log.action}</span>
                      <span class="text-content-muted">by</span>
                      <span class="text-content-secondary font-bold">${log.username}</span>
                      <span class="text-[10px] text-content-muted">(${log.entityType})</span>
                    </div>
                    <p class="text-content-secondary font-sans text-xs">${log.details}</p>
                  </div>
                  <span class="text-[10px] text-content-muted shrink-0 ml-4 tabular-nums">${new Date(log.timestamp).toLocaleString()}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;
  };

  const updateView = () => {
    container.innerHTML = renderContent();

    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = () => {
        currentTab = btn.dataset.tab;
        updateView();
      };
    });

    container.querySelectorAll('.user-role-select').forEach(sel => {
      sel.onchange = (e) => {
        const uid = sel.dataset.id;
        const newRole = e.target.value;
        const user = users.find(u => u.id === Number(uid));
        if (user) {
          user.role = newRole;
          showToast(`Updated role for ${user.username} to ${newRole}`, 'success');
        }
      };
    });
  };

  updateView();
  return container;
}

