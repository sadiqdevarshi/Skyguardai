import { ScrollGlobeScene } from '../scenes/ScrollGlobeScene.js';
import { api } from '../services/api.js';

export async function renderHomeView() {
  const stations = await api.getStations();
  const analytics = await api.getAnalyticsSummary();

  const container = document.createElement('div');
  container.className = 'w-full relative';

  container.innerHTML = `
    <!-- Fixed Background 3D Scroll Globe Viewport -->
    <div id="scroll-globe-container" class="fixed inset-0 z-0 pointer-events-none opacity-85"></div>

    <!-- Background Technical Grid Overlay -->
    <div class="fixed inset-0 z-0 bg-grid-scientific opacity-30 pointer-events-none"></div>

    <!-- Foreground Scrollable Story Sections -->
    <div class="relative z-10 w-full flex flex-col space-y-24 sm:space-y-36 pb-32">
      
      <!-- =====================================================================
           STAGE 0: HERO (Global Earth Observation)
           ===================================================================== -->
      <section class="min-h-[92vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-8">
        <div class="max-w-5xl mx-auto flex flex-col items-center space-y-6">
          
          <!-- Scientific Status Badge -->
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-md border border-border bg-surface/90 backdrop-blur-sm text-[11px] font-mono text-content-secondary shadow-card">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>AERISENCE OPERATIONAL TELEMETRY ENGINE • UTC SYNCED</span>
          </div>

          <!-- Main Title -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-content-primary max-w-4xl leading-[1.15]">
            Precision Atmospheric Telemetry & Anomaly Intelligence
          </h1>

          <!-- Subheading -->
          <p class="text-sm sm:text-base text-content-secondary max-w-2xl font-normal leading-relaxed">
            Autonomous quality assurance and deterministic physical verification for Automatic Weather Station (AWS) networks across Temperature, Pressure, and Humidity.
          </p>

          <!-- CTAs -->
          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="#/dashboard" class="btn-primary px-5 py-2.5 text-xs font-semibold shadow-card">
              <span>Open Mission Control</span>
              <svg class="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
            <a href="#/monitoring" class="btn-secondary px-5 py-2.5 text-xs font-semibold">
              <span>Explore Live Telemetry Matrix</span>
            </a>
          </div>

          <!-- Live Network KPIs -->
          <div class="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 text-left">
            <div class="atmospheric-card p-4 space-y-1 bg-surface/90 backdrop-blur-sm">
              <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">ACTIVE AWS NODES</span>
              <div class="flex items-baseline space-x-1 font-mono">
                <span class="text-2xl font-bold text-content-primary tabular-nums">${analytics.onlineStations}</span>
                <span class="text-xs text-content-muted font-normal">/ ${analytics.totalStations}</span>
              </div>
              <span class="text-[10px] text-content-muted block">Transmitting nominal packets</span>
            </div>

            <div class="atmospheric-card p-4 space-y-1 bg-surface/90 backdrop-blur-sm">
              <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">WMO QUALITY INDEX</span>
              <div class="flex items-baseline space-x-1 font-mono">
                <span class="text-2xl font-bold text-content-primary tabular-nums">${analytics.networkHealthPercentage}</span>
                <span class="text-xs text-content-muted font-normal">%</span>
              </div>
              <span class="text-[10px] text-content-muted block">Network-wide data integrity</span>
            </div>

            <div class="atmospheric-card p-4 space-y-1 bg-surface/90 backdrop-blur-sm">
              <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">MEAN PRESSURE</span>
              <div class="flex items-baseline space-x-1 font-mono">
                <span class="text-2xl font-bold text-content-primary tabular-nums">${analytics.networkAvgPressure}</span>
                <span class="text-xs text-content-muted font-normal">hPa</span>
              </div>
              <span class="text-[10px] text-content-muted block">Isobaric baseline MSL</span>
            </div>

            <div class="atmospheric-card p-4 space-y-1 bg-surface/90 backdrop-blur-sm">
              <span class="text-[10px] font-mono text-content-muted uppercase tracking-wider block">QUARANTINED EVENTS</span>
              <div class="flex items-baseline space-x-1 font-mono">
                <span class="text-2xl font-bold ${analytics.openAnomalies > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-content-primary'} tabular-nums">${analytics.openAnomalies}</span>
                <span class="text-xs text-content-muted font-normal">incidents</span>
              </div>
              <span class="text-[10px] text-content-muted block">Awaiting triage / resolution</span>
            </div>
          </div>

          <!-- Scroll Hint -->
          <div class="pt-6 flex flex-col items-center space-y-1 text-content-muted font-mono text-[11px] animate-pulse">
            <span>SCROLL TO EXPLORE ATMOSPHERIC DATA FLOW</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          </div>

        </div>
      </section>

      <!-- =====================================================================
           STAGE 1: ATMOSPHERIC INTELLIGENCE (Camera Glide / Vector Streams)
           ===================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div class="atmospheric-card p-6 sm:p-8 space-y-4 bg-surface/90 backdrop-blur-sm">
            <span class="text-xs font-mono text-accent uppercase tracking-widest font-semibold">STAGE 01 • MACRO SCALE</span>
            <h2 class="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">Continuous Thermodynamic Quality Assurance</h2>
            <p class="text-xs sm:text-sm text-content-secondary leading-relaxed">
              Unattended remote weather stations encounter severe thermal cycling, solar radiation superheating, capacitive drift, and ice accretion. Standard database validation fails to capture subtle sensor corruption.
            </p>
            <p class="text-xs sm:text-sm text-content-secondary leading-relaxed">
              Aerisence models the physical state of the local troposphere, applying Navier-Stokes continuity principles and diurnal solar curves before telemetry commits to long-term climate archives.
            </p>
            <div class="pt-2 flex items-center space-x-4 text-xs font-mono text-content-muted">
              <span>● Global Stream Vectoring</span>
              <span>● Hydrostatic Plausibility</span>
            </div>
          </div>
          <div></div>
        </div>
      </section>

      <!-- =====================================================================
           STAGE 2: AWS OBSERVATIONS (Station Directory & Ground Array)
           ===================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 bg-surface/80 p-4 rounded-lg backdrop-blur-sm">
          <div>
            <span class="text-xs font-mono text-accent uppercase tracking-widest font-semibold">STAGE 02 • GROUND ARRAY</span>
            <h2 class="text-xl sm:text-2xl font-bold text-content-primary tracking-tight mt-0.5">Active Meteorological Stations</h2>
          </div>
          <a href="#/stations" class="btn-secondary text-xs px-3.5 py-1.5 self-start sm:self-auto">
            View Complete Station Directory (${stations.length}) →
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${stations.slice(0, 6).map(st => `
            <a href="#/stations/${st.id}" class="atmospheric-card p-5 space-y-3 block hover:border-accent transition-colors bg-surface/90 backdrop-blur-sm">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-medium text-content-secondary">${st.stationCode}</span>
                <span class="${st.status === 'ONLINE' ? 'status-online' : (st.status === 'DEGRADED' ? 'status-warning' : 'status-offline')}">
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

      <!-- =====================================================================
           STAGE 3: METEOROLOGICAL PARAMETERS (Core State Variables)
           ===================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="text-center max-w-3xl mx-auto space-y-2 bg-surface/80 p-6 rounded-lg backdrop-blur-sm border border-border">
          <span class="text-xs font-mono text-accent tracking-widest uppercase font-semibold">STAGE 03 • PHYSICAL VARIABLES</span>
          <h2 class="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">The Three Foundational State Dimensions</h2>
          <p class="text-xs sm:text-sm text-content-secondary leading-relaxed">
            Aerisence focuses deeply on the deterministic physical interaction between Temperature, Atmospheric Pressure, and Relative Humidity.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="atmospheric-card p-6 space-y-3 bg-surface/90 backdrop-blur-sm">
            <div class="flex justify-between items-center border-b border-border pb-2">
              <span class="text-xs font-mono font-bold text-content-primary">01. TEMPERATURE</span>
              <span class="text-xs font-mono text-content-muted">°C</span>
            </div>
            <p class="text-xs text-content-secondary leading-relaxed">
              Verified against solar elevation angle, nocturnal radiational cooling gradients, and historical station extremes.
            </p>
            <div class="text-[11px] font-mono text-content-muted pt-2 border-t border-border">
              Bound: -50.0°C to +60.0°C (WMO Plausibility)
            </div>
          </div>

          <div class="atmospheric-card p-6 space-y-3 bg-surface/90 backdrop-blur-sm">
            <div class="flex justify-between items-center border-b border-border pb-2">
              <span class="text-xs font-mono font-bold text-content-primary">02. ATMOSPHERIC PRESSURE</span>
              <span class="text-xs font-mono text-content-muted">hPa</span>
            </div>
            <p class="text-xs text-content-secondary leading-relaxed">
              Verified using barometric hypsometric formula against station elevation MSL and regional isobaric gradients.
            </p>
            <div class="text-[11px] font-mono text-content-muted pt-2 border-t border-border">
              Bound: 870 to 1085 hPa (Terrestrial Limits)
            </div>
          </div>

          <div class="atmospheric-card p-6 space-y-3 bg-surface/90 backdrop-blur-sm">
            <div class="flex justify-between items-center border-b border-border pb-2">
              <span class="text-xs font-mono font-bold text-content-primary">03. RELATIVE HUMIDITY</span>
              <span class="text-xs font-mono text-content-muted">% RH</span>
            </div>
            <p class="text-xs text-content-secondary leading-relaxed">
              Cross-checked with temperature to guarantee calculated dew point never mathematically exceeds ambient dry-bulb temperature.
            </p>
            <div class="text-[11px] font-mono text-content-muted pt-2 border-t border-border">
              Domain: 0.0% to 100.0% RH
            </div>
          </div>
        </div>
      </section>

      <!-- =====================================================================
           STAGE 4: ANOMALY DETECTION (Algorithmic Diagnostics)
           ===================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div></div>
          <div class="atmospheric-card p-6 sm:p-8 space-y-4 bg-surface/90 backdrop-blur-sm">
            <span class="text-xs font-mono text-rose-600 dark:text-rose-400 uppercase tracking-widest font-semibold">STAGE 04 • ANOMALY ISOLATION</span>
            <h2 class="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">Algorithmic Incident Classification</h2>
            <p class="text-xs sm:text-sm text-content-secondary leading-relaxed">
              When transducer readings diverge from the physical envelope, Aerisence isolates the signal into specific meteorological failure modes:
            </p>
            <ul class="space-y-2 text-xs text-content-secondary font-mono">
              <li class="flex items-center space-x-2">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span><strong>SPIKE:</strong> Unphysical rate-of-change temporal delta</span>
              </li>
              <li class="flex items-center space-x-2">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span><strong>STEP JUMP:</strong> Abrupt baseline offset discontinuity</span>
              </li>
              <li class="flex items-center space-x-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
                <span><strong>PERSISTENCE:</strong> Dead-band sensor flatline freeze</span>
              </li>
            </ul>
            <div class="pt-3 border-t border-border">
              <a href="#/anomalies" class="btn-primary text-xs px-4 py-2">
                Open Anomaly Triage Workspace →
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- =====================================================================
           STAGE 5: PLATFORM & MISSION CONTROL (Full Ingestion Pipeline)
           ===================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="p-6 sm:p-8 rounded-lg bg-surface/90 backdrop-blur-sm border border-border space-y-6">
          <div class="max-w-2xl space-y-2">
            <span class="text-xs font-mono text-accent uppercase tracking-widest font-semibold">STAGE 05 • PLATFORM INTEGRATION</span>
            <h2 class="text-xl sm:text-2xl font-bold text-content-primary tracking-tight">End-to-End Enterprise Meteorological Architecture</h2>
            <p class="text-xs sm:text-sm text-content-secondary leading-relaxed">
              From remote telemetry unit transmission over MQTT/REST, through Java Spring Boot physical rules and PostgreSQL indexed storage, to real-time operator workbench.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center font-mono text-xs">
            <div class="p-3 bg-subtle rounded border border-border space-y-1">
              <span class="text-content-primary font-bold block">01. INGEST</span>
              <p class="text-[11px] text-content-muted">AWS RTU Payload</p>
            </div>
            <div class="p-3 bg-subtle rounded border border-border space-y-1">
              <span class="text-content-primary font-bold block">02. BOUNDS</span>
              <p class="text-[11px] text-content-muted">WMO Limits</p>
            </div>
            <div class="p-3 bg-subtle rounded border border-border space-y-1">
              <span class="text-content-primary font-bold block">03. DELTA</span>
              <p class="text-[11px] text-content-muted">Rate-of-Change</p>
            </div>
            <div class="p-3 bg-subtle rounded border border-border space-y-1">
              <span class="text-content-primary font-bold block">04. CORRELATE</span>
              <p class="text-[11px] text-content-muted">Spatial Delta Check</p>
            </div>
            <div class="p-3 bg-subtle rounded border border-border space-y-1">
              <span class="text-content-primary font-bold block">05. DISPATCH</span>
              <p class="text-[11px] text-content-muted">Operator Quarantine</p>
            </div>
          </div>

          <div class="pt-2 flex flex-wrap gap-4">
            <a href="#/dashboard" class="btn-primary text-xs px-4 py-2">
              Launch Platform Mission Control →
            </a>
            <a href="#/technology" class="btn-secondary text-xs px-4 py-2">
              Inspect Pipeline Architecture Spec
            </a>
          </div>
        </div>
      </section>

    </div>
  `;

  // Attach Real-Time 3D Scroll Globe Scene
  setTimeout(() => {
    const canvasContainer = container.querySelector('#scroll-globe-container');
    if (canvasContainer) {
      const scrollGlobe = new ScrollGlobeScene(canvasContainer);
      container.cleanup = () => scrollGlobe.destroy();
    }
  }, 50);

  return container;
}
