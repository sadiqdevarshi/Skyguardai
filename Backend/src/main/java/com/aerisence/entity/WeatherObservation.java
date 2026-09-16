package com.aerisence.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_observations", indexes = {
    @Index(name = "idx_obs_station_time", columnList = "weather_station_id, timestamp"),
    @Index(name = "idx_obs_timestamp", columnList = "timestamp")
})
public class WeatherObservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weather_station_id", nullable = false)
    @JsonIgnoreProperties("sensors")
    private WeatherStation weatherStation;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private Double temperature; // °C

    @Column(nullable = false)
    private Double atmosphericPressure; // hPa

    @Column(nullable = false)
    private Double relativeHumidity; // %

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QualityFlag qualityFlag = QualityFlag.VALID;

    @Column(length = 1000)
    private String rawPayload;

    public WeatherObservation() {}

    public WeatherObservation(WeatherStation weatherStation, LocalDateTime timestamp, Double temperature, Double atmosphericPressure, Double relativeHumidity, QualityFlag qualityFlag) {
        this.weatherStation = weatherStation;
        this.timestamp = timestamp;
        this.temperature = temperature;
        this.atmosphericPressure = atmosphericPressure;
        this.relativeHumidity = relativeHumidity;
        this.qualityFlag = qualityFlag;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public WeatherStation getWeatherStation() { return weatherStation; }
    public void setWeatherStation(WeatherStation weatherStation) { this.weatherStation = weatherStation; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getAtmosphericPressure() { return atmosphericPressure; }
    public void setAtmosphericPressure(Double atmosphericPressure) { this.atmosphericPressure = atmosphericPressure; }

    public Double getRelativeHumidity() { return relativeHumidity; }
    public void setRelativeHumidity(Double relativeHumidity) { this.relativeHumidity = relativeHumidity; }

    public QualityFlag getQualityFlag() { return qualityFlag; }
    public void setQualityFlag(QualityFlag qualityFlag) { this.qualityFlag = qualityFlag; }

    public String getRawPayload() { return rawPayload; }
    public void setRawPayload(String rawPayload) { this.rawPayload = rawPayload; }
}
