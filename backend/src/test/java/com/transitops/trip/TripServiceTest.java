package com.transitops.trip;

import com.transitops.driver.Driver;
import com.transitops.driver.DriverRepository;
import com.transitops.driver.DriverStatus;
import com.transitops.vehicle.Vehicle;
import com.transitops.vehicle.VehicleRepository;
import com.transitops.vehicle.VehicleStatus;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@SpringBootTest
@Transactional
public class TripServiceTest {

    @Autowired
    private TripService tripService;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Test
    public void whenCargoWeightExceedsCapacity_thenThrowException() {
        Vehicle van = Vehicle.builder()
                .registrationNumber("LOAD-VAN")
                .nameModel("Sprinter")
                .type("Van")
                .maxLoadCapacity(1200.0) // 1200kg limit
                .odometer(1000.0)
                .acquisitionCost(28000.0)
                .status(VehicleStatus.Available)
                .build();
        vehicleRepository.save(van);

        Driver driver = Driver.builder()
                .name("Alex Rider")
                .licenseNumber("DL-998877")
                .licenseCategory("Light Vehicle")
                .licenseExpiryDate(LocalDate.now().plusYears(2))
                .contactNumber("555-0199")
                .status(DriverStatus.Available)
                .build();
        driverRepository.save(driver);

        Trip trip = Trip.builder()
                .source("Warehouse")
                .destination("Store")
                .vehicle(van)
                .driver(driver)
                .cargoWeight(1500.0) // Exceeds 1200kg limit
                .plannedDistance(80.0)
                .build();

        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            tripService.createTrip(trip);
        });
    }

    @Test
    public void whenDriverLicenseExpired_thenRejectTripScheduling() {
        Vehicle truck = Vehicle.builder()
                .registrationNumber("OK-TRUCK")
                .nameModel("Actros")
                .type("Truck")
                .maxLoadCapacity(20000.0)
                .odometer(50000.0)
                .acquisitionCost(110000.0)
                .status(VehicleStatus.Available)
                .build();
        vehicleRepository.save(truck);

        Driver expiredDriver = Driver.builder()
                .name("Old Jim")
                .licenseNumber("DL-EXPIRED")
                .licenseCategory("Heavy Truck")
                .licenseExpiryDate(LocalDate.now().minusDays(5)) // Expired
                .contactNumber("555-0200")
                .status(DriverStatus.Available)
                .build();
        driverRepository.save(expiredDriver);

        Trip trip = Trip.builder()
                .source("Port")
                .destination("Yard")
                .vehicle(truck)
                .driver(expiredDriver)
                .cargoWeight(5000.0)
                .plannedDistance(150.0)
                .build();

        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            tripService.createTrip(trip);
        });
    }
}
