package com.aerisence.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class IngestObservationRequest {
    @NotBlank(message = "Station code is required")
    private String stationCode;

    private LocalDateTime timestamp;

    @NotNull(message = "Temperature reading is required")
    private Double temperature;

    @NotNull(message = "Pressure reading is required")
    private Double atmosphericPressure;

    @NotNull(message = "Humidity reading is required")
    private Double relativeHumidity;

    private Double batteryLevel;

    public String getStationCode() { return stationCode; }
    public void setStationCode(String stationCode) { this.stationCode = stationCode; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getAtmosphericPressure() { return atmosphericPressure; }
    public void setAtmosphericPressure(Double atmosphericPressure) { this.atmosphericPressure = atmosphericPressure; }

    public Double getRelativeHumidity() { return relativeHumidity; }
    public void setRelativeHumidity(Double relativeHumidity) { this.relativeHumidity = relativeHumidity; }

    public Double getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Double batteryLevel) { this.batteryLevel = batteryLevel; }
}
