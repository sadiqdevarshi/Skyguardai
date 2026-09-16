package com.aerisence.controller;

import com.aerisence.dto.AlertDto;
import com.aerisence.dto.ApiResponse;
import com.aerisence.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AlertDto>>> getRecentAlerts(@RequestParam(defaultValue = "30") int limit) {
        List<AlertDto> alerts = alertService.getRecentAlerts(limit);
        return ResponseEntity.ok(ApiResponse.ok("Alerts fetched successfully", alerts));
    }

    @GetMapping("/unacknowledged")
    public ResponseEntity<ApiResponse<List<AlertDto>>> getUnacknowledgedAlerts() {
        List<AlertDto> alerts = alertService.getUnacknowledgedAlerts();
        return ResponseEntity.ok(ApiResponse.ok("Unacknowledged alerts fetched", alerts));
    }

    @PatchMapping("/{id}/acknowledge")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'ANALYST')")
    public ResponseEntity<ApiResponse<AlertDto>> acknowledgeAlert(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "operator";
        AlertDto acknowledged = alertService.acknowledgeAlert(id, username);
        return ResponseEntity.ok(ApiResponse.ok("Alert acknowledged", acknowledged));
    }
}
