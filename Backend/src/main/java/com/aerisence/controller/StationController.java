package com.aerisence.controller;

import com.aerisence.dto.ApiResponse;
import com.aerisence.dto.StationDetailDto;
import com.aerisence.dto.StationSummaryDto;
import com.aerisence.entity.WeatherStation;
import com.aerisence.service.StationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    @Autowired
    private StationService stationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StationSummaryDto>>> getAllStations() {
        List<StationSummaryDto> stations = stationService.getAllStationSummaries();
        return ResponseEntity.ok(ApiResponse.ok("Stations fetched successfully", stations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StationDetailDto>> getStationDetail(@PathVariable Long id) {
        StationDetailDto station = stationService.getStationDetail(id);
        return ResponseEntity.ok(ApiResponse.ok("Station detail fetched successfully", station));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<ApiResponse<WeatherStation>> createStation(@Valid @RequestBody WeatherStation station) {
        WeatherStation created = stationService.createStation(station);
        return ResponseEntity.ok(ApiResponse.ok("Station registered successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<ApiResponse<WeatherStation>> updateStation(@PathVariable Long id, @Valid @RequestBody WeatherStation station) {
        WeatherStation updated = stationService.updateStation(id, station);
        return ResponseEntity.ok(ApiResponse.ok("Station updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteStation(@PathVariable Long id) {
        stationService.deleteStation(id);
        return ResponseEntity.ok(ApiResponse.ok("Station deleted successfully", null));
    }
}
