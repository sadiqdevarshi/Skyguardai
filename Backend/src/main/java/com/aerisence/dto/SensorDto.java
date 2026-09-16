package com.aerisence.dto;

import com.aerisence.entity.SensorParameter;
import java.time.LocalDate;

public class SensorDto {
    private Long id;
    private SensorParameter parameter;
    private String model;
    private String serialNumber;
    private Double healthScore;
    private LocalDate lastCalibrationDate;
    private String status;

    public SensorDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
