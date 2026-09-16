package com.aerisence.dto;

import com.aerisence.entity.AnomalySeverity;
import com.aerisence.entity.AnomalyStatus;
import com.aerisence.entity.AnomalyType;
import com.aerisence.entity.SensorParameter;
import java.time.LocalDateTime;

public class AnomalyDto {
    private Long id;
    private Long stationId;
    private String stationCode;
    private String stationName;
    private String region;
    private Long observationId;
    private SensorParameter parameter;
    private AnomalyType anomalyType;
    private AnomalySeverity severity;
    private AnomalyStatus status;
    private Double observedValue;
    private Double expectedBaselineValue;
    private Double confidenceScore;
    private String rootCauseExplanation;
    private String recommendedAction;
    private LocalDateTime detectedAt;
    private LocalDateTime acknowledgedAt;
    private LocalDateTime resolvedAt;
    private String remarks;

    public AnomalyDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }

    public String getStationCode() { return stationCode; }
    public void setStationCode(String stationCode) { this.stationCode = stationCode; }

    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public Long getObservationId() { return observationId; }
    public void setObservationId(Long observationId) { this.observationId = observationId; }

    public SensorParameter getParameter() { return parameter; }
    public void setParameter(SensorParameter parameter) { this.parameter = parameter; }

    public AnomalyType getAnomalyType() { return anomalyType; }
    public void setAnomalyType(AnomalyType anomalyType) { this.anomalyType = anomalyType; }

    public AnomalySeverity getSeverity() { return severity; }
    public void setSeverity(AnomalySeverity severity) { this.severity = severity; }

    public AnomalyStatus getStatus() { return status; }
    public void setStatus(AnomalyStatus status) { this.status = status; }

    public Double getObservedValue() { return observedValue; }
    public void setObservedValue(Double observedValue) { this.observedValue = observedValue; }

    public Double getExpectedBaselineValue() { return expectedBaselineValue; }
    public void setExpectedBaselineValue(Double expectedBaselineValue) { this.expectedBaselineValue = expectedBaselineValue; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getRootCauseExplanation() { return rootCauseExplanation; }
    public void setRootCauseExplanation(String rootCauseExplanation) { this.rootCauseExplanation = rootCauseExplanation; }

    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }

    public LocalDateTime getDetectedAt() { return detectedAt; }
    public void setDetectedAt(LocalDateTime detectedAt) { this.detectedAt = detectedAt; }

    public LocalDateTime getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
