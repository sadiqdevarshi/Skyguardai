import Chart from 'chart.js/auto';
import { themeManager } from './theme.js';

function getChartColors() {
  const isDark = themeManager.getTheme() === 'dark';
  return {
    gridColor: isDark ? 'rgba(51, 65, 85, 0.25)' : 'rgba(226, 232, 240, 0.7)',
    tickColor: isDark ? '#94A3B8' : '#64748B',
    tooltipBg: isDark ? '#18202D' : '#FFFFFF',
    tooltipTitle: isDark ? '#F8FAFC' : '#0F172A',
    tooltipBody: isDark ? '#CBD5E1' : '#334155',
    tooltipBorder: isDark ? '#263345' : '#E2E8F0',
    
    // Controlled Scientific Palette:
    // Primary observation line: neutral high-contrast slate
    primaryLine: isDark ? '#94A3B8' : '#475569',
    primaryArea: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(71, 85, 105, 0.04)',
    
    // Secondary telemetry series (subtle differentiation):
    secondaryLine: isDark ? '#64748B' : '#64748B',
    tertiaryLine: isDark ? '#4D6280' : '#94A3B8',
    
    // Semantic anomaly / alert indicator:
    anomalyColor: isDark ? '#F87171' : '#DC2626',
    warningColor: isDark ? '#FBBF24' : '#D97706',
    accentColor: isDark ? '#2DD4BF' : '#0F766E'
  };
}

export function createTelemetryChart(canvas, observations, options = {}) {
  if (!canvas) return null;

  const c = getChartColors();
  const labels = observations.map(o => {
    const d = new Date(o.timestamp);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });

  const temperatures = observations.map(o => o.temperature);
  const pressures = observations.map(o => o.atmosphericPressure);
  const humidities = observations.map(o => o.relativeHumidity);

  return new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          borderColor: c.primaryLine,
          backgroundColor: c.primaryArea,
          borderWidth: 1.5,
          pointRadius: 1.5,
          pointHoverRadius: 4,
          pointBackgroundColor: c.primaryLine,
          tension: 0.2,
          yAxisID: 'yTemp',
          fill: true
        },
        {
          label: 'Pressure (hPa)',
          data: pressures,
          borderColor: c.secondaryLine,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [5, 4],
          pointRadius: 1.5,
          pointHoverRadius: 4,
          pointBackgroundColor: c.secondaryLine,
          tension: 0.2,
          yAxisID: 'yPres'
        },
        {
          label: 'Humidity (%)',
          data: humidities,
          borderColor: c.tertiaryLine,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [2, 2],
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0.2,
          yAxisID: 'yHum'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            color: c.tickColor,
            font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' },
            boxWidth: 12,
            boxHeight: 6,
            usePointStyle: false
          }
        },
        tooltip: {
          backgroundColor: c.tooltipBg,
          titleColor: c.tooltipTitle,
          bodyColor: c.tooltipBody,
          borderColor: c.tooltipBorder,
          borderWidth: 1,
          padding: 8,
          boxPadding: 4,
          usePointStyle: true
        }
      },
      scales: {
        x: {
          grid: { color: c.gridColor },
          ticks: { color: c.tickColor, font: { family: 'JetBrains Mono', size: 10 } }
        },
        yTemp: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: { color: c.gridColor },
          ticks: { color: c.tickColor, font: { family: 'JetBrains Mono', size: 10 } },
          title: { display: true, text: 'Temperature (°C)', color: c.tickColor, font: { size: 10, family: 'Plus Jakarta Sans' } }
        },
        yPres: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: c.tickColor, font: { family: 'JetBrains Mono', size: 10 } },
          title: { display: true, text: 'Pressure (hPa)', color: c.tickColor, font: { size: 10, family: 'Plus Jakarta Sans' } }
        },
        yHum: {
          type: 'linear',
          display: false,
          min: 0,
          max: 100
        }
      },
      ...options
    }
  });
}

export function createAnomalyInvestigationChart(canvas, anomaly) {
  if (!canvas || !anomaly) return null;

  const c = getChartColors();
  const points = 12;
  const labels = [];
  const baseline = [];
  const upperConfidence = [];
  const lowerConfidence = [];
  const observed = [];

  const baseVal = anomaly.expectedBaselineValue || 20.0;
  const targetVal = anomaly.observedValue || 45.0;

  for (let i = 0; i < points; i++) {
    labels.push(`T-${points - 1 - i}m`);
    if (i < points - 2) {
      const normal = baseVal + (Math.sin(i) * 0.6);
      baseline.push(normal);
      upperConfidence.push(normal + 2.5);
      lowerConfidence.push(normal - 2.5);
      observed.push(normal + (Math.random() * 0.3 - 0.15));
    } else if (i === points - 2) {
      baseline.push(baseVal);
      upperConfidence.push(baseVal + 2.5);
      lowerConfidence.push(baseVal - 2.5);
      observed.push(targetVal);
    } else {
      baseline.push(baseVal);
      upperConfidence.push(baseVal + 2.5);
      lowerConfidence.push(baseVal - 2.5);
      observed.push(targetVal - 1.5);
    }
  }

  return new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Observed Telemetry',
          data: observed,
          borderColor: c.primaryLine,
          backgroundColor: 'transparent',
          borderWidth: 1.75,
          pointRadius: (ctx) => (ctx.dataIndex === points - 2 ? 5 : 2),
          pointBackgroundColor: (ctx) => (ctx.dataIndex === points - 2 ? c.anomalyColor : c.primaryLine),
          pointBorderColor: (ctx) => (ctx.dataIndex === points - 2 ? '#FFFFFF' : 'transparent'),
          pointBorderWidth: 1.5,
          fill: false,
          tension: 0.15
        },
        {
          label: 'Expected Baseline',
          data: baseline,
          borderColor: c.secondaryLine,
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false
        },
        {
          label: 'Confidence Band (95%)',
          data: upperConfidence,
          borderColor: 'transparent',
          pointRadius: 0,
          fill: '+1',
          backgroundColor: c.primaryArea
        },
        {
          label: 'Lower Bound',
          data: lowerConfidence,
          borderColor: 'transparent',
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            color: c.tickColor,
            font: { family: 'Plus Jakarta Sans', size: 10 },
            boxWidth: 10,
            boxHeight: 4,
            filter: (item) => item.text !== 'Lower Bound'
          }
        },
        tooltip: {
          backgroundColor: c.tooltipBg,
          titleColor: c.tooltipTitle,
          bodyColor: c.tooltipBody,
          borderColor: c.tooltipBorder,
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: c.gridColor },
          ticks: { color: c.tickColor, font: { family: 'JetBrains Mono', size: 10 } }
        },
        y: {
          grid: { color: c.gridColor },
          ticks: { color: c.tickColor, font: { family: 'JetBrains Mono', size: 10 } }
        }
      }
    }
  });
}

export function createDistributionChart(canvas, dataMap, label = 'Anomalies') {
  if (!canvas || !dataMap) return null;

  const c = getChartColors();
  const labels = Object.keys(dataMap).map(k => k.replace(/_/g, ' '));
  const values = Object.values(dataMap);

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label,
        data: values,
        backgroundColor: c.primaryLine,
        borderRadius: 2,
        barThickness: 24
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: c.tickColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
        },
        y: {
          grid: { color: c.gridColor },
          ticks: { color: c.tickColor, stepSize: 1, font: { family: 'JetBrains Mono', size: 10 } }
        }
      }
    }
  });
}
