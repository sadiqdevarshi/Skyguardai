package com.aerisence.dto;

import com.aerisence.entity.StationStatus;
import java.time.LocalDateTime;

public class StationSummaryDto {
    private Long id;
    private String stationCode;
    private String name;
    private String region;
    private Double latitude;
    private Double longitude;
    private Double elevationMeters;
    private StationStatus status;
    private Double batteryLevel;
    private LocalDateTime lastHeartbeat;
    private Double currentTemperature;
    private Double currentPressure;
    private Double currentHumidity;
    private Long activeAnomalyCount;

    public StationSummaryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStationCode() { return stationCode; }
    public void setStationCode(String stationCode) { this.stationCode = stationCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getElevationMeters() { return elevationMeters; }
    public void setElevationMeters(Double elevationMeters) { this.elevationMeters = elevationMeters; }

    public StationStatus getStatus() { return status; }
    public void setStatus(StationStatus status) { this.status = status; }

    public Double getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Double batteryLevel) { this.batteryLevel = batteryLevel; }

    public LocalDateTime getLastHeartbeat() { return lastHeartbeat; }
    public void setLastHeartbeat(LocalDateTime lastHeartbeat) { this.lastHeartbeat = lastHeartbeat; }

    public Double getCurrentTemperature() { return currentTemperature; }
    public void setCurrentTemperature(Double currentTemperature) { this.currentTemperature = currentTemperature; }

    public Double getCurrentPressure() { return currentPressure; }
    public void setCurrentPressure(Double currentPressure) { this.currentPressure = currentPressure; }

    public Double getCurrentHumidity() { return currentHumidity; }
    public void setCurrentHumidity(Double currentHumidity) { this.currentHumidity = currentHumidity; }

    public Long getActiveAnomalyCount() { return activeAnomalyCount; }
    public void setActiveAnomalyCount(Long activeAnomalyCount) { this.activeAnomalyCount = activeAnomalyCount; }
}
