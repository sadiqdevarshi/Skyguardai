package com.aerisence.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class ReportGenerateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Report type is required")
    private String reportType; // e.g. DAILY_TELEMETRY, ANOMALY_AUDIT, SENSOR_CALIBRATION, NETWORK_HEALTH

    private LocalDateTime dateRangeStart;
    private LocalDateTime dateRangeEnd;
    private String fileFormat = "JSON";

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public LocalDateTime getDateRangeStart() { return dateRangeStart; }
    public void setDateRangeStart(LocalDateTime dateRangeStart) { this.dateRangeStart = dateRangeStart; }

    public LocalDateTime getDateRangeEnd() { return dateRangeEnd; }
    public void setDateRangeEnd(LocalDateTime dateRangeEnd) { this.dateRangeEnd = dateRangeEnd; }

    public String getFileFormat() { return fileFormat; }
    public void setFileFormat(String fileFormat) { this.fileFormat = fileFormat; }
}
