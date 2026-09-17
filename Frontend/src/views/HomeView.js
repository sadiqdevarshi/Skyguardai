import { AtmosphericGlobeScene } from '../scenes/AtmosphericGlobeScene.js';
import { api } from '../services/api.js';

export async function renderHomeView() {
  const stations = await api.getStations();
  const analytics = await api.getAnalyticsSummary();

  const container = document.createElement('div');
  container.className = 'w-full flex flex-col space-y-16 pb-20';

  container.innerHTML = `
    <!-- Hero Section with Clean Technical Grid -->
    <section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-hero-subtle border-b border-border">
      
      <!-- 3D Three.js Viewport (Non-intrusive container) -->
      <div id="hero-globe-canvas" class="absolute inset-0 z-0 flex items-center justify-center opacity-50 pointer-events-auto"></div>

      <!-- Subtle Grid Background -->
      <div class="absolute inset-0 bg-grid-scientific opacity-40 pointer-events-none"></div>

      <!-- Hero Content Overlay -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col items-center text-center space-y-6">
        
        <!-- Scientific Status Label -->
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded border border-border bg-surface text-[11px] font-mono text-content-secondary shadow-card">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>AERISENCE OPERATIONAL TELEMETRY ENGINE</span>
        </div>

        <!-- Main Headline -->
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-content-primary max-w-4xl leading-[1.15]">
          Precision Atmospheric Telemetry & Anomaly Intelligence
        </h1>

        <!-- Subheading -->
        <p class="text-sm sm:text-base text-content-secondary max-w-2xl font-normal leading-relaxed">
          Continuous quality assurance and deterministic physical verification for Automatic Weather Station (AWS) networks across Temperature, Pressure, and Humidity.
        </p>

        <!-- CTA Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a href="#/dashboard" class="btn-primary px-5 py-2.5 text-xs font-semibold">
            <span>Open Operational Mission Control</span>
            <svg class="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
          <a href="#/monitoring" class="btn-secondary px-5 py-2.5 text-xs font-semibold">
            <span>Explore Live Monitoring Matrix</span>
          </a>
        </div>

        <!-- Telemetry Ticker Ribbon -->
        <div class="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-left">
          <div class="atmospheric-card p-4 space-y-1">
            <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">ACTIVE AWS NODES</span>
            <div class="flex items-baseline space-x-1 font-mono">
              <span class="text-2xl font-bold text-content-primary tabular-nums">${analytics.onlineStations}</span>
              <span class="text-xs text-content-muted font-normal">/ ${analytics.totalStations}</span>
            </div>
            <span class="text-[10px] text-content-muted block">Online and transmitting</span>
          </div>

          <div class="atmospheric-card p-4 space-y-1">
            <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">NETWORK HEALTH</span>
            <div class="flex items-baseline space-x-1 font-mono">
              <span class="text-2xl font-bold text-content-primary tabular-nums">${analytics.networkHealthPercentage}</span>
              <span class="text-xs text-content-muted font-normal">%</span>
            </div>
            <span class="text-[10px] text-content-muted block">Data quality index</span>
          </div>

          <div class="atmospheric-card p-4 space-y-1">
            <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">MEAN PRESSURE</span>
            <div class="flex items-baseline space-x-1 font-mono">
              <span class="text-2xl font-bold text-content-primary tabular-nums">${analytics.networkAvgPressure}</span>
              <span class="text-xs text-content-muted font-normal">hPa</span>
            </div>
            <span class="text-[10px] text-content-muted block">Regional average</span>
          </div>

          <div class="atmospheric-card p-4 space-y-1">
            <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">FLAGGED ANOMALIES</span>
            <div class="flex items-baseline space-x-1 font-mono">
              <span class="text-2xl font-bold ${analytics.openAnomalies > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-content-primary'} tabular-nums">${analytics.openAnomalies}</span>
              <span class="text-xs text-content-muted font-normal">events</span>
            </div>
            <span class="text-[10px] text-content-muted block">Quarantine queue</span>
          </div>
        </div>

      </div>
    </section>

    <!-- Core Meteorological Capabilities Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="text-center max-w-3xl mx-auto space-y-2">
        <span class="text-xs font-mono text-accent tracking-widest uppercase font-semibold">CONTINUOUS DATA ASSURANCE</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">Purpose-Built for Meteorological Realities</h2>
        <p class="text-xs sm:text-sm text-content-secondary leading-relaxed">
          Automatic Weather Stations operate in severe alpine, coastal, and desert environments. Sensor drift, ice accretion, electrical noise, and calibration loss occur silently. Aerisence detects and isolates these issues before flawed data enters downstream climate models.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Feature 1 -->
        <div class="atmospheric-card p-6 space-y-3">
          <div class="w-8 h-8 rounded border border-border flex items-center justify-center text-content-secondary bg-subtle">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 class="text-base font-semibold text-content-primary">Deterministic Physical Bounds</h3>
          <p class="text-xs text-content-secondary leading-relaxed">
            Strict domain boundary enforcement compliant with WMO standards for temperature range (-50°C to +60°C), terrestrial barometric limits (870 - 1085 hPa), and psychrometric constraints.
          </p>
          <div class="pt-2 text-[11px] font-mono text-content-muted">
            Bound Rule: WMO-No. 8 Plausibility Limits
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="atmospheric-card p-6 space-y-3">
          <div class="w-8 h-8 rounded border border-border flex items-center justify-center text-content-secondary bg-subtle">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 class="text-base font-semibold text-content-primary">Step Rate & Spike Detection</h3>
          <p class="text-xs text-content-secondary leading-relaxed">
            Identifies unphysical rate-of-change deltas within single transmission steps, isolating transient electrical spikes from authentic squall lines and cold front arrivals.
          </p>
          <div class="pt-2 text-[11px] font-mono text-content-muted">
            Delta Rule: |v(t) - v(t-1)| / Δt Threshold
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="atmospheric-card p-6 space-y-3">
          <div class="w-8 h-8 rounded border border-border flex items-center justify-center text-content-secondary bg-subtle">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </div>
          <h3 class="text-base font-semibold text-content-primary">Persistence & Sensor Lock</h3>
          <p class="text-xs text-content-secondary leading-relaxed">
            Flags dead-band flatlines where sensors output identical floats over continuous sample windows, symptomatic of ADC failure, frozen wind-cups, or saturated capacitive plates.
          </p>
          <div class="pt-2 text-[11px] font-mono text-content-muted">
            Variance Rule: Var(W) &lt; ε Flatline Detector
          </div>
        </div>

      </div>
    </section>

    <!-- Interactive Live Stations Preview Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span class="text-xs font-mono text-accent uppercase tracking-widest font-semibold">NETWORK TELEMETRY MATRIX</span>
          <h2 class="text-xl sm:text-2xl font-bold text-content-primary tracking-tight mt-0.5">Active Meteorological Stations</h2>
        </div>
        <a href="#/stations" class="btn-secondary text-xs px-3.5 py-1.5 self-start sm:self-auto">
          View Complete Station Directory (${stations.length}) →
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${stations.slice(0, 6).map(st => `
          <a href="#/stations/${st.id}" class="atmospheric-card p-5 space-y-3 block hover:border-accent transition-colors">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-content-secondary">${st.stationCode}</span>
              <span class="${st.status === 'ONLINE' ? 'status-online' : (st.status === 'DEGRADED' ? 'status-degraded' : 'status-offline')}">
                ${st.status}
              </span>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-content-primary">${st.name}</h4>
              <span class="text-xs text-content-muted">${st.region} • ${st.elevationMeters}m MSL</span>
            </div>
            
            <div class="grid grid-cols-3 gap-2 pt-2 border-t border-border font-mono text-xs">
              <div class="space-y-0.5">
                <span class="text-[10px] text-content-muted block">TEMP</span>
                <div class="font-semibold text-content-primary tabular-nums">${st.currentTemperature != null ? st.currentTemperature + '°C' : '--'}</div>
              </div>
              <div class="space-y-0.5">
                <span class="text-[10px] text-content-muted block">PRESSURE</span>
                <div class="font-semibold text-content-primary tabular-nums">${st.currentPressure != null ? st.currentPressure + ' hPa' : '--'}</div>
              </div>
              <div class="space-y-0.5">
                <span class="text-[10px] text-content-muted block">HUMIDITY</span>
                <div class="font-semibold text-content-primary tabular-nums">${st.currentHumidity != null ? st.currentHumidity + '%' : '--'}</div>
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    </section>

    <!-- Architecture Data Flow Teaser -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="p-6 sm:p-8 rounded-lg bg-subtle border border-border space-y-6">
        <div class="max-w-2xl space-y-2">
          <span class="text-xs font-mono text-accent uppercase tracking-widest font-semibold">INGESTION LIFECYCLE</span>
          <h2 class="text-xl sm:text-2xl font-bold text-content-primary tracking-tight">From Raw Sensor Voltage to Operational Anomaly Flag</h2>
          <p class="text-xs sm:text-sm text-content-secondary leading-relaxed">
            Data packets from remote telemetry units (RTUs) undergo cryptographic validation, physical rule-based filtering, statistical divergence scoring, and human operator dispatching.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center font-mono text-xs">
          <div class="p-3 bg-surface rounded border border-border space-y-1">
            <span class="text-content-primary font-bold block">01. INGEST</span>
            <p class="text-[11px] text-content-muted">AWS RTU Payload</p>
          </div>
          <div class="p-3 bg-surface rounded border border-border space-y-1">
            <span class="text-content-primary font-bold block">02. BOUNDS</span>
            <p class="text-[11px] text-content-muted">WMO Limits</p>
          </div>
          <div class="p-3 bg-surface rounded border border-border space-y-1">
            <span class="text-content-primary font-bold block">03. DELTA</span>
            <p class="text-[11px] text-content-muted">Spike & Step Check</p>
          </div>
          <div class="p-3 bg-surface rounded border border-border space-y-1">
            <span class="text-content-primary font-bold block">04. CORRELATE</span>
            <p class="text-[11px] text-content-muted">Cross-Sensor Verification</p>
          </div>
          <div class="p-3 bg-surface rounded border border-border space-y-1">
            <span class="text-content-primary font-bold block">05. DISPATCH</span>
            <p class="text-[11px] text-content-muted">Operator Alert & Audit</p>
          </div>
        </div>

        <div class="pt-2 flex justify-start">
          <a href="#/technology" class="btn-primary text-xs px-4 py-2">
            Inspect Full Ingestion Architecture →
          </a>
        </div>
      </div>
    </section>
  `;

  // Attach 3D Scene after render
  setTimeout(() => {
    const canvasContainer = container.querySelector('#hero-globe-canvas');
    if (canvasContainer) {
      const globeScene = new AtmosphericGlobeScene(canvasContainer);
      container.cleanup = () => globeScene.destroy();
    }
  }, 50);

  return container;
}
