package com.aerisence.service;

import com.aerisence.dto.AnomalyDto;
import com.aerisence.dto.ObservationDto;
import com.aerisence.dto.SensorDto;
import com.aerisence.dto.StationDetailDto;
import com.aerisence.dto.StationSummaryDto;
import com.aerisence.entity.*;
import com.aerisence.exception.ResourceNotFoundException;
import com.aerisence.repository.AnomalyRepository;
import com.aerisence.repository.SensorRepository;
import com.aerisence.repository.WeatherObservationRepository;
import com.aerisence.repository.WeatherStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StationService {

    @Autowired
    private WeatherStationRepository stationRepository;

    @Autowired
    private WeatherObservationRepository observationRepository;

    @Autowired
    private SensorRepository sensorRepository;

    @Autowired
    private AnomalyRepository anomalyRepository;

    @Transactional(readOnly = true)
    public List<StationSummaryDto> getAllStationSummaries() {
        List<WeatherStation> stations = stationRepository.findAll();
        return stations.stream().map(this::mapToSummaryDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StationDetailDto getStationDetail(Long id) {
        WeatherStation station = stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Weather station not found with id: " + id));

        StationDetailDto dto = new StationDetailDto();
        dto.setId(station.getId());
        dto.setStationCode(station.getStationCode());
        dto.setName(station.getName());
        dto.setRegion(station.getRegion());
        dto.setLatitude(station.getLatitude());
        dto.setLongitude(station.getLongitude());
        dto.setElevationMeters(station.getElevationMeters());
        dto.setStatus(station.getStatus());
        dto.setBatteryLevel(station.getBatteryLevel());
        dto.setTransmissionIntervalSeconds(station.getTransmissionIntervalSeconds());
        dto.setLastHeartbeat(station.getLastHeartbeat());
        dto.setInstalledDate(station.getInstalledDate());
        dto.setDescription(station.getDescription());

        // Sensors
        List<Sensor> sensors = sensorRepository.findByWeatherStationId(station.getId());
        dto.setSensors(sensors.stream().map(this::mapToSensorDto).collect(Collectors.toList()));

        // Latest observation
        Optional<WeatherObservation> latestObs = observationRepository.findFirstByWeatherStationIdOrderByTimestampDesc(station.getId());
        latestObs.ifPresent(o -> dto.setLatestObservation(mapToObservationDto(o)));

        // Recent history (last 24-50 points)
        List<WeatherObservation> history = observationRepository.findTop50ByStationIdOrderByTimestampDesc(station.getId());
        dto.setRecentHistory(history.stream().map(this::mapToObservationDto).collect(Collectors.toList()));

        // Active anomalies
        List<Anomaly> anomalies = anomalyRepository.findByWeatherStationIdOrderByDetectedAtDesc(station.getId());
        dto.setActiveAnomalies(anomalies.stream().map(this::mapToAnomalyDto).collect(Collectors.toList()));

        return dto;
    }

    @Transactional
    public WeatherStation createStation(WeatherStation station) {
        return stationRepository.save(station);
    }

    @Transactional
    public WeatherStation updateStation(Long id, WeatherStation update) {
        WeatherStation existing = stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Weather station not found with id: " + id));

        existing.setName(update.getName());
        existing.setRegion(update.getRegion());
        existing.setLatitude(update.getLatitude());
        existing.setLongitude(update.getLongitude());
        existing.setElevationMeters(update.getElevationMeters());
        existing.setDescription(update.getDescription());
        if (update.getStatus() != null) existing.setStatus(update.getStatus());

        return stationRepository.save(existing);
    }

    @Transactional
    public void deleteStation(Long id) {
        if (!stationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Weather station not found with id: " + id);
        }
        stationRepository.deleteById(id);
    }

    public StationSummaryDto mapToSummaryDto(WeatherStation station) {
        StationSummaryDto dto = new StationSummaryDto();
        dto.setId(station.getId());
        dto.setStationCode(station.getStationCode());
        dto.setName(station.getName());
        dto.setRegion(station.getRegion());
        dto.setLatitude(station.getLatitude());
        dto.setLongitude(station.getLongitude());
        dto.setElevationMeters(station.getElevationMeters());
        dto.setStatus(station.getStatus());
        dto.setBatteryLevel(station.getBatteryLevel());
        dto.setLastHeartbeat(station.getLastHeartbeat());

        Optional<WeatherObservation> latest = observationRepository.findFirstByWeatherStationIdOrderByTimestampDesc(station.getId());
        if (latest.isPresent()) {
            dto.setCurrentTemperature(latest.get().getTemperature());
            dto.setCurrentPressure(latest.get().getAtmosphericPressure());
            dto.setCurrentHumidity(latest.get().getRelativeHumidity());
        }

        List<Anomaly> active = anomalyRepository.findByWeatherStationIdOrderByDetectedAtDesc(station.getId());
        dto.setActiveAnomalyCount((long) active.size());

        return dto;
    }

    public SensorDto mapToSensorDto(Sensor sensor) {
        SensorDto dto = new SensorDto();
        dto.setId(sensor.getId());
        dto.setParameter(sensor.getParameter());
        dto.setModel(sensor.getModel());
        dto.setSerialNumber(sensor.getSerialNumber());
        dto.setHealthScore(sensor.getHealthScore());
        dto.setLastCalibrationDate(sensor.getLastCalibrationDate());
        dto.setStatus(sensor.getStatus());
        return dto;
    }

    public ObservationDto mapToObservationDto(WeatherObservation obs) {
        ObservationDto dto = new ObservationDto();
        dto.setId(obs.getId());
        dto.setStationId(obs.getWeatherStation().getId());
        dto.setStationCode(obs.getWeatherStation().getStationCode());
        dto.setTimestamp(obs.getTimestamp());
        dto.setTemperature(obs.getTemperature());
        dto.setAtmosphericPressure(obs.getAtmosphericPressure());
        dto.setRelativeHumidity(obs.getRelativeHumidity());
        dto.setQualityFlag(obs.getQualityFlag());
        return dto;
    }

    public AnomalyDto mapToAnomalyDto(Anomaly anomaly) {
        AnomalyDto dto = new AnomalyDto();
        dto.setId(anomaly.getId());
        dto.setStationId(anomaly.getWeatherStation().getId());
        dto.setStationCode(anomaly.getWeatherStation().getStationCode());
        dto.setStationName(anomaly.getWeatherStation().getName());
        dto.setRegion(anomaly.getWeatherStation().getRegion());
        if (anomaly.getObservation() != null) {
            dto.setObservationId(anomaly.getObservation().getId());
        }
        dto.setParameter(anomaly.getParameter());
        dto.setAnomalyType(anomaly.getAnomalyType());
        dto.setSeverity(anomaly.getSeverity());
        dto.setStatus(anomaly.getStatus());
        dto.setObservedValue(anomaly.getObservedValue());
        dto.setExpectedBaselineValue(anomaly.getExpectedBaselineValue());
        dto.setConfidenceScore(anomaly.getConfidenceScore());
        dto.setRootCauseExplanation(anomaly.getRootCauseExplanation());
        dto.setRecommendedAction(anomaly.getRecommendedAction());
        dto.setDetectedAt(anomaly.getDetectedAt());
        dto.setAcknowledgedAt(anomaly.getAcknowledgedAt());
        dto.setResolvedAt(anomaly.getResolvedAt());
        dto.setRemarks(anomaly.getRemarks());
        return dto;
    }
}
