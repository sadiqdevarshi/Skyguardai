package com.aerisence.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "weather_stations")
public class WeatherStation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String stationCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String region;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Double elevationMeters;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StationStatus status = StationStatus.ONLINE;

    @Column(nullable = false)
    private Double batteryLevel = 100.0; // Percentage

    @Column(nullable = false)
    private Integer transmissionIntervalSeconds = 60;

    private LocalDateTime lastHeartbeat = LocalDateTime.now();

    private LocalDateTime installedDate = LocalDateTime.now();

    @Column(length = 500)
    private String description;

    @OneToMany(mappedBy = "weatherStation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("weatherStation")
    private List<Sensor> sensors = new ArrayList<>();

    public WeatherStation() {}

    public WeatherStation(String stationCode, String name, String region, Double latitude, Double longitude, Double elevationMeters, String description) {
        this.stationCode = stationCode;
        this.name = name;
        this.region = region;
        this.latitude = latitude;
        this.longitude = longitude;
        this.elevationMeters = elevationMeters;
        this.description = description;
        this.status = StationStatus.ONLINE;
        this.batteryLevel = 98.5;
        this.transmissionIntervalSeconds = 60;
        this.lastHeartbeat = LocalDateTime.now();
        this.installedDate = LocalDateTime.now().minusMonths(6);
    }

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

    public List<Sensor> getSensors() { return sensors; }
    public void setSensors(List<Sensor> sensors) { this.sensors = sensors; }
}
