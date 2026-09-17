import { Pipeline3DScene } from '../scenes/Pipeline3DScene.js';

export async function renderTechnologyView() {
  const container = document.createElement('div');
  container.className = 'w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12';

  container.innerHTML = `
    <!-- Header -->
    <div class="space-y-3 text-center sm:text-left border-b border-border pb-8">
      <span class="text-xs font-mono text-content-muted font-medium tracking-widest uppercase">TECHNICAL ARCHITECTURE</span>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight leading-tight">
        Atmospheric Data Ingestion & Algorithmic Verification Engine
      </h1>
      <p class="text-sm sm:text-base text-content-secondary max-w-3xl leading-relaxed">
        Explore the end-to-end data pipeline: from remote telemetry unit transducers through Java Spring Boot validation services to real-time incident triaging.
      </p>
    </div>

    <!-- 3D Pipeline Scene Container -->
    <div class="atmospheric-card p-4 relative overflow-hidden bg-surface-dark text-slate-100">
      <div class="flex items-center justify-between px-3 py-2 border-b border-border text-xs font-mono text-content-muted">
        <span class="font-medium">PIPELINE 3D TELEMETRY FLOW</span>
        <span class="text-[11px]">AWS → INGEST → VALIDATE → CLASSIFY → DISPATCH</span>
      </div>
      <div id="tech-pipeline-canvas" class="w-full h-[360px] flex items-center justify-center"></div>
      <div class="text-[11px] text-center text-content-muted pb-2 font-mono">
        Interactive 3D Stages: Rotating rings symbolize active verification filters in the ingestion pipeline
      </div>
    </div>

    <!-- Pipeline Step-by-Step Technical Breakdown -->
    <div class="space-y-6">
      <h2 class="text-xl sm:text-2xl font-bold text-content-primary">Algorithmic Stage Breakdown</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Stage 1 -->
        <div class="atmospheric-card p-6 space-y-3">
          <div class="flex items-center justify-between border-b border-border pb-2">
            <span class="text-xs font-mono font-medium text-content-muted">STAGE 01</span>
            <span class="text-[10px] font-mono text-content-muted font-medium uppercase">INGESTION</span>
          </div>
          <h3 class="text-base font-bold text-content-primary">Telemetry Ingestion & Authentication</h3>
          <p class="text-xs text-content-secondary leading-relaxed">
            Remote telemetry units (RTUs) transmit payloads over cellular (MQTT/HTTP REST) with station identifiers and ISO-8601 UTC timestamps. The Spring Boot backend authenticates transmission signatures and verifies sensor hardware IDs.
          </p>
          <div class="p-2.5 rounded-lg bg-subtle font-mono text-[11px] text-content-secondary border border-border">
            POST /api/observations/ingest
          </div>
        </div>

        <!-- Stage 2 -->
        <div class="atmospheric-card p-6 space-y-3">
          <div class="flex items-center justify-between border-b border-border pb-2">
            <span class="text-xs font-mono font-medium text-content-muted">STAGE 02</span>
            <span class="text-[10px] font-mono text-content-muted font-medium uppercase">PHYSICS CHECK</span>
          </div>
          <h3 class="text-base font-bold text-content-primary">Deterministic Physical Boundary Filter</h3>
          <p class="text-xs text-content-secondary leading-relaxed">
            Every incoming float is checked against absolute physical plausibility limits. A temperature of 72°C or barometric pressure of 400 hPa at sea level triggers an immediate <code>CRITICAL OUT_OF_BOUNDS</code> flag and quality quarantine.
          </p>
          <div class="p-2.5 rounded-lg bg-subtle font-mono text-[11px] text-content-secondary border border-border">
            Threshold: T ∈ [-50°C, 60°C], P ∈ [870, 1085 hPa]
          </div>
        </div>

        <!-- Stage 3 -->
        <div class="atmospheric-card p-6 space-y-3">
          <div class="flex items-center justify-between border-b border-border pb-2">
            <span class="text-xs font-mono font-medium text-content-muted">STAGE 03</span>
            <span class="text-[10px] font-mono text-content-muted font-medium uppercase">DELTA FILTER</span>
          </div>
          <h3 class="text-base font-bold text-content-primary">Rate-of-Change & Temporal Step Discontinuity</h3>
          <p class="text-xs text-content-secondary leading-relaxed">
            Calculates the numerical derivative |v(t) - v(t-1)| / Δt. If the temporal delta exceeds maximum meteorological velocity (e.g., >10°C in 1 minute), the system isolates a transient electrical spike or RF interference.
          </p>
          <div class="p-2.5 rounded-lg bg-subtle font-mono text-[11px] text-content-secondary border border-border">
            Max ΔT/step: 10.0°C | Max ΔP/step: 15.0 hPa
          </div>
        </div>

        <!-- Stage 4 -->
        <div class="atmospheric-card p-6 space-y-3">
          <div class="flex items-center justify-between border-b border-border pb-2">
            <span class="text-xs font-mono font-medium text-content-muted">STAGE 04</span>
            <span class="text-[10px] font-mono text-content-muted font-medium uppercase">PERSISTENCE</span>
          </div>
          <h3 class="text-base font-bold text-content-primary">Zero-Variance Flatline Detection</h3>
          <p class="text-xs text-content-secondary leading-relaxed">
            In dynamic outdoor air, thermal and pressure noise inherently causes minor micro-fluctuations. If a sensor reports identical readings across 5+ consecutive sample windows, a sensor freeze anomaly is declared.
          </p>
          <div class="p-2.5 rounded-lg bg-subtle font-mono text-[11px] text-content-secondary border border-border">
            Var(window) &lt; ε → Flatline Sensor Lock
          </div>
        </div>

      </div>
    </div>

    <!-- Backend & Data Storage Architecture -->
    <div class="atmospheric-card p-6 sm:p-8 space-y-6">
      <div class="space-y-1">
        <h2 class="text-xl font-bold text-content-primary">Full-Stack Architecture & Engine Core</h2>
        <p class="text-xs text-content-muted">Production-grade separation of concerns without unnecessary abstraction layers.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div class="p-4 bg-subtle rounded-lg border border-border space-y-2">
          <span class="text-content-primary font-bold block">BACKEND</span>
          <p class="text-content-secondary text-[11px] font-sans">Java 17 / 21+ with Spring Boot 3.3.4, Spring Security, stateless JWT, Jakarta validation.</p>
        </div>
        <div class="p-4 bg-subtle rounded-lg border border-border space-y-2">
          <span class="text-content-primary font-bold block">DATABASE</span>
          <p class="text-content-secondary text-[11px] font-sans">PostgreSQL in production with indexed temporal observations; H2 memory profile for local testing.</p>
        </div>
        <div class="p-4 bg-subtle rounded-lg border border-border space-y-2">
          <span class="text-content-primary font-bold block">FRONTEND</span>
          <p class="text-content-secondary text-[11px] font-sans">Vanilla JavaScript ES Modules, Tailwind CSS design system tokens, Three.js 3D Viewports, Chart.js.</p>
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

