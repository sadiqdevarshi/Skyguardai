package com.aerisence.dto;

import com.aerisence.entity.QualityFlag;
import java.time.LocalDateTime;

public class ObservationDto {
    private Long id;
    private Long stationId;
    private String stationCode;
    private LocalDateTime timestamp;
    private Double temperature;
    private Double atmosphericPressure;
    private Double relativeHumidity;
    private QualityFlag qualityFlag;

    public ObservationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }

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

    public QualityFlag getQualityFlag() { return qualityFlag; }
    public void setQualityFlag(QualityFlag qualityFlag) { this.qualityFlag = qualityFlag; }
}
