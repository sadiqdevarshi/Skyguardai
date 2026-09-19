export function renderFooter() {
  return `
    <footer class="bg-surface border-t border-border mt-auto text-content-secondary py-12 text-sm transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-border">
          
          <!-- Column 1: Identity & Operational Status -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="w-3.5 h-3.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <span class="font-bold text-content-primary tracking-wider font-sans uppercase">SKY GUARD AI</span>
            </div>
            <p class="text-xs text-content-muted leading-relaxed">
              Autonomous Automatic Weather Station (AWS) network telemetry verification, physical boundary checking, and meteorological anomaly intelligence.
            </p>
            <div class="flex items-center space-x-2 text-[11px] font-mono text-accent">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>DATA QUALITY ENGINE: ACTIVE</span>
            </div>
          </div>

          <!-- Column 2: Meteorological Products -->
          <div>
            <h4 class="text-xs font-semibold text-content-primary uppercase tracking-wider mb-3">Telemetry Products</h4>
            <ul class="space-y-2 text-xs text-content-muted">
              <li><a href="#/monitoring" class="hover:text-accent transition-colors">Monitoring Matrix</a></li>
              <li><a href="#/stations" class="hover:text-accent transition-colors">Station Hardware Network</a></li>
              <li><a href="#/anomalies" class="hover:text-accent transition-colors">Anomaly Detection Queue</a></li>
              <li><a href="#/analytics" class="hover:text-accent transition-colors">Longitudinal Analytics</a></li>
              <li><a href="#/alerts" class="hover:text-accent transition-colors">Operational Incident Alerts</a></li>
              <li><a href="#/reports" class="hover:text-accent transition-colors">Compliance & Audit Reports</a></li>
            </ul>
          </div>

          <!-- Column 3: Research & Technical Architecture -->
          <div>
            <h4 class="text-xs font-semibold text-content-primary uppercase tracking-wider mb-3">Science & Architecture</h4>
            <ul class="space-y-2 text-xs text-content-muted">
              <li><a href="#/technology" class="hover:text-accent transition-colors">Ingestion Pipeline Architecture</a></li>
              <li><a href="#/about" class="hover:text-accent transition-colors">In-Situ Sensor Failure Modes</a></li>
              <li><a href="#/about" class="hover:text-accent transition-colors">WMO-No. 8 Standards & Physics</a></li>
              <li><a href="#/live" class="hover:text-accent transition-colors">3D Atmospheric Sensor Spatializer</a></li>
            </ul>
          </div>

          <!-- Column 4: Operational System Specs -->
          <div class="space-y-2 text-xs">
            <h4 class="text-xs font-semibold text-content-primary uppercase tracking-wider mb-3">System Specifications</h4>
            <div class="bg-subtle p-3.5 rounded-lg border border-border space-y-1.5 font-mono text-[11px]">
              <div class="flex justify-between">
                <span class="text-content-muted">Core Telemetry:</span>
                <span class="text-content-primary font-medium">Temp, Pres, Hum</span>
              </div>
              <div class="flex justify-between">
                <span class="text-content-muted">Verification:</span>
                <span class="text-accent font-medium">Deterministic + Statistical</span>
              </div>
              <div class="flex justify-between">
                <span class="text-content-muted">Sampling Rate:</span>
                <span class="text-content-primary font-medium">60s Cadence</span>
              </div>
              <div class="flex justify-between">
                <span class="text-content-muted">Platform Build:</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-medium">v2.0.4-RELEASE</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom bar -->
        <div class="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-content-muted space-y-2 md:space-y-0">
          <p>© 2026 Sky Guard AI Meteorological Intelligence Platform. Open-source under MIT License.</p>
          <div class="flex items-center space-x-4">
            <a href="#/technology" class="hover:text-content-primary transition-colors">Technical Docs</a>
            <a href="#/about" class="hover:text-content-primary transition-colors">Research Methodology</a>
            <a href="#/settings" class="hover:text-content-primary transition-colors">System Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
