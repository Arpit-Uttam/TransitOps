package com.transitops.vehicle;

import com.transitops.maintenance.MaintenanceLog;
import com.transitops.maintenance.MaintenanceLogService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@SpringBootTest
@Transactional
public class VehicleServiceTest {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private MaintenanceLogService maintenanceService;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Test
    public void whenDuplicatePlateRegistered_thenThrowException() {
        Vehicle car1 = Vehicle.builder()
                .registrationNumber("TEST-PLATE-1")
                .nameModel("Volvo Truck")
                .type("Truck")
                .maxLoadCapacity(20000.0)
                .odometer(500.0)
                .acquisitionCost(95000.0)
                .status(VehicleStatus.Available)
                .build();
        vehicleService.createVehicle(car1);

        Vehicle car2 = Vehicle.builder()
                .registrationNumber("TEST-PLATE-1") // Duplicate plate
                .nameModel("Scania Truck")
                .type("Truck")
                .maxLoadCapacity(15000.0)
                .odometer(0.0)
                .acquisitionCost(80000.0)
                .status(VehicleStatus.Available)
                .build();

        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            vehicleService.createVehicle(car2);
        });
    }

    @Test
    public void whenMaintenanceLogged_thenVehicleStatusChangesToInShop() {
        Vehicle car = Vehicle.builder()
                .registrationNumber("MAINT-1")
                .nameModel("Ford Transit")
                .type("Van")
                .maxLoadCapacity(2500.0)
                .odometer(12000.0)
                .acquisitionCost(35000.0)
                .status(VehicleStatus.Available)
                .build();
        Vehicle saved = vehicleRepository.save(car);

        // Act
        MaintenanceLog log = maintenanceService.startMaintenance(
                saved.getId(), "Brake Service", 450.00, LocalDate.now()
        );

        // Assert
        Assertions.assertEquals(VehicleStatus.In_Shop, log.getVehicle().getStatus());
    }
}
