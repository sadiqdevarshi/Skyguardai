package com.aerisence.service;

import com.aerisence.dto.AnomalyDto;
import com.aerisence.dto.AnomalyUpdateStatusRequest;
import com.aerisence.entity.*;
import com.aerisence.exception.ResourceNotFoundException;
import com.aerisence.repository.AnomalyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnomalyService {

    @Autowired
    private AnomalyRepository anomalyRepository;

    @Autowired
    private StationService stationService;

    @Transactional(readOnly = true)
    public List<AnomalyDto> searchAnomalies(Long stationId, AnomalyStatus status, AnomalySeverity severity, SensorParameter parameter, int page, int size) {
        return anomalyRepository.searchAnomalies(stationId, status, severity, parameter, PageRequest.of(page, size))
                .stream()
                .map(stationService::mapToAnomalyDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AnomalyDto getAnomalyById(Long id) {
        Anomaly anomaly = anomalyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Anomaly not found with id: " + id));
        return stationService.mapToAnomalyDto(anomaly);
    }

    @Transactional
    public AnomalyDto updateAnomalyStatus(Long id, AnomalyUpdateStatusRequest request) {
        Anomaly anomaly = anomalyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Anomaly not found with id: " + id));

        anomaly.setStatus(request.getStatus());
        if (request.getRemarks() != null) {
            anomaly.setRemarks(request.getRemarks());
        }

        if (request.getStatus() == AnomalyStatus.ACKNOWLEDGED && anomaly.getAcknowledgedAt() == null) {
            anomaly.setAcknowledgedAt(LocalDateTime.now());
        } else if (request.getStatus() == AnomalyStatus.RESOLVED) {
            anomaly.setResolvedAt(LocalDateTime.now());
        }

        anomaly = anomalyRepository.save(anomaly);
        return stationService.mapToAnomalyDto(anomaly);
    }
}
