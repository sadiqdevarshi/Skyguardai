package com.aerisence.controller;

import com.aerisence.dto.AnalyticsSummaryDto;
import com.aerisence.dto.ApiResponse;
import com.aerisence.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AnalyticsSummaryDto>> getSummary() {
        AnalyticsSummaryDto summary = analyticsService.getSystemAnalyticsSummary();
        return ResponseEntity.ok(ApiResponse.ok("Analytics summary computed successfully", summary));
    }
}
