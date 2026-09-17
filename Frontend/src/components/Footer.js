export function renderFooter() {
  return `
    <footer class="bg-aeris-950 border-t border-aeris-900 mt-auto text-slate-400 py-12 text-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-aeris-900">
          
          <!-- Column 1: Identity & Operational Status -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <span class="font-bold text-slate-200 tracking-wider font-sans uppercase">AERISENCE</span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
              Autonomous Automatic Weather Station (AWS) network telemetry verification, physical boundary checking, and meteorological anomaly intelligence.
            </p>
            <div class="flex items-center space-x-2 text-[11px] font-mono text-cyan-400/90">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>DATA QUALITY ENGINE: ACTIVE</span>
            </div>
          </div>

          <!-- Column 2: Meteorological Products -->
          <div>
            <h4 class="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Telemetry Products</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#/monitoring" class="hover:text-cyan-300 transition-colors">Monitoring Matrix</a></li>
              <li><a href="#/stations" class="hover:text-cyan-300 transition-colors">Station Hardware Network</a></li>
              <li><a href="#/anomalies" class="hover:text-cyan-300 transition-colors">Anomaly Detection Queue</a></li>
              <li><a href="#/analytics" class="hover:text-cyan-300 transition-colors">Longitudinal Analytics</a></li>
              <li><a href="#/alerts" class="hover:text-cyan-300 transition-colors">Operational Incident Alerts</a></li>
              <li><a href="#/reports" class="hover:text-cyan-300 transition-colors">Compliance & Audit Reports</a></li>
            </ul>
          </div>

          <!-- Column 3: Research & Technical Architecture -->
          <div>
            <h4 class="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Science & Architecture</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#/technology" class="hover:text-cyan-300 transition-colors">Ingestion Pipeline Architecture</a></li>
              <li><a href="#/about" class="hover:text-cyan-300 transition-colors">In-Situ Sensor Failure Modes</a></li>
              <li><a href="#/about" class="hover:text-cyan-300 transition-colors">WMO-No. 8 Standards & Physics</a></li>
              <li><a href="#/live" class="hover:text-cyan-300 transition-colors">3D Atmospheric Sensor Spatializer</a></li>
            </ul>
          </div>

          <!-- Column 4: Operational System Specs -->
          <div class="space-y-2 text-xs">
            <h4 class="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">System Specifications</h4>
            <div class="bg-aeris-900/60 p-3 rounded-lg border border-aeris-800 space-y-1.5 font-mono text-[11px]">
              <div class="flex justify-between">
                <span class="text-slate-400">Core Telemetry:</span>
                <span class="text-slate-200">Temp, Pres, Hum</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Verification:</span>
                <span class="text-cyan-400">Deterministic + Statistical</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Sampling Rate:</span>
                <span class="text-slate-200">60s Cadence</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Platform Build:</span>
                <span class="text-emerald-400">v2.0.4-RELEASE</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom bar -->
        <div class="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 space-y-2 md:space-y-0">
          <p>© 2026 Aerisence Meteorological Intelligence Platform. Open-source under MIT License.</p>
          <div class="flex items-center space-x-4">
            <a href="#/technology" class="hover:text-slate-300">Technical Docs</a>
            <a href="#/about" class="hover:text-slate-300">Research Methodology</a>
            <a href="#/settings" class="hover:text-slate-300">System Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
