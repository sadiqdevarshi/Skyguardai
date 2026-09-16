package com.aerisence.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "anomalies", indexes = {
    @Index(name = "idx_anom_station", columnList = "weather_station_id"),
    @Index(name = "idx_anom_status", columnList = "status"),
    @Index(name = "idx_anom_severity", columnList = "severity")
})
public class Anomaly {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weather_station_id", nullable = false)
    @JsonIgnoreProperties("sensors")
    private WeatherStation weatherStation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "observation_id")
    private WeatherObservation observation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SensorParameter parameter;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private AnomalyType anomalyType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AnomalySeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AnomalyStatus status = AnomalyStatus.OPEN;

    @Column(nullable = false)
    private Double observedValue;

    private Double expectedBaselineValue;

    private Double confidenceScore = 95.0; // Statistical confidence percentage

    @Column(length = 1000)
    private String rootCauseExplanation;

    @Column(length = 1000)
    private String recommendedAction;

    @Column(nullable = false)
    private LocalDateTime detectedAt = LocalDateTime.now();

    private LocalDateTime acknowledgedAt;

    private LocalDateTime resolvedAt;

    @Column(length = 1000)
    private String remarks;

    public Anomaly() {}

    public Anomaly(WeatherStation weatherStation, WeatherObservation observation, SensorParameter parameter,
                   AnomalyType anomalyType, AnomalySeverity severity, Double observedValue,
                   Double expectedBaselineValue, Double confidenceScore, String rootCauseExplanation, String recommendedAction) {
        this.weatherStation = weatherStation;
        this.observation = observation;
        this.parameter = parameter;
        this.anomalyType = anomalyType;
        this.severity = severity;
        this.status = AnomalyStatus.OPEN;
        this.observedValue = observedValue;
        this.expectedBaselineValue = expectedBaselineValue;
        this.confidenceScore = confidenceScore;
        this.rootCauseExplanation = rootCauseExplanation;
        this.recommendedAction = recommendedAction;
        this.detectedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public WeatherStation getWeatherStation() { return weatherStation; }
    public void setWeatherStation(WeatherStation weatherStation) { this.weatherStation = weatherStation; }

    public WeatherObservation getObservation() { return observation; }
    public void setObservation(WeatherObservation observation) { this.observation = observation; }

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
