package com.aerisence.dto;

import java.time.LocalDateTime;

public class ReportDto {
    private Long id;
    private String title;
    private String reportType;
    private LocalDateTime dateRangeStart;
    private LocalDateTime dateRangeEnd;
    private String status;
    private String generatedBy;
    private String fileFormat;
    private String summaryJson;
    private LocalDateTime createdAt;

    public ReportDto() {}

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
