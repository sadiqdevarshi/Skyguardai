package com.aerisence.dto;

import com.aerisence.entity.StationStatus;
import java.time.LocalDateTime;
import java.util.List;

public class StationDetailDto {
    private Long id;
    private String stationCode;
    private String name;
    private String region;
    private Double latitude;
    private Double longitude;
    private Double elevationMeters;
    private StationStatus status;
    private Double batteryLevel;
    private Integer transmissionIntervalSeconds;
    private LocalDateTime lastHeartbeat;
    private LocalDateTime installedDate;
    private String description;
    private List<SensorDto> sensors;
    private ObservationDto latestObservation;
    private List<ObservationDto> recentHistory;
    private List<AnomalyDto> activeAnomalies;

    public StationDetailDto() {}

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

    public Integer getTransmissionIntervalSeconds() { return transmissionIntervalSeconds; }
    public void setTransmissionIntervalSeconds(Integer transmissionIntervalSeconds) { this.transmissionIntervalSeconds = transmissionIntervalSeconds; }

    public LocalDateTime getLastHeartbeat() { return lastHeartbeat; }
    public void setLastHeartbeat(LocalDateTime lastHeartbeat) { this.lastHeartbeat = lastHeartbeat; }

    public LocalDateTime getInstalledDate() { return installedDate; }
    public void setInstalledDate(LocalDateTime installedDate) { this.installedDate = installedDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<SensorDto> getSensors() { return sensors; }
    public void setSensors(List<SensorDto> sensors) { this.sensors = sensors; }

    public ObservationDto getLatestObservation() { return latestObservation; }
    public void setLatestObservation(ObservationDto latestObservation) { this.latestObservation = latestObservation; }

    public List<ObservationDto> getRecentHistory() { return recentHistory; }
    public void setRecentHistory(List<ObservationDto> recentHistory) { this.recentHistory = recentHistory; }

    public List<AnomalyDto> getActiveAnomalies() { return activeAnomalies; }
    public void setActiveAnomalies(List<AnomalyDto> activeAnomalies) { this.activeAnomalies = activeAnomalies; }
}
