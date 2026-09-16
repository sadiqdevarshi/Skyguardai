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
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aeris-850 pb-4">
          <div>
            <div class="flex items-center space-x-2">
              <span class="badge-critical font-mono text-[10px]">ROOT ACCESS</span>
              <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">Administrative Operations Suite</h1>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">Role-based access control, JVM infrastructure telemetry, and security audit trail.</p>
          </div>

          <div class="flex items-center space-x-2 text-xs font-mono">
            <span class="p-2 rounded bg-aeris-900 border border-aeris-800 text-emerald-400">JVM: ${stats.systemStatus}</span>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex space-x-2 border-b border-aeris-800 text-xs font-mono">
          <button class="tab-btn px-4 py-2 font-bold border-b-2 transition-colors ${currentTab === 'USERS' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'}" data-tab="USERS">
            User Role Management (${users.length})
          </button>
          <button class="tab-btn px-4 py-2 font-bold border-b-2 transition-colors ${currentTab === 'SYSTEM' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'}" data-tab="SYSTEM">
            System & JVM Telemetry
          </button>
          <button class="tab-btn px-4 py-2 font-bold border-b-2 transition-colors ${currentTab === 'AUDIT' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'}" data-tab="AUDIT">
            Security Audit Trail (${auditLogs.length})
          </button>
        </div>

        <!-- Tab Content -->
        ${currentTab === 'USERS' ? `
          <div class="atmospheric-card p-5 space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-aeris-800">
              <h3 class="text-sm font-bold text-white">Authorized Users & Role Assignments</h3>
              <span class="text-xs font-mono text-slate-400">ENFORCED VIA SPRING SECURITY</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-aeris-800 font-mono text-slate-400 text-[11px]">
                    <th class="pb-2">USERNAME</th>
                    <th class="pb-2">NAME</th>
                    <th class="pb-2">EMAIL</th>
                    <th class="pb-2">CURRENT ROLE</th>
                    <th class="pb-2">STATUS</th>
                    <th class="pb-2 text-right">MODIFY ROLE</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-aeris-850 font-mono">
                  ${users.map(u => `
                    <tr class="hover:bg-aeris-900/40">
                      <td class="py-3 font-bold text-cyan-400">${u.username}</td>
                      <td class="py-3 text-slate-200">${u.fullName}</td>
                      <td class="py-3 text-slate-400">${u.email}</td>
                      <td class="py-3">
                        <span class="px-2 py-0.5 rounded text-[10px] ${u.role === 'ROLE_ADMIN' ? 'bg-purple-950 text-purple-300 border border-purple-800' : (u.role === 'ROLE_OPERATOR' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-300')}">
                          ${u.role}
                        </span>
                      </td>
                      <td class="py-3">
                        <span class="${u.active ? 'text-emerald-400' : 'text-rose-400'}">
                          ${u.active ? '● ACTIVE' : '○ DISABLED'}
                        </span>
                      </td>
                      <td class="py-3 text-right">
                        <select class="user-role-select bg-aeris-950 border border-aeris-800 text-slate-200 text-xs rounded px-2 py-1" data-id="${u.id}">
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
              <span class="text-[10px] font-mono text-slate-400 uppercase">JVM MEMORY USAGE</span>
              <div class="text-xl font-mono font-bold text-cyan-400">${Math.round((stats.jvmMemoryTotalBytes - stats.jvmMemoryFreeBytes) / (1024 * 1024))} MB</div>
              <p class="text-[11px] text-slate-400 font-mono">Allocated: ${Math.round(stats.jvmMemoryTotalBytes / (1024 * 1024))} MB</p>
            </div>

            <div class="atmospheric-card p-5 space-y-2">
              <span class="text-[10px] font-mono text-slate-400 uppercase">AVAILABLE PROCESSORS</span>
              <div class="text-xl font-mono font-bold text-amber-400">${stats.activeProcessors} Cores</div>
              <p class="text-[11px] text-slate-400 font-mono">Multi-threaded Ingestion Engine</p>
            </div>

            <div class="atmospheric-card p-5 space-y-2">
              <span class="text-[10px] font-mono text-slate-400 uppercase">BACKEND SYSTEM RUNTIME</span>
              <div class="text-xl font-mono font-bold text-emerald-400">HEALTHY</div>
              <p class="text-[11px] text-slate-400 font-mono">Java 26 / Spring Boot 3.3.4</p>
            </div>
          </div>
        ` : ''}

        ${currentTab === 'AUDIT' ? `
          <div class="atmospheric-card p-5 space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-aeris-800">
              <h3 class="text-sm font-bold text-white">System Audit & Compliance Log</h3>
              <span class="text-xs font-mono text-slate-400">IMMUTABLE LOG RECORD</span>
            </div>

            <div class="space-y-2">
              ${auditLogs.map(log => `
                <div class="p-3 rounded-lg bg-aeris-950 border border-aeris-800 font-mono text-xs flex items-start justify-between">
                  <div class="space-y-1">
                    <div class="flex items-center space-x-2">
                      <span class="font-bold text-cyan-400">${log.action}</span>
                      <span class="text-slate-500">by</span>
                      <span class="text-slate-200 font-bold">${log.username}</span>
                      <span class="text-[10px] text-slate-500">(${log.entityType})</span>
                    </div>
                    <p class="text-slate-300 font-sans text-xs">${log.details}</p>
                  </div>
                  <span class="text-[10px] text-slate-500 shrink-0 ml-4">${new Date(log.timestamp).toLocaleString()}</span>
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
