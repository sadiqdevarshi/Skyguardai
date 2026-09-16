# AERISENCE 2.0 — Precision Atmospheric Telemetry & Anomaly Intelligence

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Backend](https://img.shields.io/badge/Backend-Java%2017%2F21%20%7C%20Spring%20Boot%203.3.4-emerald)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS%20%7C%20Tailwind%20%7C%20Three.js-cyan)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2F%20H2-blue)

**Aerisence** is an operational meteorological intelligence platform designed for Automatic Weather Station (AWS) networks. It provides autonomous quality control, real-time telemetry verification, and physical anomaly classification across terrestrial sensor deployments.

---

## 🌟 Key Platform Features

- **Multi-Page Production Architecture**: 17+ dedicated routes spanning public storytelling, technical deep dives, operational mission control, incident management, real-time 3D spatial stream, and administrative governance.
- **Physical Atmospheric Verification**:
  - **Deterministic Bounds Filter**: Enforces WMO-compliant physical limits on Temperature (`-50°C to +60°C`), Pressure (`870 to 1085 hPa`), and Humidity (`0% to 100%`).
  - **Rate-of-Change Δ-Filter**: Detects instantaneous spikes and unnatural step discontinuities exceeding maximum thermodynamic velocities.
  - **Zero-Variance Persistence Audit**: Flags frozen sensors, ADC locks, and saturated hygrometer plates.
- **Atmospheric 3D Visualizations**: Three.js Earth atmosphere globe, real-time 3D sensor network mesh with telemetry packets, and data ingestion pipeline visualizer.
- **Investigation Workbench**: Deep analytical anomaly views comparing observed transducer values against diurnal baselines with 95% confidence bands and root-cause meteorological hypotheses.
- **Security & RBAC**: Spring Security + Stateless JWT authentication with `ADMIN`, `OPERATOR`, `ANALYST`, and `VIEWER` roles.
- **Zero TypeScript**: Built with pure modern JavaScript (ES Modules), HTML5, Tailwind CSS, and Chart.js.

---

## 📂 Repository Structure

```text
Aerisence/
│
├── Frontend/             # Vanilla JS + Tailwind CSS + Three.js + Vite build tooling
│   ├── src/
│   │   ├── components/   # Navbar, Footer, Sidebar, Toast, Modal
│   │   ├── scenes/       # Three.js 3D Viewports (Globe, SensorMesh, Pipeline)
│   │   ├── services/     # REST Client, Auth State Manager, Chart.js Visualizers
│   │   ├── styles/       # Atmospheric design system tokens
│   │   ├── views/        # 17 Independent Multi-Page Views
│   │   ├── router.js     # Client-side routing engine
│   │   └── main.js       # App entrypoint
│   ├── package.json
│   └── vite.config.js
│
├── Backend/              # Java + Spring Boot 3.3.4 + Spring Security + JPA
│   ├── src/main/java/com/aerisence/
│   │   ├── config/       # SecurityConfig, CorsConfig, DataInitializer
│   │   ├── controller/   # REST Controllers (Auth, Stations, Observations, Anomalies, etc.)
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── entity/       # JPA Entities (Station, Sensor, Observation, Anomaly, Alert, etc.)
│   │   ├── repository/   # Spring Data JPA Repositories
│   │   ├── security/     # JWT Token Provider, Auth Filters, UserDetailsService
│   │   └── service/      # Anomaly Detection Engine & Business Logic
│   └── pom.xml
│
├── Docs/                 # Technical Specifications & Schema Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   └── SETUP.md
│
├── .env.example          # Environment variables template
├── .gitignore            # Clean multi-tier ignore rules
├── LICENSE               # MIT License
└── README.md             # This document
```

---

## 🚀 Quickstart

### 1. Launch Spring Boot Backend
```bash
cd Backend
.\mvnw.ps1 spring-boot:run   # Windows PowerShell
# or ./mvnw spring-boot:run  # Linux/macOS
```
Backend starts on `http://localhost:8080` with auto-seeded fixtures.

### 2. Launch Vite Frontend
```bash
cd Frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 🔐 Default Test Credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `Admin@Aerisence2026!` |
| Operator | `operator` | `Operator@Aerisence2026!` |
| Analyst | `analyst` | `Analyst@Aerisence2026!` |
| Viewer | `viewer` | `Viewer@Aerisence2026!` |

---

## 📄 License
Open source under the [MIT License](LICENSE). Copyright © 2026 Aerisence Systems Inc.
