# Aerisence 2.0 — REST API Specification

Base URL: `http://localhost:8080/api`

## Authentication Header
```http
Authorization: Bearer <jwt-token>
```

---

## 1. Authentication Endpoints

### Register Account
`POST /api/auth/register`
```json
{
  "username": "jmitchell_ops",
  "email": "jmitchell@observatory.org",
  "password": "SecurePassword123!",
  "fullName": "Dr. Jane Mitchell",
  "role": "ROLE_OPERATOR"
}
```

### Login Session
`POST /api/auth/login`
```json
{
  "usernameOrEmail": "operator",
  "password": "Operator@Aerisence2026!"
}
```

---

## 2. Weather Stations

- `GET /api/stations` — List all deployed AWS nodes with latest telemetry & status.
- `GET /api/stations/{id}` — Get station metadata, installed sensor array, 24h observation series, active anomalies.
- `POST /api/stations` — (Operator/Admin) Register a new AWS station node.
- `PUT /api/stations/{id}` — (Operator/Admin) Update station attributes or status.
- `DELETE /api/stations/{id}` — (Admin) Decommission station.

---

## 3. Observation Ingestion

### Ingest Telemetry Frame
`POST /api/observations/ingest`
```json
{
  "stationCode": "AWS-101-ALP",
  "temperature": -2.4,
  "atmosphericPressure": 752.1,
  "relativeHumidity": 78.5,
  "batteryLevel": 94.2
}
```

---

## 4. Anomalies & Incident Workbench

- `GET /api/anomalies` — Query anomalies by `stationId`, `severity`, `status`, `parameter`.
- `GET /api/anomalies/{id}` — Deep investigation metrics (observed vs expected baseline, confidence, diagnostic hypothesis).
- `PATCH /api/anomalies/{id}/status` — Update anomaly status (`ACKNOWLEDGED`, `INVESTIGATING`, `RESOLVED`) with remarks.

---

## 5. Alerts, Analytics & Reports

- `GET /api/alerts` — Recent alert feed.
- `PATCH /api/alerts/{id}/acknowledge` — Acknowledge alert.
- `GET /api/analytics/summary` — Network health score, parameter distribution histograms, online station ratios.
- `POST /api/reports/generate` — Generate automated audit report.
- `GET /api/reports/{id}/export` — Download machine-readable JSON dataset.
