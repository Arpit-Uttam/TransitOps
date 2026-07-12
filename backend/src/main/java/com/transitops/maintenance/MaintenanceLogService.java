package com.transitops.maintenance;

import com.transitops.vehicle.Vehicle;
import com.transitops.vehicle.VehicleRepository;
import com.transitops.vehicle.VehicleStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceLogService {

    private final MaintenanceLogRepository logRepository;
    private final VehicleRepository vehicleRepository;

    public List<MaintenanceLog> getAllLogs() {
        return logRepository.findAll();
    }

    @Transactional
    public MaintenanceLog startMaintenance(Long vehicleId, String description, Double cost, LocalDate start) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        
        if (vehicle.getStatus() == VehicleStatus.Retired) {
            throw new IllegalStateException("Retired vehicles cannot enter maintenance");
        }

        vehicle.setStatus(VehicleStatus.In_Shop);
        vehicleRepository.save(vehicle);

        MaintenanceLog log = MaintenanceLog.builder()
                .vehicle(vehicle)
                .description(description)
                .cost(cost)
                .startDate(start)
                .status("Active")
                .build();

        return logRepository.save(log);
    }

    @Transactional
    public MaintenanceLog completeMaintenance(Long logId) {
        MaintenanceLog log = logRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("Maintenance entry not found"));
        
        log.setEndDate(LocalDate.now());
        log.setStatus("Completed");

        Vehicle vehicle = log.getVehicle();
        if (vehicle.getStatus() != VehicleStatus.Retired) {
            vehicle.setStatus(VehicleStatus.Available);
            vehicleRepository.save(vehicle);
        }

        return logRepository.save(log);
    }
}
