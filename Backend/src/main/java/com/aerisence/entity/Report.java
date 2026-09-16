package com.aerisence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 50)
    private String reportType; // e.g. DAILY_TELEMETRY, ANOMALY_AUDIT, SENSOR_CALIBRATION, NETWORK_HEALTH

    private LocalDateTime dateRangeStart;

    private LocalDateTime dateRangeEnd;

    @Column(nullable = false, length = 30)
    private String status = "COMPLETED"; // GENERATING, COMPLETED, FAILED

    @Column(nullable = false, length = 100)
    private String generatedBy;

    @Column(nullable = false, length = 10)
    private String fileFormat = "JSON"; // JSON, CSV, PDF

    @Column(columnDefinition = "TEXT")
    private String summaryJson;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Report() {}

    public Report(String title, String reportType, LocalDateTime dateRangeStart, LocalDateTime dateRangeEnd, String generatedBy, String fileFormat, String summaryJson) {
        this.title = title;
        this.reportType = reportType;
        this.dateRangeStart = dateRangeStart;
        this.dateRangeEnd = dateRangeEnd;
        this.generatedBy = generatedBy;
        this.fileFormat = fileFormat;
        this.summaryJson = summaryJson;
        this.status = "COMPLETED";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public LocalDateTime getDateRangeStart() { return dateRangeStart; }
    public void setDateRangeStart(LocalDateTime dateRangeStart) { this.dateRangeStart = dateRangeStart; }

    public LocalDateTime getDateRangeEnd() { return dateRangeEnd; }
    public void setDateRangeEnd(LocalDateTime dateRangeEnd) { this.dateRangeEnd = dateRangeEnd; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }

    public String getFileFormat() { return fileFormat; }
    public void setFileFormat(String fileFormat) { this.fileFormat = fileFormat; }

    public String getSummaryJson() { return summaryJson; }
    public void setSummaryJson(String summaryJson) { this.summaryJson = summaryJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
