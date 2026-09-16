package com.aerisence.controller;

import com.aerisence.dto.ApiResponse;
import com.aerisence.dto.ReportDto;
import com.aerisence.dto.ReportGenerateRequest;
import com.aerisence.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReportDto>>> getAllReports(@RequestParam(defaultValue = "30") int limit) {
        List<ReportDto> reports = reportService.getAllReports(limit);
        return ResponseEntity.ok(ApiResponse.ok("Reports fetched successfully", reports));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReportDto>> getReportById(@PathVariable Long id) {
        ReportDto report = reportService.getReportById(id);
        return ResponseEntity.ok(ApiResponse.ok("Report fetched successfully", report));
    }

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'ANALYST')")
    public ResponseEntity<ApiResponse<ReportDto>> generateReport(
            @Valid @RequestBody ReportGenerateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "system-analyst";
        ReportDto generated = reportService.generateReport(request, username);
        return ResponseEntity.ok(ApiResponse.ok("Report generated successfully", generated));
    }

    @GetMapping("/{id}/export")
    public ResponseEntity<byte[]> exportReport(@PathVariable Long id) {
        ReportDto report = reportService.getReportById(id);
        String filename = "Aerisence_Report_" + report.getId() + "_" + report.getReportType() + ".json";
        byte[] content = report.getSummaryJson().getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(content);
    }
}
