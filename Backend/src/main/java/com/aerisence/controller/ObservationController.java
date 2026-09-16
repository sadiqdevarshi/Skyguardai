package com.aerisence.controller;

import com.aerisence.dto.ApiResponse;
import com.aerisence.dto.IngestObservationRequest;
import com.aerisence.dto.ObservationDto;
import com.aerisence.service.ObservationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/observations")
public class ObservationController {

    @Autowired
    private ObservationService observationService;

    @PostMapping("/ingest")
    public ResponseEntity<ApiResponse<ObservationDto>> ingestTelemetry(@Valid @RequestBody IngestObservationRequest request) {
        ObservationDto observation = observationService.ingestObservation(request);
        return ResponseEntity.ok(ApiResponse.ok("Telemetry ingested and processed successfully", observation));
    }

    @GetMapping("/station/{stationId}/recent")
    public ResponseEntity<ApiResponse<List<ObservationDto>>> getRecentObservations(
            @PathVariable Long stationId,
            @RequestParam(defaultValue = "30") int limit) {
        List<ObservationDto> list = observationService.getRecentObservations(stationId, limit);
        return ResponseEntity.ok(ApiResponse.ok("Recent observations retrieved", list));
    }

    @GetMapping("/station/{stationId}/history")
    public ResponseEntity<ApiResponse<List<ObservationDto>>> getObservationsHistory(
            @PathVariable Long stationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<ObservationDto> list = observationService.getObservationsHistory(stationId, start, end);
        return ResponseEntity.ok(ApiResponse.ok("Observations history retrieved", list));
    }
}
