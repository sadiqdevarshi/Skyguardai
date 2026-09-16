import { AtmosphericGlobeScene } from '../scenes/AtmosphericGlobeScene.js';
import { api } from '../services/api.js';

export async function renderHomeView() {
  const stations = await api.getStations();
  const analytics = await api.getAnalyticsSummary();

  const container = document.createElement('div');
  container.className = 'w-full flex flex-col space-y-20 pb-20';

  container.innerHTML = `
    <!-- Hero Section with 3D Globe -->
    <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-hero-radial border-b border-aeris-900">
      
      <!-- 3D Three.js Globe Viewport -->
      <div id="hero-globe-canvas" class="absolute inset-0 z-0 flex items-center justify-center opacity-70 pointer-events-auto"></div>

      <!-- Subtle Grid Background -->
      <div class="absolute inset-0 bg-grid-pattern bg-grid-md opacity-25 pointer-events-none"></div>

      <!-- Hero Content Overlay -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center space-y-8">
        
        <!-- Status Pill -->
        <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-aeris-900/80 border border-cyan-500/30 text-xs text-cyan-300 backdrop-blur-md shadow-glow-cyan animate-pulse-glow">
          <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span class="font-mono uppercase tracking-wider">AERISENCE OPERATIONAL TELEMETRY ENGINE</span>
        </div>

        <!-- Main Headline -->
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
          Precision <span class="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">Atmospheric Telemetry</span> & Anomaly Intelligence
        </h1>

        <!-- Subheading -->
        <p class="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
          Autonomous quality control and real-time anomaly detection for Automatic Weather Station (AWS) networks. Continuous physical verification for Temperature, Pressure, and Humidity.
        </p>

        <!-- CTA Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a href="#/dashboard" class="btn-primary px-6 py-3 text-sm font-semibold tracking-wide">
            <span>Open Operational Mission Control</span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
          <a href="#/live" class="btn-secondary px-6 py-3 text-sm font-semibold tracking-wide">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2"></span>
            <span>Explore 3D Sensor Stream</span>
          </a>
        </div>

        <!-- Telemetry Ticker Ribbon -->
        <div class="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 pt-10">
          <div class="p-3.5 rounded-xl bg-aeris-900/70 border border-aeris-800/80 backdrop-blur-md text-left">
            <span class="text-[10px] font-mono text-slate-400 uppercase">ACTIVE AWS NODES</span>
            <div class="text-xl font-mono font-bold text-white mt-0.5">${analytics.onlineStations} <span class="text-xs font-normal text-emerald-400">/ ${analytics.totalStations}</span></div>
          </div>
          <div class="p-3.5 rounded-xl bg-aeris-900/70 border border-aeris-800/80 backdrop-blur-md text-left">
            <span class="text-[10px] font-mono text-slate-400 uppercase">NETWORK HEALTH</span>
            <div class="text-xl font-mono font-bold text-cyan-400 mt-0.5">${analytics.networkHealthPercentage}%</div>
          </div>
          <div class="p-3.5 rounded-xl bg-aeris-900/70 border border-aeris-800/80 backdrop-blur-md text-left">
            <span class="text-[10px] font-mono text-slate-400 uppercase">MEAN PRESSURE</span>
            <div class="text-xl font-mono font-bold text-slate-100 mt-0.5">${analytics.networkAvgPressure} <span class="text-xs font-normal text-slate-400">hPa</span></div>
          </div>
          <div class="p-3.5 rounded-xl bg-aeris-900/70 border border-aeris-800/80 backdrop-blur-md text-left">
            <span class="text-[10px] font-mono text-slate-400 uppercase">FLAGGED ANOMALIES</span>
            <div class="text-xl font-mono font-bold text-amber-400 mt-0.5">${analytics.openAnomalies} <span class="text-xs font-normal text-slate-400">active</span></div>
          </div>
        </div>

      </div>
    </section>

    <!-- Core Meteorological Capabilities Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <span class="text-xs font-mono text-cyan-400 tracking-widest uppercase">CONTINUOUS DATA ASSURANCE</span>
        <h2 class="text-3xl font-bold text-white tracking-tight">Purpose-Built for Meteorological Realities</h2>
        <p class="text-sm text-slate-400 leading-relaxed">
          Automatic Weather Stations operate in severe alpine, coastal, and desert environments. Sensor drift, ice accretion, electrical noise, and calibration loss occur silently. Aerisence detects and isolates these issues before flawed data enters downstream climate models.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Feature 1 -->
        <div class="atmospheric-card p-6 space-y-4">
          <div class="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-100">Deterministic Physical Bounds</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Strict domain boundary enforcement compliant with WMO standards for temperature range (-50°C to +60°C), terrestrial barometric limits (870 - 1085 hPa), and psychrometric constraints.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] font-mono text-cyan-400">
            <span>Range Limit Check: PASS</span>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="atmospheric-card p-6 space-y-4">
          <div class="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-amber-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-100">Step Rate & Spike Detection</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Identifies unphysical rate-of-change deltas within single transmission steps, isolating transient electrical spikes from authentic squall lines and cold front arrivals.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] font-mono text-amber-400">
            <span>Temporal Δ-Filter: ACTIVE</span>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="atmospheric-card p-6 space-y-4">
          <div class="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-100">Persistence & Sensor Lock</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Flags dead-band flatlines where sensors output identical floats over continuous sample windows, symptomatic of ADC failure, frozen wind-cups, or saturated capacitive plates.
          </p>
          <div class="pt-2 flex items-center space-x-2 text-[11px] font-mono text-indigo-400">
            <span>Zero-Variance Audit: ACTIVE</span>
          </div>
        </div>

      </div>
    </section>

    <!-- Interactive Live Stations Preview Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-mono text-cyan-400 uppercase tracking-widest">NETWORK TELEMETRY MATRIX</span>
          <h2 class="text-2xl font-bold text-white tracking-tight mt-1">Active Meteorological Stations</h2>
        </div>
        <a href="#/stations" class="btn-secondary text-xs px-4 py-2 self-start sm:self-auto">
          View Complete Station Directory (${stations.length}) →
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${stations.slice(0, 6).map(st => `
          <a href="#/stations/${st.id}" class="atmospheric-card p-5 space-y-3 block hover:border-cyan-500/50 transition-all">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-cyan-400">${st.stationCode}</span>
              <span class="${st.status === 'ONLINE' ? 'badge-online' : (st.status === 'DEGRADED' ? 'badge-degraded' : 'badge-offline')}">
                ${st.status}
              </span>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-slate-100">${st.name}</h4>
              <span class="text-xs text-slate-400">${st.region} • ${st.elevationMeters}m MSL</span>
            </div>
            
            <div class="grid grid-cols-3 gap-2 pt-2 border-t border-aeris-800 font-mono text-xs">
              <div class="space-y-0.5">
                <span class="text-[10px] text-slate-400">TEMP</span>
                <div class="font-bold text-amber-400">${st.currentTemperature != null ? st.currentTemperature + '°C' : '--'}</div>
              </div>
              <div class="space-y-0.5">
                <span class="text-[10px] text-slate-400">PRESSURE</span>
                <div class="font-bold text-cyan-400">${st.currentPressure != null ? st.currentPressure + ' hPa' : '--'}</div>
              </div>
              <div class="space-y-0.5">
                <span class="text-[10px] text-slate-400">HUMIDITY</span>
                <div class="font-bold text-blue-400">${st.currentHumidity != null ? st.currentHumidity + '%' : '--'}</div>
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    </section>

    <!-- Architecture Data Flow Teaser -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="p-8 sm:p-12 rounded-2xl bg-aeris-900/60 border border-aeris-800 space-y-8">
        <div class="max-w-2xl space-y-3">
          <span class="text-xs font-mono text-cyan-400 uppercase tracking-widest">INGESTION LIFECYCLE</span>
          <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">From Raw Sensor Voltage to Operational Anomaly Flag</h2>
          <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Data packets from remote telemetry units (RTUs) undergo cryptographic validation, physical rule-based filtering, statistical divergence scoring, and human operator dispatching.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center font-mono text-xs">
          <div class="p-3 bg-aeris-950 rounded-lg border border-aeris-800 space-y-1">
            <span class="text-cyan-400 font-bold">01. INGEST</span>
            <p class="text-[11px] text-slate-400">AWS Transducer Payload</p>
          </div>
          <div class="p-3 bg-aeris-950 rounded-lg border border-aeris-800 space-y-1">
            <span class="text-cyan-400 font-bold">02. BOUNDS</span>
            <p class="text-[11px] text-slate-400">WMO Plausibility Limits</p>
          </div>
          <div class="p-3 bg-aeris-950 rounded-lg border border-aeris-800 space-y-1">
            <span class="text-amber-400 font-bold">03. DELTA FILTER</span>
            <p class="text-[11px] text-slate-400">Spike & Step Check</p>
          </div>
          <div class="p-3 bg-aeris-950 rounded-lg border border-aeris-800 space-y-1">
            <span class="text-purple-400 font-bold">04. CORRELATE</span>
            <p class="text-[11px] text-slate-400">Cross-Sensor Validation</p>
          </div>
          <div class="p-3 bg-aeris-950 rounded-lg border border-aeris-800 space-y-1">
            <span class="text-emerald-400 font-bold">05. DISPATCH</span>
            <p class="text-[11px] text-slate-400">Operator Alert & Audit</p>
          </div>
        </div>

        <div class="pt-4 flex justify-start">
          <a href="#/technology" class="btn-primary text-xs px-5 py-2.5">
            Inspect Full Technical Pipeline Architecture →
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
      // Cleanup on view destroy
      container.cleanup = () => globeScene.destroy();
    }
  }, 50);

  return container;
}
