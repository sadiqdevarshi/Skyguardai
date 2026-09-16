export function renderFooter() {
  return `
    <footer class="bg-aeris-950 border-t border-aeris-900 mt-auto text-slate-400 py-12 text-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-aeris-900">
          
          <!-- Column 1: Identity -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <span class="font-bold text-slate-200 tracking-wider font-sans">AERISENCE</span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
              Autonomous Automatic Weather Station (AWS) network telemetry verification and physical atmospheric anomaly intelligence platform.
            </p>
            <div class="flex items-center space-x-2 text-[11px] font-mono text-cyan-400/80">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>TELEMETRY INGESTION: OPERATIONAL</span>
            </div>
          </div>

          <!-- Column 2: Platform -->
          <div>
            <h4 class="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#/monitoring" class="hover:text-cyan-300 transition-colors">Atmospheric Monitoring</a></li>
              <li><a href="#/live" class="hover:text-cyan-300 transition-colors">3D Sensor Network</a></li>
              <li><a href="#/anomalies" class="hover:text-cyan-300 transition-colors">Anomaly Engine</a></li>
              <li><a href="#/analytics" class="hover:text-cyan-300 transition-colors">Longitudinal Analytics</a></li>
              <li><a href="#/reports" class="hover:text-cyan-300 transition-colors">Compliance Reports</a></li>
            </ul>
          </div>

          <!-- Column 3: Architecture & Science -->
          <div>
            <h4 class="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Architecture</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#/technology" class="hover:text-cyan-300 transition-colors">Data Pipeline Verification</a></li>
              <li><a href="#/about" class="hover:text-cyan-300 transition-colors">Sensor Physics & Standards</a></li>
              <li><span class="text-slate-400">WMO-No. 8 Instrument Guidelines</span></li>
              <li><span class="text-slate-400">Microclimate Plausibility Bounds</span></li>
            </ul>
          </div>

          <!-- Column 4: System Specs -->
          <div class="space-y-2 text-xs">
            <h4 class="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Core Telemetry</h4>
            <div class="bg-aeris-900/60 p-3 rounded-lg border border-aeris-800 space-y-1.5 font-mono text-[11px]">
              <div class="flex justify-between">
                <span class="text-slate-400">Parameters:</span>
                <span class="text-slate-200">Temp, Pres, Hum</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Backend:</span>
                <span class="text-cyan-400">Java / Spring Boot</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Engine:</span>
                <span class="text-slate-200">Deterministic + ML</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom bar -->
        <div class="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 space-y-2 md:space-y-0">
          <p>© 2026 Aerisence Systems Inc. Open-source under MIT License.</p>
          <div class="flex items-center space-x-4">
            <a href="#/about" class="hover:text-slate-300">Privacy & Terms</a>
            <a href="#/settings" class="hover:text-slate-300">System Config</a>
            <span class="font-mono text-[10px] text-slate-400">v2.0.4-RELEASE</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}
