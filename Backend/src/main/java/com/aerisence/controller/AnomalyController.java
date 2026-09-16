package com.aerisence.controller;

import com.aerisence.dto.AnomalyDto;
import com.aerisence.dto.AnomalyUpdateStatusRequest;
import com.aerisence.dto.ApiResponse;
import com.aerisence.entity.AnomalySeverity;
import com.aerisence.entity.AnomalyStatus;
import com.aerisence.entity.SensorParameter;
import com.aerisence.service.AnomalyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/anomalies")
public class AnomalyController {

    @Autowired
    private AnomalyService anomalyService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AnomalyDto>>> searchAnomalies(
            @RequestParam(required = false) Long stationId,
            @RequestParam(required = false) AnomalyStatus status,
            @RequestParam(required = false) AnomalySeverity severity,
            @RequestParam(required = false) SensorParameter parameter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        List<AnomalyDto> anomalies = anomalyService.searchAnomalies(stationId, status, severity, parameter, page, size);
        return ResponseEntity.ok(ApiResponse.ok("Anomalies fetched successfully", anomalies));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AnomalyDto>> getAnomalyById(@PathVariable Long id) {
        AnomalyDto anomaly = anomalyService.getAnomalyById(id);
        return ResponseEntity.ok(ApiResponse.ok("Anomaly detail retrieved", anomaly));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'ANALYST')")
    public ResponseEntity<ApiResponse<AnomalyDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody AnomalyUpdateStatusRequest request) {
        AnomalyDto updated = anomalyService.updateAnomalyStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Anomaly status updated", updated));
    }
}
