import { SensorNetworkScene } from '../scenes/SensorNetworkScene.js';
import { api } from '../services/api.js';
import { renderSidebar } from '../components/Sidebar.js';

export async function renderLiveView() {
  const stations = await api.getStations();

  const container = document.createElement('div');
  container.className = 'flex-1 flex w-full min-h-[calc(100vh-4rem)]';

  container.innerHTML = `
    ${renderSidebar('/live')}

    <div class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl flex flex-col">
      
      <!-- Top Status Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Real-Time Sensor Network Mesh (3D)</h1>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Spatial node topology showing real-time observation packets streaming into central ingestion core.</p>
        </div>

        <div class="flex items-center space-x-3 text-xs font-mono">
          <span class="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">STREAM: <strong class="text-emerald-600 dark:text-emerald-400">ACTIVE</strong></span>
          <span class="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">INGEST: <strong class="text-teal-700 dark:text-teal-400">1.2 pkts/sec</strong></span>
        </div>
      </div>

      <!-- 3D Interactive Viewport and Live Inspector Split -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        <!-- 3D Scene Viewport (2 cols) -->
        <div class="lg:col-span-2 atmospheric-card p-2 relative bg-slate-900 border border-slate-800 text-white min-h-[480px] flex flex-col justify-between overflow-hidden shadow-sm">
          
          <div class="absolute top-3 left-3 z-10 flex items-center space-x-2 text-[10px] font-mono text-teal-400 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-700">
            <span>Click any node in 3D space to inspect telemetry</span>
          </div>

          <div id="live-network-canvas" class="w-full h-full min-h-[440px] flex-1"></div>

          <div class="p-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/90">
            <span>● Green: Station Online</span>
            <span>● Amber: Degraded Sensor</span>
            <span>● Center: Spring Boot Core</span>
          </div>
        </div>

        <!-- Right Side Live Telemetry Feed & Selected Node Inspector -->
        <div class="space-y-4 flex flex-col justify-between">
          
          <!-- Selected Node Inspector Box -->
          <div id="live-node-inspector" class="atmospheric-card p-5 space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span id="inspect-code" class="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">AWS-101-ALP</span>
                <h3 id="inspect-name" class="text-sm font-bold text-slate-900 dark:text-slate-100">Alpine Ridge High Summit</h3>
              </div>
              <span id="inspect-status" class="badge-online">ONLINE</span>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center font-mono">
              <div class="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span class="text-[9px] text-slate-500 block uppercase">TEMP</span>
                <span id="inspect-temp" class="text-xs font-bold text-amber-700 dark:text-amber-400">-2.4°C</span>
              </div>
              <div class="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span class="text-[9px] text-slate-500 block uppercase">PRESSURE</span>
                <span id="inspect-pres" class="text-xs font-bold text-sky-700 dark:text-sky-400">752.1</span>
              </div>
              <div class="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span class="text-[9px] text-slate-500 block uppercase">HUMIDITY</span>
                <span id="inspect-hum" class="text-xs font-bold text-teal-700 dark:text-teal-400">78.5%</span>
              </div>
            </div>

            <div class="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Sampling frequency: 60s. Hydrostatic equilibrium checked against elevation.
            </div>

            <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
              <a id="inspect-link" href="#/stations/1" class="btn-primary w-full text-xs py-1.5 justify-center">
                Open Station Analytics →
              </a>
            </div>
          </div>

          <!-- Live Streaming Packet Log -->
          <div class="atmospheric-card p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100">
              <span>Ingested Telemetry Log</span>
              <span class="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">STREAMING</span>
            </div>

            <div id="live-packet-log" class="space-y-2 font-mono text-[11px] text-slate-700 dark:text-slate-300 overflow-y-auto max-h-[220px]">
              <div class="p-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                <span class="text-teal-700 dark:text-teal-400">AWS-101-ALP</span>
                <span class="text-amber-700 dark:text-amber-400">-2.4°C</span>
                <span class="text-slate-500">752hPa</span>
                <span class="text-emerald-600 dark:text-emerald-400">PASS</span>
              </div>
              <div class="p-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                <span class="text-teal-700 dark:text-teal-400">AWS-204-CST</span>
                <span class="text-amber-700 dark:text-amber-400">19.8°C</span>
                <span class="text-slate-500">1014hPa</span>
                <span class="text-emerald-600 dark:text-emerald-400">PASS</span>
              </div>
              <div class="p-1.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex justify-between">
                <span class="text-amber-700 dark:text-amber-400">AWS-312-PLN</span>
                <span class="text-rose-600 dark:text-rose-400">48.6°C</span>
                <span class="text-slate-500">998hPa</span>
                <span class="text-amber-700 dark:text-amber-400">SPIKE</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  `;

  // Attach 3D Sensor Network Scene
  setTimeout(() => {
    const canvasContainer = container.querySelector('#live-network-canvas');
    if (canvasContainer) {
      const scene = new SensorNetworkScene(canvasContainer, (nodeData) => {
        // Node clicked callback
        const codeEl = container.querySelector('#inspect-code');
        const nameEl = container.querySelector('#inspect-name');
        const statusEl = container.querySelector('#inspect-status');
        const linkEl = container.querySelector('#inspect-link');

        if (codeEl) codeEl.innerText = nodeData.code;
        if (nameEl) nameEl.innerText = nodeData.name;
        if (statusEl) {
          statusEl.innerText = nodeData.status;
          statusEl.className = nodeData.status === 'ONLINE' ? 'badge-online' : 'badge-degraded';
        }
        if (linkEl) linkEl.href = `#/stations/${nodeData.id}`;
      });

      container.cleanup = () => scene.destroy();
    }
  }, 50);

  return container;
}
