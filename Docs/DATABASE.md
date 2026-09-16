# Aerisence 2.0 — Database Schema & Entity Relationships

The Aerisence relational schema supports PostgreSQL (Production) and H2 in-memory (Development).

## Entity Relationship Summary

```
+--------------------+            1:N            +---------------------+
|   WeatherStation   | ------------------------< |       Sensor        |
+--------------------+                           +---------------------+
          |
          | 1:N
          v
+--------------------+            1:N            +---------------------+
| WeatherObservation | ------------------------< |       Anomaly       |
+--------------------+                           +---------------------+
                                                            |
                                                            | 1:N
                                                            v
                                                 +---------------------+
                                                 |        Alert        |
                                                 +---------------------+
```

---

## Tables Overview

1. **`users`**: User identity, hashed BCrypt password, assigned role (`ROLE_ADMIN`, `ROLE_OPERATOR`, `ROLE_ANALYST`, `ROLE_VIEWER`), activity status.
2. **`weather_stations`**: Station code, name, geographic region, coordinates (Lat/Long/Elev MSL), battery percentage, status (`ONLINE`, `DEGRADED`, `OFFLINE`).
3. **`sensors`**: Station foreign key, parameter (`TEMPERATURE`, `ATMOSPHERIC_PRESSURE`, `RELATIVE_HUMIDITY`), hardware model, serial number, health score (0-100), calibration date.
4. **`weather_observations`**: Station foreign key, timestamp (indexed), temperature, pressure, humidity, quality flag (`VALID`, `SUSPICIOUS`, `ANOMALOUS`).
5. **`anomalies`**: Station and observation foreign keys, parameter, anomaly type (`SPIKE`, `STEP_CHANGE`, `PERSISTENCE_FLATLINE`, `OUT_OF_BOUNDS`), severity (`CRITICAL`, `WARNING`, `INFO`), observed vs expected baseline, confidence score, root cause diagnosis.
6. **`alerts`**: Anomaly and station mapping, title, message, acknowledgement status and timestamp.
7. **`reports`**: Title, report type, date range, generated summary payload, format.
8. **`audit_logs`**: Immutable security and administrative action log.
