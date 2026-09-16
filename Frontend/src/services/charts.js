import Chart from 'chart.js/auto';

export function createTelemetryChart(canvas, observations, options = {}) {
  if (!canvas) return null;

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
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
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
          borderColor: '#06B6D4',
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
          borderColor: '#3B82F6',
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
            color: '#94A3B8',
            font: { family: 'Plus Jakarta Sans', size: 12 }
          }
        },
        tooltip: {
          backgroundColor: '#0F172A',
          titleColor: '#F8FAFC',
          bodyColor: '#CBD5E1',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          usePointStyle: true
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 10 } }
        },
        yTemp: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: { color: '#F59E0B', font: { family: 'JetBrains Mono', size: 10 } },
          title: { display: true, text: 'Temp (°C)', color: '#F59E0B', font: { size: 10 } }
        },
        yPres: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#06B6D4', font: { family: 'JetBrains Mono', size: 10 } },
          title: { display: true, text: 'hPa', color: '#06B6D4', font: { size: 10 } }
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
      // The anomaly event point
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
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          borderWidth: 2.5,
          pointRadius: (ctx) => (ctx.dataIndex === points - 2 ? 7 : 3),
          pointBackgroundColor: (ctx) => (ctx.dataIndex === points - 2 ? '#EF4444' : '#F87171'),
          pointBorderColor: '#FFF',
          pointBorderWidth: 2,
          fill: false,
          tension: 0.2
        },
        {
          label: 'Expected Baseline',
          data: baseline,
          borderColor: '#06B6D4',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        },
        {
          label: 'Upper Confidence (95%)',
          data: upperConfidence,
          borderColor: 'rgba(148, 163, 184, 0.2)',
          borderWidth: 1,
          pointRadius: 0,
          fill: '+1',
          backgroundColor: 'rgba(6, 182, 212, 0.05)'
        },
        {
          label: 'Lower Confidence (95%)',
          data: lowerConfidence,
          borderColor: 'rgba(148, 163, 184, 0.2)',
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
          labels: { color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 11 } }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 10 } }
        },
        y: {
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: { color: '#94A3B8', font: { family: 'JetBrains Mono', size: 10 } }
        }
      }
    }
  });
}

export function createDistributionChart(canvas, dataMap, label = 'Anomalies', color = '#06B6D4') {
  if (!canvas || !dataMap) return null;

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
          'rgba(6, 182, 212, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(239, 68, 68, 0.6)'
        ],
        borderColor: [
          '#06B6D4',
          '#F59E0B',
          '#3B82F6',
          '#EF4444'
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
          ticks: { color: '#94A3B8', font: { size: 10 } }
        },
        y: {
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: { color: '#64748B', stepSize: 1, font: { family: 'JetBrains Mono', size: 10 } }
        }
      }
    }
  });
}
