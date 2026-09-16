# Aerisence 2.0 — Local Development & Setup Guide

## Prerequisites
- Java 17 / 21+ JDK
- Node.js 18+ & npm

---

## 1. Backend Setup (Spring Boot)

```bash
cd Backend

# On Windows PowerShell
.\mvnw.ps1 spring-boot:run

# On Linux / macOS
./mvnw spring-boot:run
```

The Spring Boot backend will start on `http://localhost:8080`.
The in-memory H2 database will automatically initialize with 6 weather stations, 18 sensors, 24h historical telemetry, and flagged anomaly fixtures.

- Swagger / API Root: `http://localhost:8080/api`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:aerisencedb`, User: `sa`, Password: empty)

---

## 2. Frontend Setup (Vite + Tailwind + Three.js)

```bash
cd Frontend

# Install dependencies (if not done)
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

The Vite dev server will run on `http://localhost:5173`.
Navigate to `http://localhost:5173` in your browser.

---

## 3. Seed Credentials for Testing

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `Admin@Aerisence2026!` |
| Operator | `operator` | `Operator@Aerisence2026!` |
| Analyst | `analyst` | `Analyst@Aerisence2026!` |
| Viewer | `viewer` | `Viewer@Aerisence2026!` |
