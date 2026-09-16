package com.aerisence.service;

import com.aerisence.dto.AlertDto;
import com.aerisence.entity.Alert;
import com.aerisence.entity.Anomaly;
import com.aerisence.exception.ResourceNotFoundException;
import com.aerisence.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Transactional
    public Alert createAlertForAnomaly(Anomaly anomaly) {
        String title = "Anomaly Flagged: " + anomaly.getParameter() + " [" + anomaly.getSeverity() + "]";
        String message = "Station " + anomaly.getWeatherStation().getStationCode() + " (" +
                anomaly.getWeatherStation().getName() + ") observed anomalous reading: " +
                anomaly.getObservedValue() + ". Root cause: " + anomaly.getRootCauseExplanation();

        Alert alert = new Alert(anomaly, anomaly.getWeatherStation(), title, message, anomaly.getSeverity());
        return alertRepository.save(alert);
    }

    @Transactional(readOnly = true)
    public List<AlertDto> getRecentAlerts(int limit) {
        return alertRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AlertDto> getUnacknowledgedAlerts() {
        return alertRepository.findByAcknowledgedFalseOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AlertDto acknowledgeAlert(Long alertId, String username) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with id: " + alertId));

        alert.setAcknowledged(true);
        alert.setAcknowledgedBy(username);
        alert.setAcknowledgedAt(LocalDateTime.now());
        alert = alertRepository.save(alert);

        return mapToDto(alert);
    }

    public AlertDto mapToDto(Alert alert) {
        AlertDto dto = new AlertDto();
        dto.setId(alert.getId());
        if (alert.getAnomaly() != null) {
            dto.setAnomalyId(alert.getAnomaly().getId());
        }
        if (alert.getWeatherStation() != null) {
            dto.setStationId(alert.getWeatherStation().getId());
            dto.setStationCode(alert.getWeatherStation().getStationCode());
            dto.setStationName(alert.getWeatherStation().getName());
        }
        dto.setTitle(alert.getTitle());
        dto.setMessage(alert.getMessage());
        dto.setSeverity(alert.getSeverity());
        dto.setAcknowledged(alert.isAcknowledged());
        dto.setAcknowledgedBy(alert.getAcknowledgedBy());
        dto.setAcknowledgedAt(alert.getAcknowledgedAt());
        dto.setCreatedAt(alert.getCreatedAt());
        return dto;
    }
}
