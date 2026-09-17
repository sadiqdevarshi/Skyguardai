import Chart from 'chart.js/auto';
import { themeManager } from './theme.js';

function getChartColors() {
  const isDark = themeManager.getTheme() === 'dark';
  return {
    gridColor: isDark ? 'rgba(51, 65, 85, 0.35)' : 'rgba(226, 232, 240, 0.8)',
    tickColor: isDark ? '#94A3B8' : '#64748B',
    tooltipBg: isDark ? '#18202D' : '#FFFFFF',
    tooltipTitle: isDark ? '#F8FAFC' : '#0F172A',
    tooltipBody: isDark ? '#CBD5E1' : '#334155',
    tooltipBorder: isDark ? '#263345' : '#E2E8F0',
    tempColor: isDark ? '#F59E0B' : '#D97706',
    presColor: isDark ? '#38BDF8' : '#0284C7',
    humColor: isDark ? '#60A5FA' : '#2563EB',
    errorColor: isDark ? '#F87171' : '#DC2626'
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
          borderColor: c.tempColor,
          backgroundColor: 'rgba(217, 119, 6, 0.08)',
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 5,
          tension: 0.3,
          yAxisID: 'yTemp',
          fill: true
        },
        {
          label: 'Pressure (hPa)',
          data: pressures,
          borderColor: c.presColor,
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 5,
          tension: 0.3,
          yAxisID: 'yPres'
        },
        {
          label: 'Humidity (%)',
          data: humidities,
          borderColor: c.humColor,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointRadius: 2,
          pointHoverRadius: 5,
          tension: 0.3,
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
          labels: {
            color: c.tickColor,
            font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' }
          }
        },
        tooltip: {
          backgroundColor: c.tooltipBg,
          titleColor: c.tooltipTitle,
          bodyColor: c.tooltipBody,
          borderColor: c.tooltipBorder,
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          usePointStyle: true,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
          ticks: { color: c.tempColor, font: { family: 'JetBrains Mono', size: 10 } },
          title: { display: true, text: 'Temp (°C)', color: c.tempColor, font: { size: 10 } }
        },
        yPres: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: c.presColor, font: { family: 'JetBrains Mono', size: 10 } },
          title: { display: true, text: 'hPa', color: c.presColor, font: { size: 10 } }
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
      const normal = baseVal + (Math.sin(i) * 0.8);
      baseline.push(normal);
      upperConfidence.push(normal + 3.0);
      lowerConfidence.push(normal - 3.0);
      observed.push(normal + (Math.random() * 0.4 - 0.2));
    } else if (i === points - 2) {
      baseline.push(baseVal);
      upperConfidence.push(baseVal + 3.0);
      lowerConfidence.push(baseVal - 3.0);
      observed.push(targetVal);
    } else {
      baseline.push(baseVal);
      upperConfidence.push(baseVal + 3.0);
      lowerConfidence.push(baseVal - 3.0);
      observed.push(targetVal - 2.0);
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
          borderColor: c.errorColor,
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          borderWidth: 2.5,
          pointRadius: (ctx) => (ctx.dataIndex === points - 2 ? 6 : 3),
          pointBackgroundColor: (ctx) => (ctx.dataIndex === points - 2 ? c.errorColor : '#F87171'),
          pointBorderColor: '#FFF',
          pointBorderWidth: 1.5,
          fill: false,
          tension: 0.2
        },
        {
          label: 'Expected Baseline',
          data: baseline,
          borderColor: c.presColor,
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        },
        {
          label: 'Upper Confidence (95%)',
          data: upperConfidence,
          borderColor: 'rgba(148, 163, 184, 0.3)',
          borderWidth: 1,
          pointRadius: 0,
          fill: '+1',
          backgroundColor: 'rgba(14, 165, 233, 0.05)'
        },
        {
          label: 'Lower Confidence (95%)',
          data: lowerConfidence,
          borderColor: 'rgba(148, 163, 184, 0.3)',
          borderWidth: 1,
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
          labels: { color: c.tickColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
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
        backgroundColor: [
          'rgba(15, 118, 110, 0.7)',
          'rgba(217, 119, 6, 0.7)',
          'rgba(37, 99, 235, 0.7)',
          'rgba(225, 29, 72, 0.7)'
        ],
        borderColor: [
          '#0F766E',
          '#D97706',
          '#2563EB',
          '#E11D48'
        ],
        borderWidth: 1,
        borderRadius: 4
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
          ticks: { color: c.tickColor, font: { size: 10 } }
        },
        y: {
          grid: { color: c.gridColor },
          ticks: { color: c.tickColor, stepSize: 1, font: { family: 'JetBrains Mono', size: 10 } }
        }
      }
    }
  });
}
