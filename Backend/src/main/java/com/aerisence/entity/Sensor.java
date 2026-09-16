package com.aerisence.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "sensors")
public class Sensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weather_station_id", nullable = false)
    @JsonIgnoreProperties("sensors")
    private WeatherStation weatherStation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SensorParameter parameter;

    @Column(nullable = false, length = 100)
    private String model;

    @Column(nullable = false, length = 100)
    private String serialNumber;

    @Column(nullable = false)
    private Double healthScore = 100.0; // 0.0 to 100.0

    private LocalDate lastCalibrationDate = LocalDate.now().minusMonths(3);

    @Column(nullable = false, length = 20)
    private String status = "OPERATIONAL";

    public Sensor() {}

    public Sensor(WeatherStation weatherStation, SensorParameter parameter, String model, String serialNumber, Double healthScore) {
        this.weatherStation = weatherStation;
        this.parameter = parameter;
        this.model = model;
        this.serialNumber = serialNumber;
        this.healthScore = healthScore;
        this.lastCalibrationDate = LocalDate.now().minusMonths(2);
        this.status = "OPERATIONAL";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public WeatherStation getWeatherStation() { return weatherStation; }
    public void setWeatherStation(WeatherStation weatherStation) { this.weatherStation = weatherStation; }

    public SensorParameter getParameter() { return parameter; }
    public void setParameter(SensorParameter parameter) { this.parameter = parameter; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public Double getHealthScore() { return healthScore; }
    public void setHealthScore(Double healthScore) { this.healthScore = healthScore; }

    public LocalDate getLastCalibrationDate() { return lastCalibrationDate; }
    public void setLastCalibrationDate(LocalDate lastCalibrationDate) { this.lastCalibrationDate = lastCalibrationDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
