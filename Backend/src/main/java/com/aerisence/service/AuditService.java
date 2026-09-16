package com.aerisence.service;

import com.aerisence.entity.AuditLog;
import com.aerisence.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Transactional
    public void log(String username, String action, String entityType, Long entityId, String details, String ipAddress) {
        AuditLog auditLog = new AuditLog(username, action, entityType, entityId, details, ipAddress);
        auditLogRepository.save(auditLog);
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getRecentLogs(int limit) {
        return auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(0, limit));
    }
}
