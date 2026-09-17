export async function renderAboutView() {
  const container = document.createElement('div');
  container.className = 'w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12';

  container.innerHTML = `
    <!-- Header / Mission Title -->
    <div class="space-y-3 text-center sm:text-left border-b border-slate-200 dark:border-slate-800 pb-8">
      <span class="text-xs font-mono text-teal-700 dark:text-teal-400 font-semibold tracking-widest uppercase">SCIENTIFIC PHILOSOPHY & METEOROLOGY</span>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
        The Reality of Modern Automatic Weather Station Networks
      </h1>
      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
        Meteorological observations power agricultural forecasting, aviation safety, hydrology models, and climate change records. Yet the physical instruments generating this data operate unattended in harsh, unmonitored environments where subtle degradation goes undetected for months.
      </p>
    </div>

    <!-- Section 1: The Sensor Degradation Problem -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div class="space-y-4">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Why Weather Stations Fail Silently</h2>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Unlike industrial factory sensors situated in climate-controlled facilities, meteorological stations encounter extreme thermal cycling, solar ultraviolet radiation, riming ice, salt-mist corrosion, and animal interference.
        </p>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          When an RTD temperature sensor slowly drifts by 1.8°C over four months or a capacitive hygrometer becomes coated with marine salt, the readings appear plausible to basic database validation. These "silent corruptions" contaminate climate baseline datasets.
        </p>
      </div>

      <div class="editorial-card p-6 space-y-4">
        <h3 class="text-xs font-bold text-teal-700 dark:text-teal-400 font-mono uppercase tracking-wider">Common In-Situ Failure Modes</h3>
        <ul class="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <li class="flex items-start space-x-2">
            <span class="text-amber-500 font-bold">•</span>
            <span><strong class="text-slate-900 dark:text-slate-100">Solar Radiation Shield Soiling:</strong> Radiation shields accumulate dust or soot, causing artificial diurnal thermal superheating up to +6°C under low wind conditions.</span>
          </li>
          <li class="flex items-start space-x-2">
            <span class="text-sky-500 font-bold">•</span>
            <span><strong class="text-slate-900 dark:text-slate-100">Static Pressure Port Ice Riming:</strong> Alpine barometers suffer ice accretion on static intake tubes, causing abrupt step jumps or isolated vacuum readings.</span>
          </li>
          <li class="flex items-start space-x-2">
            <span class="text-teal-500 font-bold">•</span>
            <span><strong class="text-slate-900 dark:text-slate-100">Hygrometer Capacitive Saturation:</strong> Coastal fog leaves salt residue on hygrometer membranes, causing the sensor to permanently register 100.0% relative humidity.</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Section 2: Aerisence Core Parameters -->
    <div class="space-y-6">
      <div class="space-y-1">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Monitored Atmospheric Parameters</h2>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Aerisence focuses deeply on the three foundational meteorological state variables:</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="atmospheric-card p-6 space-y-3 border-t-2 border-t-amber-500">
          <div class="flex justify-between items-center">
            <span class="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">01. TEMPERATURE</span>
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400">°C</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Measures kinetic thermal state. Verified against solar elevation angle, nocturnal radiational cooling gradients, and historical station extremes.
          </p>
          <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
            WMO Bound: -50.0°C to +60.0°C
          </div>
        </div>

        <div class="atmospheric-card p-6 space-y-3 border-t-2 border-t-sky-500">
          <div class="flex justify-between items-center">
            <span class="text-xs font-mono font-bold text-sky-700 dark:text-sky-400">02. ATMOSPHERIC PRESSURE</span>
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400">hPa / mbar</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Measures hydrostatic column mass. Verified using barometric hypsometric formula against station station elevation MSL and regional isobaric gradients.
          </p>
          <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
            Terrestrial Limit: 870 to 1085 hPa
          </div>
        </div>

        <div class="atmospheric-card p-6 space-y-3 border-t-2 border-t-teal-500">
          <div class="flex justify-between items-center">
            <span class="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">03. RELATIVE HUMIDITY</span>
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400">% RH</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Measures water vapor saturation ratio. Cross-checked with temperature to ensure dew point never mathematically exceeds ambient dry-bulb temperature.
          </p>
          <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
            Physical Domain: 0.0% to 100.0%
          </div>
        </div>

      </div>
    </div>

    <!-- Section 3: The Aerisence Approach -->
    <div class="atmospheric-card p-8 space-y-4">
      <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Deterministic Physical Boundaries & Algorithmic Triage</h2>
      <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        Aerisence treats weather stations not as raw numbers on a chart, but as physical measurement nodes subject to atmospheric dynamics. By enforcing thermodynamic continuity checks and variance gates before telemetry enters permanent storage, station networks maintain publication-grade data integrity.
      </p>
      <div class="pt-2 flex flex-wrap gap-4">
        <a href="#/monitoring" class="btn-primary text-xs px-4 py-2">Open Station Fleet Monitor →</a>
        <a href="#/technology" class="btn-secondary text-xs px-4 py-2">Inspect Ingestion Pipeline Architecture</a>
      </div>
    </div>
  `;

  return container;
}
