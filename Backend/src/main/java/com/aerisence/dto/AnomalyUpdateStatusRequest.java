package com.aerisence.dto;

import com.aerisence.entity.AnomalyStatus;
import jakarta.validation.constraints.NotNull;

public class AnomalyUpdateStatusRequest {
    @NotNull(message = "Status is required")
    private AnomalyStatus status;

    private String remarks;

    public AnomalyStatus getStatus() { return status; }
    public void setStatus(AnomalyStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
