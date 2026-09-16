package com.aerisence.service;

import com.aerisence.dto.IngestObservationRequest;
import com.aerisence.dto.ObservationDto;
import com.aerisence.entity.*;
import com.aerisence.exception.ResourceNotFoundException;
import com.aerisence.repository.WeatherObservationRepository;
import com.aerisence.repository.WeatherStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ObservationService {

    @Autowired
    private WeatherObservationRepository observationRepository;

    @Autowired
    private WeatherStationRepository stationRepository;

    @Autowired
    private AnomalyDetectionService anomalyDetectionService;

    @Transactional
    public ObservationDto ingestObservation(IngestObservationRequest request) {
        WeatherStation station = stationRepository.findByStationCode(request.getStationCode())
                .orElseThrow(() -> new ResourceNotFoundException("Weather station not found with code: " + request.getStationCode()));

        LocalDateTime obsTime = (request.getTimestamp() != null) ? request.getTimestamp() : LocalDateTime.now();

        WeatherObservation obs = new WeatherObservation(
                station,
                obsTime,
                request.getTemperature(),
                request.getAtmosphericPressure(),
                request.getRelativeHumidity(),
                QualityFlag.VALID
        );

        // Update station status and heartbeat
        station.setLastHeartbeat(obsTime);
        if (request.getBatteryLevel() != null) {
            station.setBatteryLevel(request.getBatteryLevel());
        }
        station.setStatus(StationStatus.ONLINE);
        stationRepository.save(station);

        obs = observationRepository.save(obs);

        // Trigger real-time anomaly detection pipeline
        anomalyDetectionService.inspectObservation(obs, station);

        return mapToDto(obs);
    }

    @Transactional(readOnly = true)
    public List<ObservationDto> getRecentObservations(Long stationId, int limit) {
        return observationRepository.findByWeatherStationIdOrderByTimestampDesc(stationId, PageRequest.of(0, limit))
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ObservationDto> getObservationsHistory(Long stationId, LocalDateTime start, LocalDateTime end) {
        return observationRepository.findByStationAndDateRange(stationId, start, end)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ObservationDto mapToDto(WeatherObservation obs) {
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
}
