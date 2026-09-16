# Aerisence 2.0 — System Architecture & Engineering Specification

## 1. Overview
Aerisence is a mission-critical meteorological verification and real-time anomaly intelligence platform designed for Automatic Weather Station (AWS) networks. The system enforces World Meteorological Organization (WMO-No. 8) guidelines across physical terrestrial domains.

```
       +-------------------------------+
       | Remote AWS Station / RTU Unit |
       +-------------------------------+
                       |
               (HTTP Ingestion)
                       v
       +-------------------------------+
       |   Spring Boot REST Gateway    |
       +-------------------------------+
                       |
                       v
       +-------------------------------+
       |   Deterministic Bounds &      |
       |  Temporal Step Rate Checking  |
       +-------------------------------+
                       |
                       v
       +-------------------------------+
       | Zero-Variance & Persistence   |
       |       Flatline Engine         |
       +-------------------------------+
           /           |           \
          v            v            v
     (Database)     (Alerts)    (REST API)
          |                         |
          v                         v
     PostgreSQL / H2           Vite / JS UI
```

---

## 2. Monitored Atmospheric Parameters

1. **Temperature (°C)**:
   - Kinetic thermodynamic air temperature measured inside ventilated solar radiation shields.
   - Physical Terrestrial Bounds: `[-50.0°C, 60.0°C]`.
   - Max Allowable Step Rate: `10.0°C` per sampling window.

2. **Atmospheric Pressure (hPa)**:
   - Barometric hydrostatic mass pressure calibrated to station Mean Sea Level (MSL).
   - Physical Terrestrial Bounds: `[870.0 hPa, 1085.0 hPa]`.
   - Max Allowable Step Rate: `15.0 hPa` per sampling window.

3. **Relative Humidity (%)**:
   - Psychrometric water vapor saturation ratio.
   - Physical Bounds: `[0.0%, 100.0%]`.
   - Max Allowable Step Rate: `30.0%` per sampling window.

---

## 3. Anomaly Detection Classification

- **`OUT_OF_BOUNDS` (Critical)**: Transducer observation breached physical meteorological boundaries.
- **`SPIKE` (Warning / Critical)**: Unrealistic step jump exceeding maximum thermodynamic velocity.
- **`PERSISTENCE_FLATLINE` (Warning)**: Sensor reporting identical floating-point values across consecutive sample intervals indicating ADC freeze or mechanical sensor lock.
- **`STEP_CHANGE` (Warning)**: Sudden persistent baseline displacement indicative of static port blockage or calibration drift.
