package com.aerisence.config;

import com.aerisence.entity.*;
import com.aerisence.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeatherStationRepository stationRepository;

    @Autowired
    private SensorRepository sensorRepository;

    @Autowired
    private WeatherObservationRepository observationRepository;

    @Autowired
    private AnomalyRepository anomalyRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded. Skipping initial fixture loading.");
            return;
        }

        logger.info("Initializing Aerisence meteorological test fixtures and security credentials...");

        // 1. Seed Users
        User admin = new User("admin", "admin@aerisence.io", passwordEncoder.encode("Admin@Aerisence2026!"), "Chief Systems Director", Role.ROLE_ADMIN);
        User operator = new User("operator", "operator@aerisence.io", passwordEncoder.encode("Operator@Aerisence2026!"), "Lead Station Operator", Role.ROLE_OPERATOR);
        User analyst = new User("analyst", "analyst@aerisence.io", passwordEncoder.encode("Analyst@Aerisence2026!"), "Senior Meteorological Analyst", Role.ROLE_ANALYST);
        User viewer = new User("viewer", "viewer@aerisence.io", passwordEncoder.encode("Viewer@Aerisence2026!"), "Public Observer", Role.ROLE_VIEWER);

        userRepository.saveAll(Arrays.asList(admin, operator, analyst, viewer));

        // 2. Seed Weather Stations
        WeatherStation st1 = new WeatherStation("AWS-101-ALP", "Alpine Ridge High Summit", "European Alps", 45.8326, 6.8652, 2450.0, "High-altitude permafrost and glacial boundary monitoring station with heated ultrasonic anemometer.");
        st1.setBatteryLevel(94.2);
        st1.setStatus(StationStatus.ONLINE);

        WeatherStation st2 = new WeatherStation("AWS-204-CST", "Pacific Maritime Pier Observatory", "Pacific Coastline", 36.6002, -121.8947, 12.0, "Coastal marine boundary layer station measuring sea-spray humidity and barometric marine surges.");
        st2.setBatteryLevel(98.8);
        st2.setStatus(StationStatus.ONLINE);

        WeatherStation st3 = new WeatherStation("AWS-312-PLN", "Midwest Agro-Meteorological Hub", "Central Plains", 41.8781, -93.0977, 230.0, "Agricultural microclimate array assessing soil-air boundary temperature fluctuations.");
        st3.setBatteryLevel(88.5);
        st3.setStatus(StationStatus.DEGRADED); // Has sensor issue

        WeatherStation st4 = new WeatherStation("AWS-408-DSN", "Mojave Desert Biosphere Array", "Southwest Basin", 35.0110, -115.4734, 640.0, "Extreme thermal diurnal oscillation monitoring in arid low-humidity desert terrain.");
        st4.setBatteryLevel(99.1);
        st4.setStatus(StationStatus.ONLINE);

        WeatherStation st5 = new WeatherStation("AWS-515-FRT", "Boreal Forest Eco-Observatory", "Northern Taiga", 53.5461, -113.4938, 670.0, "Canopy humidity gradient and cold-front pressure propagation research.");
        st5.setBatteryLevel(91.0);
        st5.setStatus(StationStatus.ONLINE);

        WeatherStation st6 = new WeatherStation("AWS-620-MET", "Metro Core Atmospheric Mast", "Metropolitan Center", 40.7128, -74.0060, 110.0, "Urban heat island quantification and convective pressure drop analysis.");
        st6.setBatteryLevel(100.0);
        st6.setStatus(StationStatus.ONLINE);

        List<WeatherStation> stations = stationRepository.saveAll(Arrays.asList(st1, st2, st3, st4, st5, st6));

        // 3. Seed Sensors
        for (WeatherStation st : stations) {
            Sensor sTemp = new Sensor(st, SensorParameter.TEMPERATURE, "Vaisala PT100 Platinum RTD", "SN-TMP-" + st.getStationCode().substring(4), 98.5);
            Sensor sPres = new Sensor(st, SensorParameter.ATMOSPHERIC_PRESSURE, "Setra 278 Barometric Transducer", "SN-BAR-" + st.getStationCode().substring(4), 99.1);
            Sensor sHum = new Sensor(st, SensorParameter.RELATIVE_HUMIDITY, "Rotronic HygroFlex Capacitive", "SN-HUM-" + st.getStationCode().substring(4), 96.0);

            if (st.getStationCode().equals("AWS-312-PLN")) {
                sTemp.setHealthScore(62.0);
                sTemp.setStatus("DEGRADED_SIGNAL");
            }

            sensorRepository.saveAll(Arrays.asList(sTemp, sPres, sHum));
        }

        // 4. Seed Historical Observations (past 24 hours in 30-min intervals)
        LocalDateTime now = LocalDateTime.now();
        List<WeatherObservation> allObs = new ArrayList<>();

        for (WeatherStation st : stations) {
            double baseTemp = st.getElevationMeters() > 1500 ? -2.0 : (st.getElevationMeters() < 100 ? 21.0 : 16.0);
            double basePres = 1013.25 - (st.getElevationMeters() * 0.12);
            double baseHum = st.getRegion().contains("Coast") ? 82.0 : (st.getRegion().contains("Desert") ? 18.0 : 58.0);

            for (int i = 48; i >= 0; i--) {
                LocalDateTime time = now.minusMinutes(i * 30L);
                double hourOfDay = time.getHour() + (time.getMinute() / 60.0);

                // Diurnal solar curve
                double tempVariation = Math.sin((hourOfDay - 9.0) * Math.PI / 12.0) * 6.5;
                double currentTemp = Math.round((baseTemp + tempVariation + (Math.random() * 0.4 - 0.2)) * 10.0) / 10.0;
                double currentPres = Math.round((basePres + Math.cos((hourOfDay) * Math.PI / 12.0) * 1.8 + (Math.random() * 0.2 - 0.1)) * 10.0) / 10.0;
                double currentHum = Math.round(Math.max(5.0, Math.min(99.0, baseHum - (tempVariation * 2.2) + (Math.random() * 1.5 - 0.75))) * 10.0) / 10.0;

                QualityFlag flag = QualityFlag.VALID;

                // Plant specific realistic anomaly injection for demonstration
                if (st.getStationCode().equals("AWS-312-PLN") && i == 4) {
                    currentTemp = 48.6; // Unrealistic Spike
                    flag = QualityFlag.ANOMALOUS;
                } else if (st.getStationCode().equals("AWS-101-ALP") && i == 1) {
                    currentPres = 710.2; // Sudden step drop
                    flag = QualityFlag.SUSPICIOUS;
                }

                WeatherObservation obs = new WeatherObservation(st, time, currentTemp, currentPres, currentHum, flag);
                allObs.add(obs);
            }
        }

        observationRepository.saveAll(allObs);

        // 5. Seed Real Anomalies with Root Cause Diagnostics
        WeatherObservation anomObs1 = allObs.stream()
                .filter(o -> o.getWeatherStation().getStationCode().equals("AWS-312-PLN") && o.getQualityFlag() == QualityFlag.ANOMALOUS)
                .findFirst().orElse(null);

        Anomaly anom1 = new Anomaly(
                st3, anomObs1, SensorParameter.TEMPERATURE,
                AnomalyType.SPIKE, AnomalySeverity.CRITICAL,
                48.6, 17.4, 98.9,
                "Sudden instantaneous thermal spike (+31.2°C delta) detected on RTD sensor channel 1 without corresponding barometric disturbance.",
                "Verify ground shield wiring, inspect junction box for rodent damage, and run remote calibration sequence."
        );
        anom1.setStatus(AnomalyStatus.OPEN);
        anom1.setDetectedAt(now.minusMinutes(120));

        WeatherObservation anomObs2 = allObs.stream()
                .filter(o -> o.getWeatherStation().getStationCode().equals("AWS-101-ALP") && o.getQualityFlag() == QualityFlag.SUSPICIOUS)
                .findFirst().orElse(null);

        Anomaly anom2 = new Anomaly(
                st1, anomObs2, SensorParameter.ATMOSPHERIC_PRESSURE,
                AnomalyType.STEP_CHANGE, AnomalySeverity.WARNING,
                710.2, 748.5, 94.2,
                "Abrupt barometric step change of -38.3 hPa in sub-zero summit conditions.",
                "Inspect pressure intake venting tube for riming/ice accretion blocking static port."
        );
        anom2.setStatus(AnomalyStatus.ACKNOWLEDGED);
        anom2.setAcknowledgedAt(now.minusMinutes(45));
        anom2.setRemarks("Investigating alpine de-icing heating circuit telemetry.");

        Anomaly anom3 = new Anomaly(
                st2, null, SensorParameter.RELATIVE_HUMIDITY,
                AnomalyType.PERSISTENCE_FLATLINE, AnomalySeverity.WARNING,
                100.0, 84.0, 92.0,
                "Capacitive hygrometer locked at 100.0% saturation for >6 consecutive hours following heavy coastal sea fog.",
                "Clean sensor sintering filter and verify heating pulse to evaporate condensed salt residue."
        );
        anom3.setStatus(AnomalyStatus.OPEN);
        anom3.setDetectedAt(now.minusMinutes(360));

        anomalyRepository.saveAll(Arrays.asList(anom1, anom2, anom3));

        // 6. Seed Alerts
        Alert al1 = new Alert(anom1, st3, "CRITICAL: Severe Temperature Spike on AWS-312-PLN", "Sensor reading +48.6°C exceeds rate-of-change safety envelope.", AnomalySeverity.CRITICAL);
        Alert al2 = new Alert(anom2, st1, "WARNING: Alpine Pressure Step Drop on AWS-101-ALP", "Barometric pressure shifted -38.3 hPa. Possible static port freeze.", AnomalySeverity.WARNING);
        al2.setAcknowledged(true);
        al2.setAcknowledgedBy("operator");
        al2.setAcknowledgedAt(now.minusMinutes(45));

        Alert al3 = new Alert(anom3, st2, "WARNING: Hygrometer Saturation Lock on AWS-204-CST", "Persistence flatline at 100.0% relative humidity detected.", AnomalySeverity.WARNING);

        alertRepository.saveAll(Arrays.asList(al1, al2, al3));

        // 7. Seed Sample Reports
        Report r1 = new Report(
                "Weekly Network Quality & Sensor Health Audit",
                "NETWORK_HEALTH",
                now.minusDays(7),
                now,
                "analyst",
                "JSON",
                "{\"reportTitle\": \"Weekly Network Quality Audit\", \"totalStations\": 6, \"activeSensors\": 18, \"observationsIngested\": 40320, \"validObservationsRatio\": 0.992, \"anomaliesFlagged\": 3, \"recommendations\": \"Schedule on-site filter clean for AWS-204-CST and inspect RTD wiring on AWS-312-PLN.\"}"
        );

        Report r2 = new Report(
                "Alpine Summit Microclimate Diurnal Analysis",
                "METEOROLOGICAL_TREND",
                now.minusDays(3),
                now,
                "analyst",
                "JSON",
                "{\"stationCode\": \"AWS-101-ALP\", \"meanTemp\": -2.4, \"minTemp\": -8.1, \"maxTemp\": 3.2, \"pressureStabilityIndex\": 0.94, \"frostRiskLevel\": \"HIGH\"}"
        );

        reportRepository.saveAll(Arrays.asList(r1, r2));

        // 8. Seed Audit Log
        AuditLog log1 = new AuditLog("system", "FIXTURE_SEED", "System", 0L, "Initial meteorological stations and sensor arrays populated", "127.0.0.1");
        AuditLog log2 = new AuditLog("operator", "ACKNOWLEDGE_ALERT", "Alert", al2.getId(), "Acknowledged alpine barometric pressure anomaly", "127.0.0.1");
        auditLogRepository.saveAll(Arrays.asList(log1, log2));

        logger.info("Aerisence backend fixtures initialized successfully with 6 stations, 18 sensors, historical telemetry, and 3 anomalies.");
    }
}
