import { Pipeline3DScene } from '../scenes/Pipeline3DScene.js';

export async function renderTechnologyView() {
  const container = document.createElement('div');
  container.className = 'w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12';

  container.innerHTML = `
    <!-- Header -->
    <div class="space-y-3 text-center sm:text-left border-b border-slate-200 dark:border-slate-800 pb-8">
      <span class="text-xs font-mono text-teal-700 dark:text-teal-400 font-semibold tracking-widest uppercase">TECHNICAL ARCHITECTURE</span>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
        Atmospheric Data Ingestion & Algorithmic Verification Engine
      </h1>
      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
        Explore the end-to-end data pipeline: from remote telemetry unit transducers through Java Spring Boot validation services to real-time incident triaging.
      </p>
    </div>

    <!-- 3D Pipeline Scene Container -->
    <div class="atmospheric-card p-4 relative overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-sm">
      <div class="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs font-mono text-slate-400">
        <span class="text-teal-400 font-semibold">PIPELINE 3D TELEMETRY FLOW</span>
        <span class="text-[11px]">AWS → INGEST → VALIDATE → CLASSIFY → DISPATCH</span>
      </div>
      <div id="tech-pipeline-canvas" class="w-full h-[360px] flex items-center justify-center"></div>
      <div class="text-[11px] text-center text-slate-400 pb-2 font-mono">
        Interactive 3D Stages: Rotating rings symbolize active verification filters in the ingestion pipeline
      </div>
    </div>

    <!-- Pipeline Step-by-Step Technical Breakdown -->
    <div class="space-y-6">
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Algorithmic Stage Breakdown</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Stage 1 -->
        <div class="atmospheric-card p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">STAGE 01</span>
            <span class="badge-info">INGESTION</span>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">Telemetry Ingestion & Authentication</h3>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Remote telemetry units (RTUs) transmit payloads over cellular (MQTT/HTTP REST) with station identifiers and ISO-8601 UTC timestamps. The Spring Boot backend authenticates transmission signatures and verifies sensor hardware IDs.
          </p>
          <div class="p-2.5 rounded bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            POST /api/observations/ingest
          </div>
        </div>

        <!-- Stage 2 -->
        <div class="atmospheric-card p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">STAGE 02</span>
            <span class="badge-online">PHYSICS CHECK</span>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">Deterministic Physical Boundary Filter</h3>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Every incoming float is checked against absolute physical plausibility limits. A temperature of 72°C or barometric pressure of 400 hPa at sea level triggers an immediate <code>CRITICAL OUT_OF_BOUNDS</code> flag and quality quarantine.
          </p>
          <div class="p-2.5 rounded bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-800">
            Threshold: T ∈ [-50°C, 60°C], P ∈ [870, 1085 hPa]
          </div>
        </div>

        <!-- Stage 3 -->
        <div class="atmospheric-card p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">STAGE 03</span>
            <span class="badge-warning">DELTA FILTER</span>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">Rate-of-Change & Temporal Step Discontinuity</h3>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Calculates the numerical derivative |v(t) - v(t-1)| / Δt. If the temporal delta exceeds maximum meteorological velocity (e.g., >10°C in 1 minute), the system isolates a transient electrical spike or RF interference.
          </p>
          <div class="p-2.5 rounded bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-amber-700 dark:text-amber-400 border border-slate-200 dark:border-slate-800">
            Max ΔT/step: 10.0°C | Max ΔP/step: 15.0 hPa
          </div>
        </div>

        <!-- Stage 4 -->
        <div class="atmospheric-card p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">STAGE 04</span>
            <span class="badge-warning">PERSISTENCE</span>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">Zero-Variance Flatline Detection</h3>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            In dynamic outdoor air, thermal and pressure noise inherently causes minor micro-fluctuations. If a sensor reports identical readings across 5+ consecutive sample windows, a sensor freeze anomaly is declared.
          </p>
          <div class="p-2.5 rounded bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-slate-800">
            Var(window) &lt; ε → Flatline Sensor Lock
          </div>
        </div>

      </div>
    </div>

    <!-- Backend & Data Storage Architecture -->
    <div class="atmospheric-card p-8 space-y-6">
      <div class="space-y-1">
        <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Full-Stack Architecture & Engine Core</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">Production-grade separation of concerns without unnecessary abstraction layers.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
          <span class="text-teal-700 dark:text-teal-400 font-bold block">BACKEND</span>
          <p class="text-slate-600 dark:text-slate-300 text-[11px] font-sans">Java 17 / 21+ with Spring Boot 3.3.4, Spring Security, stateless JWT, Jakarta validation.</p>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
          <span class="text-amber-700 dark:text-amber-400 font-bold block">DATABASE</span>
          <p class="text-slate-600 dark:text-slate-300 text-[11px] font-sans">PostgreSQL in production with indexed temporal observations; H2 memory profile for local testing.</p>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
          <span class="text-sky-700 dark:text-sky-400 font-bold block">FRONTEND</span>
          <p class="text-slate-600 dark:text-slate-300 text-[11px] font-sans">Vanilla JavaScript ES Modules, Tailwind CSS design system tokens, Three.js 3D Viewports, Chart.js.</p>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const canvasContainer = container.querySelector('#tech-pipeline-canvas');
    if (canvasContainer) {
      const pipelineScene = new Pipeline3DScene(canvasContainer);
      container.cleanup = () => pipelineScene.destroy();
    }
  }, 50);

  return container;
}
