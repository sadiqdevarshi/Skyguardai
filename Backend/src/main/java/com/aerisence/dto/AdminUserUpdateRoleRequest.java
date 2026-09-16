package com.aerisence.dto;

import com.aerisence.entity.Role;
import jakarta.validation.constraints.NotNull;

public class AdminUserUpdateRoleRequest {
    @NotNull(message = "Role is required")
    private Role role;

    private Boolean active;

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
