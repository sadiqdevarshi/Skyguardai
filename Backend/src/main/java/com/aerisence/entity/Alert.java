package com.aerisence.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts", indexes = {
    @Index(name = "idx_alert_station", columnList = "weather_station_id"),
    @Index(name = "idx_alert_ack", columnList = "acknowledged")
})
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "anomaly_id")
    private Anomaly anomaly;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weather_station_id", nullable = false)
    @JsonIgnoreProperties("sensors")
    private WeatherStation weatherStation;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AnomalySeverity severity;

    @Column(nullable = false)
    private boolean acknowledged = false;

    private String acknowledgedBy;

    private LocalDateTime acknowledgedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Alert() {}

    public Alert(Anomaly anomaly, WeatherStation weatherStation, String title, String message, AnomalySeverity severity) {
        this.anomaly = anomaly;
        this.weatherStation = weatherStation;
        this.title = title;
        this.message = message;
        this.severity = severity;
        this.acknowledged = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Anomaly getAnomaly() { return anomaly; }
    public void setAnomaly(Anomaly anomaly) { this.anomaly = anomaly; }

    public WeatherStation getWeatherStation() { return weatherStation; }
    public void setWeatherStation(WeatherStation weatherStation) { this.weatherStation = weatherStation; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public AnomalySeverity getSeverity() { return severity; }
    public void setSeverity(AnomalySeverity severity) { this.severity = severity; }

    public boolean isAcknowledged() { return acknowledged; }
    public void setAcknowledged(boolean acknowledged) { this.acknowledged = acknowledged; }

    public String getAcknowledgedBy() { return acknowledgedBy; }
    public void setAcknowledgedBy(String acknowledgedBy) { this.acknowledgedBy = acknowledgedBy; }

    public LocalDateTime getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
