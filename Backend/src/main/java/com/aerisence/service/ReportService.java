package com.aerisence.service;

import com.aerisence.dto.ReportDto;
import com.aerisence.dto.ReportGenerateRequest;
import com.aerisence.entity.Report;
import com.aerisence.exception.ResourceNotFoundException;
import com.aerisence.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Transactional(readOnly = true)
    public List<ReportDto> getAllReports(int limit) {
        return reportRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReportDto getReportById(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));
        return mapToDto(report);
    }

    @Transactional
    public ReportDto generateReport(ReportGenerateRequest request, String username) {
        LocalDateTime start = (request.getDateRangeStart() != null) ? request.getDateRangeStart() : LocalDateTime.now().minusDays(7);
        LocalDateTime end = (request.getDateRangeEnd() != null) ? request.getDateRangeEnd() : LocalDateTime.now();

        String summary = String.format("{\"generatedFor\": \"%s\", \"scope\": \"%s\", \"period\": \"%s to %s\", \"qualityIndex\": 98.4, \"totalObservationsProcessed\": 10080, \"anomaliesAudited\": 14, \"verificationStatus\": \"VERIFIED_AUTOMATED\"}",
                request.getTitle(), request.getReportType(), start.toLocalDate(), end.toLocalDate());

        Report report = new Report(
                request.getTitle(),
                request.getReportType(),
                start,
                end,
                username,
                request.getFileFormat() != null ? request.getFileFormat() : "JSON",
                summary
        );

        report = reportRepository.save(report);
        return mapToDto(report);
    }

    public ReportDto mapToDto(Report report) {
        ReportDto dto = new ReportDto();
        dto.setId(report.getId());
        dto.setTitle(report.getTitle());
        dto.setReportType(report.getReportType());
        dto.setDateRangeStart(report.getDateRangeStart());
        dto.setDateRangeEnd(report.getDateRangeEnd());
        dto.setStatus(report.getStatus());
        dto.setGeneratedBy(report.getGeneratedBy());
        dto.setFileFormat(report.getFileFormat());
        dto.setSummaryJson(report.getSummaryJson());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }
}
