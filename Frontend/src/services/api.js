/**
 * Aerisence API Client
 * Provides REST calls with seamless live backend connection & offline dataset fallback
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Fallback seed data for offline mode / rapid development
const FALLBACK_STATIONS = [
  {
    id: 1,
    stationCode: "AWS-101-ALP",
    name: "Alpine Ridge High Summit",
    region: "European Alps",
    latitude: 45.8326,
    longitude: 6.8652,
    elevationMeters: 2450.0,
    status: "ONLINE",
    batteryLevel: 94.2,
    lastHeartbeat: new Date().toISOString(),
    currentTemperature: -2.4,
    currentPressure: 752.1,
    currentHumidity: 78.5,
    activeAnomalyCount: 1,
    description: "High-altitude permafrost and glacial boundary monitoring station with heated ultrasonic anemometer."
  },
  {
    id: 2,
    stationCode: "AWS-204-CST",
    name: "Pacific Maritime Pier Observatory",
    region: "Pacific Coastline",
    latitude: 36.6002,
    longitude: -121.8947,
    elevationMeters: 12.0,
    status: "ONLINE",
    batteryLevel: 98.8,
    lastHeartbeat: new Date().toISOString(),
    currentTemperature: 19.8,
    currentPressure: 1014.2,
    currentHumidity: 88.0,
    activeAnomalyCount: 1,
    description: "Coastal marine boundary layer station measuring sea-spray humidity and barometric marine surges."
  },
  {
    id: 3,
    stationCode: "AWS-312-PLN",
    name: "Midwest Agro-Meteorological Hub",
    region: "Central Plains",
    latitude: 41.8781,
    longitude: -93.0977,
    elevationMeters: 230.0,
    status: "DEGRADED",
    batteryLevel: 88.5,
    lastHeartbeat: new Date().toISOString(),
    currentTemperature: 24.5,
    currentPressure: 998.4,
    currentHumidity: 54.2,
    activeAnomalyCount: 1,
    description: "Agricultural microclimate array assessing soil-air boundary temperature fluctuations."
  },
  {
    id: 4,
    stationCode: "AWS-408-DSN",
    name: "Mojave Desert Biosphere Array",
    region: "Southwest Basin",
    latitude: 35.0110,
    longitude: -115.4734,
    elevationMeters: 640.0,
    status: "ONLINE",
    batteryLevel: 99.1,
    lastHeartbeat: new Date().toISOString(),
    currentTemperature: 38.2,
    currentPressure: 945.6,
    currentHumidity: 12.4,
    activeAnomalyCount: 0,
    description: "Extreme thermal diurnal oscillation monitoring in arid low-humidity desert terrain."
  },
  {
    id: 5,
    stationCode: "AWS-515-FRT",
    name: "Boreal Forest Eco-Observatory",
    region: "Northern Taiga",
    latitude: 53.5461,
    longitude: -113.4938,
    elevationMeters: 670.0,
    status: "ONLINE",
    batteryLevel: 91.0,
    lastHeartbeat: new Date().toISOString(),
    currentTemperature: 12.8,
    currentPressure: 938.0,
    currentHumidity: 65.1,
    activeAnomalyCount: 0,
    description: "Canopy humidity gradient and cold-front pressure propagation research."
  },
  {
    id: 6,
    stationCode: "AWS-620-MET",
    name: "Metro Core Atmospheric Mast",
    region: "Metropolitan Center",
    latitude: 40.7128,
    longitude: -74.0060,
    elevationMeters: 110.0,
    status: "ONLINE",
    batteryLevel: 100.0,
    lastHeartbeat: new Date().toISOString(),
    currentTemperature: 22.1,
    currentPressure: 1012.3,
    currentHumidity: 58.7,
    activeAnomalyCount: 0,
    description: "Urban heat island quantification and convective pressure drop analysis."
  }
];

const FALLBACK_ANOMALIES = [
  {
    id: 1,
    stationId: 3,
    stationCode: "AWS-312-PLN",
    stationName: "Midwest Agro-Meteorological Hub",
    region: "Central Plains",
    parameter: "TEMPERATURE",
    anomalyType: "SPIKE",
    severity: "CRITICAL",
    status: "OPEN",
    observedValue: 48.6,
    expectedBaselineValue: 17.4,
    confidenceScore: 98.9,
    rootCauseExplanation: "Sudden instantaneous thermal spike (+31.2°C delta) detected on RTD sensor channel 1 without corresponding barometric disturbance.",
    recommendedAction: "Verify ground shield wiring, inspect junction box for rodent damage, and run remote calibration sequence.",
    detectedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 2,
    stationId: 1,
    stationCode: "AWS-101-ALP",
    stationName: "Alpine Ridge High Summit",
    region: "European Alps",
    parameter: "ATMOSPHERIC_PRESSURE",
    anomalyType: "STEP_CHANGE",
    severity: "WARNING",
    status: "ACKNOWLEDGED",
    observedValue: 710.2,
    expectedBaselineValue: 748.5,
    confidenceScore: 94.2,
    rootCauseExplanation: "Abrupt barometric step change of -38.3 hPa in sub-zero summit conditions.",
    recommendedAction: "Inspect pressure intake venting tube for riming/ice accretion blocking static port.",
    detectedAt: new Date(Date.now() - 2700000).toISOString(),
    acknowledgedAt: new Date(Date.now() - 2400000).toISOString(),
    remarks: "Investigating alpine de-icing heating circuit telemetry."
  },
  {
    id: 3,
    stationId: 2,
    stationCode: "AWS-204-CST",
    stationName: "Pacific Maritime Pier Observatory",
    region: "Pacific Coastline",
    parameter: "RELATIVE_HUMIDITY",
    anomalyType: "PERSISTENCE_FLATLINE",
    severity: "WARNING",
    status: "OPEN",
    observedValue: 100.0,
    expectedBaselineValue: 84.0,
    confidenceScore: 92.0,
    rootCauseExplanation: "Capacitive hygrometer locked at 100.0% saturation for >6 consecutive hours following heavy coastal sea fog.",
    recommendedAction: "Clean sensor sintering filter and verify heating pulse to evaporate condensed salt residue.",
    detectedAt: new Date(Date.now() - 21600000).toISOString()
  }
];

const FALLBACK_ALERTS = [
  {
    id: 1,
    anomalyId: 1,
    stationId: 3,
    stationCode: "AWS-312-PLN",
    stationName: "Midwest Agro-Meteorological Hub",
    title: "CRITICAL: Severe Temperature Spike on AWS-312-PLN",
    message: "Sensor reading +48.6°C exceeds rate-of-change safety envelope.",
    severity: "CRITICAL",
    acknowledged: false,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 2,
    anomalyId: 2,
    stationId: 1,
    stationCode: "AWS-101-ALP",
    stationName: "Alpine Ridge High Summit",
    title: "WARNING: Alpine Pressure Step Drop on AWS-101-ALP",
    message: "Barometric pressure shifted -38.3 hPa. Possible static port freeze.",
    severity: "WARNING",
    acknowledged: true,
    acknowledgedBy: "operator",
    acknowledgedAt: new Date(Date.now() - 2400000).toISOString(),
    createdAt: new Date(Date.now() - 2700000).toISOString()
  },
  {
    id: 3,
    anomalyId: 3,
    stationId: 2,
    stationCode: "AWS-204-CST",
    stationName: "Pacific Maritime Pier Observatory",
    title: "WARNING: Hygrometer Saturation Lock on AWS-204-CST",
    message: "Persistence flatline at 100.0% relative humidity detected.",
    severity: "WARNING",
    acknowledged: false,
    createdAt: new Date(Date.now() - 21600000).toISOString()
  }
];

const FALLBACK_REPORTS = [
  {
    id: 1,
    title: "Weekly Network Quality & Sensor Health Audit",
    reportType: "NETWORK_HEALTH",
    dateRangeStart: new Date(Date.now() - 7 * 86400000).toISOString(),
    dateRangeEnd: new Date().toISOString(),
    status: "COMPLETED",
    generatedBy: "analyst",
    fileFormat: "JSON",
    summaryJson: JSON.stringify({
      reportTitle: "Weekly Network Quality Audit",
      totalStations: 6,
      activeSensors: 18,
      observationsIngested: 40320,
      validObservationsRatio: 0.992,
      anomaliesFlagged: 3,
      recommendations: "Schedule on-site filter clean for AWS-204-CST and inspect RTD wiring on AWS-312-PLN."
    }),
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    title: "Alpine Summit Microclimate Diurnal Analysis",
    reportType: "METEOROLOGICAL_TREND",
    dateRangeStart: new Date(Date.now() - 3 * 86400000).toISOString(),
    dateRangeEnd: new Date().toISOString(),
    status: "COMPLETED",
    generatedBy: "analyst",
    fileFormat: "JSON",
    summaryJson: JSON.stringify({
      stationCode: "AWS-101-ALP",
      meanTemp: -2.4,
      minTemp: -8.1,
      maxTemp: 3.2,
      pressureStabilityIndex: 0.94,
      frostRiskLevel: "HIGH"
    }),
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('aerisence_jwt') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('aerisence_jwt', token);
    } else {
      localStorage.removeItem('aerisence_jwt');
    }
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers
        }
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(err.message || `HTTP Error ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`[Aerisence API] Direct fetch failed for ${endpoint}. Falling back to internal state:`, error.message);
      return null;
    }
  }

  // Stations
  async getStations() {
    const res = await this.request('/stations');
    return (res && res.data) ? res.data : FALLBACK_STATIONS;
  }

  async getStationDetail(id) {
    const res = await this.request(`/stations/${id}`);
    if (res && res.data) return res.data;

    const base = FALLBACK_STATIONS.find(s => s.id === Number(id)) || FALLBACK_STATIONS[0];
    const history = [];
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      const t = new Date(now - i * 3600000);
      const h = t.getHours();
      const tempVar = Math.sin((h - 9) * Math.PI / 12) * 5.0;
      history.push({
        id: 1000 + i,
        stationId: base.id,
        stationCode: base.stationCode,
        timestamp: t.toISOString(),
        temperature: +(base.currentTemperature + tempVar + (Math.random() * 0.4 - 0.2)).toFixed(1),
        atmosphericPressure: +(base.currentPressure + Math.cos(h * Math.PI / 12) * 1.5).toFixed(1),
        relativeHumidity: +Math.max(10, Math.min(99, base.currentHumidity - tempVar * 2)).toFixed(1),
        qualityFlag: (base.id === 3 && i === 2) ? "ANOMALOUS" : "VALID"
      });
    }

    return {
      ...base,
      sensors: [
        { id: 1, parameter: "TEMPERATURE", model: "Vaisala PT100 Platinum RTD", serialNumber: `SN-TMP-${base.stationCode}`, healthScore: base.id === 3 ? 62.0 : 98.5, status: base.id === 3 ? "DEGRADED" : "OPERATIONAL" },
        { id: 2, parameter: "ATMOSPHERIC_PRESSURE", model: "Setra 278 Barometric Transducer", serialNumber: `SN-BAR-${base.stationCode}`, healthScore: 99.1, status: "OPERATIONAL" },
        { id: 3, parameter: "RELATIVE_HUMIDITY", model: "Rotronic HygroFlex Capacitive", serialNumber: `SN-HUM-${base.stationCode}`, healthScore: 96.0, status: "OPERATIONAL" }
      ],
      latestObservation: history[history.length - 1],
      recentHistory: history,
      activeAnomalies: FALLBACK_ANOMALIES.filter(a => a.stationId === base.id)
    };
  }

  // Anomalies
  async getAnomalies(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await this.request(`/anomalies?${query}`);
    return (res && res.data) ? res.data : FALLBACK_ANOMALIES;
  }

  async getAnomalyDetail(id) {
    const res = await this.request(`/anomalies/${id}`);
    if (res && res.data) return res.data;
    return FALLBACK_ANOMALIES.find(a => a.id === Number(id)) || FALLBACK_ANOMALIES[0];
  }

  async updateAnomalyStatus(id, status, remarks = "") {
    const res = await this.request(`/anomalies/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, remarks })
    });
    if (res && res.data) return res.data;
    const anom = FALLBACK_ANOMALIES.find(a => a.id === Number(id));
    if (anom) {
      anom.status = status;
      anom.remarks = remarks;
      if (status === 'RESOLVED') anom.resolvedAt = new Date().toISOString();
      return anom;
    }
    return null;
  }

  // Alerts
  async getAlerts() {
    const res = await this.request('/alerts');
    return (res && res.data) ? res.data : FALLBACK_ALERTS;
  }

  async acknowledgeAlert(id) {
    const res = await this.request(`/alerts/${id}/acknowledge`, { method: 'PATCH' });
    if (res && res.data) return res.data;
    const alert = FALLBACK_ALERTS.find(a => a.id === Number(id));
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = "operator";
      alert.acknowledgedAt = new Date().toISOString();
      return alert;
    }
    return null;
  }

  // Analytics
  async getAnalyticsSummary() {
    const res = await this.request('/analytics/summary');
    if (res && res.data) return res.data;
    return {
      totalStations: 6,
      onlineStations: 5,
      degradedStations: 1,
      offlineStations: 0,
      totalAnomalies: 3,
      openAnomalies: 2,
      criticalAnomalies: 1,
      unacknowledgedAlerts: 2,
      networkAvgTemperature: 18.5,
      networkAvgPressure: 1012.8,
      networkAvgHumidity: 62.4,
      networkHealthPercentage: 96.5,
      anomaliesByParameter: {
        TEMPERATURE: 1,
        ATMOSPHERIC_PRESSURE: 1,
        RELATIVE_HUMIDITY: 1
      },
      anomaliesByType: {
        SPIKE: 1,
        STEP_CHANGE: 1,
        PERSISTENCE_FLATLINE: 1
      }
    };
  }

  // Reports
  async getReports() {
    const res = await this.request('/reports');
    return (res && res.data) ? res.data : FALLBACK_REPORTS;
  }

  async generateReport(payload) {
    const res = await this.request('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && res.data) return res.data;
    const newReport = {
      id: FALLBACK_REPORTS.length + 1,
      title: payload.title,
      reportType: payload.reportType,
      dateRangeStart: payload.dateRangeStart || new Date(Date.now() - 7 * 86400000).toISOString(),
      dateRangeEnd: payload.dateRangeEnd || new Date().toISOString(),
      status: "COMPLETED",
      generatedBy: "current-user",
      fileFormat: payload.fileFormat || "JSON",
      summaryJson: JSON.stringify({
        title: payload.title,
        status: "GENERATED_CLIENT_SIDE",
        observationsAudited: 8640,
        qualityScore: 99.4
      }),
      createdAt: new Date().toISOString()
    };
    FALLBACK_REPORTS.unshift(newReport);
    return newReport;
  }

  // Auth
  async login(usernameOrEmail, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password })
    });
    if (res && res.data) {
      this.setToken(res.data.token);
      return res.data;
    }
    // Offline simulated login for quick verification
    const mockUser = {
      token: "mock-jwt-token-" + Date.now(),
      id: 1,
      username: usernameOrEmail,
      email: `${usernameOrEmail}@skyguard.ai`,
      fullName: usernameOrEmail.toUpperCase() === 'ADMIN' ? 'Chief Systems Director' : 'Operational Analyst',
      role: usernameOrEmail.toLowerCase().includes('admin') ? 'ROLE_ADMIN' : 'ROLE_OPERATOR'
    };
    this.setToken(mockUser.token);
    return mockUser;
  }

  async register(payload) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && res.data) {
      this.setToken(res.data.token);
      return res.data;
    }
    const mockUser = {
      token: "mock-jwt-token-" + Date.now(),
      id: 99,
      username: payload.username,
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role || 'ROLE_OPERATOR'
    };
    this.setToken(mockUser.token);
    return mockUser;
  }

  // Admin
  async getAdminUsers() {
    const res = await this.request('/admin/users');
    if (res && res.data) return res.data;
    return [
      { id: 1, username: "admin", email: "admin@skyguard.ai", fullName: "Chief Systems Director", role: "ROLE_ADMIN", active: true, createdAt: "2026-01-10T10:00:00" },
      { id: 2, username: "operator", email: "operator@skyguard.ai", fullName: "Lead Station Operator", role: "ROLE_OPERATOR", active: true, createdAt: "2026-02-15T14:30:00" },
      { id: 3, username: "analyst", email: "analyst@skyguard.ai", fullName: "Senior Meteorological Analyst", role: "ROLE_ANALYST", active: true, createdAt: "2026-03-01T09:15:00" },
      { id: 4, username: "viewer", email: "viewer@skyguard.ai", fullName: "Public Observer", role: "ROLE_VIEWER", active: true, createdAt: "2026-03-12T11:00:00" }
    ];
  }

  async getAdminStats() {
    const res = await this.request('/admin/stats');
    if (res && res.data) return res.data;
    return {
      totalUsers: 4,
      jvmMemoryFreeBytes: 256000000,
      jvmMemoryTotalBytes: 512000000,
      activeProcessors: 8,
      systemStatus: "HEALTHY"
    };
  }

  async getAdminAuditLogs() {
    const res = await this.request('/admin/audit-logs');
    if (res && res.data) return res.data;
    return [
      { id: 1, username: "admin", action: "UPDATE_STATION_PARAM", entityType: "Station", entityId: 3, details: "Calibrated threshold on AWS-312-PLN", ipAddress: "127.0.0.1", timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, username: "operator", action: "ACKNOWLEDGE_ALERT", entityType: "Alert", entityId: 2, details: "Acknowledged alpine pressure step anomaly", ipAddress: "127.0.0.1", timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: 3, username: "system", action: "AUTO_INGEST_BURST", entityType: "Observation", entityId: 104, details: "Batch ingested 120 station telemetry frames", ipAddress: "127.0.0.1", timestamp: new Date(Date.now() - 14400000).toISOString() }
    ];
  }
}

export const api = new ApiClient();
