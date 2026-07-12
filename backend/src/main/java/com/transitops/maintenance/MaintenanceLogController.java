package com.transitops.maintenance;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceLogController {

    private final MaintenanceLogService maintenanceService;

    @GetMapping
    public ResponseEntity<List<MaintenanceLog>> getAll() {
        return ResponseEntity.ok(maintenanceService.getAllLogs());
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_FLEET_MANAGER')")
    public ResponseEntity<MaintenanceLog> start(@RequestParam Long vehicleId, 
                                                @RequestParam String description, 
                                                @RequestParam Double cost) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(maintenanceService.startMaintenance(vehicleId, description, cost, LocalDate.now()));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('ROLE_FLEET_MANAGER')")
    public ResponseEntity<MaintenanceLog> complete(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.completeMaintenance(id));
    }
}
