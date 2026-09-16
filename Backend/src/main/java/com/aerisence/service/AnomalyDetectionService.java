package com.aerisence.service;

import com.aerisence.entity.*;
import com.aerisence.repository.AnomalyRepository;
import com.aerisence.repository.WeatherObservationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AnomalyDetectionService {

    private static final Logger logger = LoggerFactory.getLogger(AnomalyDetectionService.class);

    @Autowired
    private AnomalyRepository anomalyRepository;

    @Autowired
    private WeatherObservationRepository observationRepository;

    @Autowired
    private AlertService alertService;

    @Value("${aerisence.thresholds.temperature.min:-50.0}")
    private double tempMin;

    @Value("${aerisence.thresholds.temperature.max:60.0}")
    private double tempMax;

    @Value("${aerisence.thresholds.temperature.max-delta-per-step:10.0}")
    private double tempMaxDelta;

    @Value("${aerisence.thresholds.pressure.min:870.0}")
    private double pressureMin;

    @Value("${aerisence.thresholds.pressure.max:1085.0}")
    private double pressureMax;

    @Value("${aerisence.thresholds.pressure.max-delta-per-step:15.0}")
    private double pressureMaxDelta;

    @Value("${aerisence.thresholds.humidity.min:0.0}")
    private double humidityMin;

    @Value("${aerisence.thresholds.humidity.max:100.0}")
    private double humidityMax;

    @Value("${aerisence.thresholds.humidity.max-delta-per-step:30.0}")
    private double humidityMaxDelta;

    @Value("${aerisence.thresholds.persistence-steps:5}")
    private int persistenceThreshold;

    @Transactional
    public List<Anomaly> inspectObservation(WeatherObservation currentObs, WeatherStation station) {
        List<Anomaly> detectedAnomalies = new ArrayList<>();
        
        // Fetch previous observations for temporal delta and persistence checks
        List<WeatherObservation> previousObsList = observationRepository.findByWeatherStationIdOrderByTimestampDesc(
                station.getId(), PageRequest.of(0, persistenceThreshold + 1));

        WeatherObservation prevObs = (previousObsList.size() > 1) ? previousObsList.get(1) : null;

        // 1. Check Temperature
        checkTemperature(currentObs, prevObs, previousObsList, station).ifPresent(detectedAnomalies::add);

        // 2. Check Pressure
        checkPressure(currentObs, prevObs, previousObsList, station).ifPresent(detectedAnomalies::add);

        // 3. Check Humidity
        checkHumidity(currentObs, prevObs, previousObsList, station).ifPresent(detectedAnomalies::add);

        // Update observation Quality Flag based on detection
        if (!detectedAnomalies.isEmpty()) {
            boolean hasCritical = detectedAnomalies.stream().anyMatch(a -> a.getSeverity() == AnomalySeverity.CRITICAL);
            currentObs.setQualityFlag(hasCritical ? QualityFlag.ANOMALOUS : QualityFlag.SUSPICIOUS);
            
            // Create alerts for detected anomalies
            for (Anomaly anomaly : detectedAnomalies) {
                alertService.createAlertForAnomaly(anomaly);
            }
        }

        return detectedAnomalies;
    }

    private Optional<Anomaly> checkTemperature(WeatherObservation current, WeatherObservation prev, List<WeatherObservation> history, WeatherStation station) {
        double val = current.getTemperature();

        // Physical plausibility limit check
        if (val < tempMin || val > tempMax) {
            Anomaly anomaly = new Anomaly(
                    station, current, SensorParameter.TEMPERATURE,
                    AnomalyType.OUT_OF_BOUNDS, AnomalySeverity.CRITICAL, val,
                    (tempMin + tempMax) / 2.0, 99.2,
                    "Temperature value (" + val + "°C) breached physical meteorological bounds [" + tempMin + "°C, " + tempMax + "°C].",
                    "Immediate sensor transducer inspection and calibration required."
            );
            return Optional.of(anomalyRepository.save(anomaly));
        }

        // Rate of change / Step spike check
        if (prev != null) {
            double delta = Math.abs(val - prev.getTemperature());
            if (delta > tempMaxDelta) {
                Anomaly anomaly = new Anomaly(
                        station, current, SensorParameter.TEMPERATURE,
                        AnomalyType.SPIKE, AnomalySeverity.WARNING, val,
                        prev.getTemperature(), 94.5,
                        "Unrealistic temperature shift (Δ=" + String.format("%.2f", delta) + "°C) within single sampling interval exceeds physical rate threshold (" + tempMaxDelta + "°C).",
                        "Verify thermistor signal connection and check for electrical interference or sun-shield displacement."
                );
                return Optional.of(anomalyRepository.save(anomaly));
            }
        }

        // Persistence / Flatline check
        if (history.size() >= persistenceThreshold) {
            boolean flatline = history.stream().allMatch(o -> Math.abs(o.getTemperature() - val) < 0.001);
            if (flatline) {
                Anomaly anomaly = new Anomaly(
                        station, current, SensorParameter.TEMPERATURE,
                        AnomalyType.PERSISTENCE_FLATLINE, AnomalySeverity.WARNING, val,
                        val, 91.0,
                        "Sensor persistence: Temperature reading identical (" + val + "°C) across " + persistenceThreshold + " consecutive intervals. Possible sensor lock or ADC freeze.",
                        "Perform automated sensor power-cycle or remote firmware reset."
                );
                return Optional.of(anomalyRepository.save(anomaly));
            }
        }

        return Optional.empty();
    }

    private Optional<Anomaly> checkPressure(WeatherObservation current, WeatherObservation prev, List<WeatherObservation> history, WeatherStation station) {
        double val = current.getAtmosphericPressure();

        // Plausibility limit check
        if (val < pressureMin || val > pressureMax) {
            Anomaly anomaly = new Anomaly(
                    station, current, SensorParameter.ATMOSPHERIC_PRESSURE,
                    AnomalyType.OUT_OF_BOUNDS, AnomalySeverity.CRITICAL, val,
                    1013.25, 98.8,
                    "Barometric pressure (" + val + " hPa) outside valid terrestrial atmospheric limits [" + pressureMin + " - " + pressureMax + " hPa].",
                    "Inspect barometer membrane, venting port, and moisture ingress."
            );
            return Optional.of(anomalyRepository.save(anomaly));
        }

        // Step change check
        if (prev != null) {
            double delta = Math.abs(val - prev.getAtmosphericPressure());
            if (delta > pressureMaxDelta) {
                Anomaly anomaly = new Anomaly(
                        station, current, SensorParameter.ATMOSPHERIC_PRESSURE,
                        AnomalyType.STEP_CHANGE, AnomalySeverity.WARNING, val,
                        prev.getAtmosphericPressure(), 93.0,
                        "Rapid barometric step change of " + String.format("%.2f", delta) + " hPa detected without typical squall signature.",
                        "Cross-reference with adjacent regional stations to rule out localized microburst or pressure sensor defect."
                );
                return Optional.of(anomalyRepository.save(anomaly));
            }
        }

        return Optional.empty();
    }

    private Optional<Anomaly> checkHumidity(WeatherObservation current, WeatherObservation prev, List<WeatherObservation> history, WeatherStation station) {
        double val = current.getRelativeHumidity();

        if (val < humidityMin || val > humidityMax) {
            Anomaly anomaly = new Anomaly(
                    station, current, SensorParameter.RELATIVE_HUMIDITY,
                    AnomalyType.OUT_OF_BOUNDS, AnomalySeverity.CRITICAL, val,
                    50.0, 99.5,
                    "Relative humidity reading (" + val + "%) outside valid physical domain [0% - 100%].",
                    "Replace hygrometer capacitive element or clean protective mesh filter."
            );
            return Optional.of(anomalyRepository.save(anomaly));
        }

        if (prev != null) {
            double delta = Math.abs(val - prev.getRelativeHumidity());
            if (delta > humidityMaxDelta) {
                Anomaly anomaly = new Anomaly(
                        station, current, SensorParameter.RELATIVE_HUMIDITY,
                        AnomalyType.SPIKE, AnomalySeverity.WARNING, val,
                        prev.getRelativeHumidity(), 92.4,
                        "Abrupt humidity jump of " + String.format("%.1f", delta) + "% within single sample step.",
                        "Inspect for condensation pooling on hygrometer capacitive sensor."
                );
                return Optional.of(anomalyRepository.save(anomaly));
            }
        }

        return Optional.empty();
    }
}
