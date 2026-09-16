package com.aerisence.controller;

import com.aerisence.dto.AdminUserUpdateRoleRequest;
import com.aerisence.dto.ApiResponse;
import com.aerisence.dto.UserProfileDto;
import com.aerisence.entity.AuditLog;
import com.aerisence.service.AuditService;
import com.aerisence.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuditService auditService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileDto>>> getAllUsers() {
        List<UserProfileDto> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok("All users retrieved", users));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody AdminUserUpdateRoleRequest request) {
        UserProfileDto updated = userService.updateUserRole(id, request);
        auditService.log("admin", "UPDATE_USER_ROLE", "User", id, "Updated role to: " + request.getRole(), "127.0.0.1");
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", updated));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs(@RequestParam(defaultValue = "50") int limit) {
        List<AuditLog> logs = auditService.getRecentLogs(limit);
        return ResponseEntity.ok(ApiResponse.ok("Audit logs fetched", logs));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userService.getAllUsers().size());
        stats.put("jvmMemoryFreeBytes", Runtime.getRuntime().freeMemory());
        stats.put("jvmMemoryTotalBytes", Runtime.getRuntime().totalMemory());
        stats.put("activeProcessors", Runtime.getRuntime().availableProcessors());
        stats.put("systemStatus", "HEALTHY");
        return ResponseEntity.ok(ApiResponse.ok("Admin stats retrieved", stats));
    }
}
