package com.transitops.dashboard;

import com.transitops.driver.DriverRepository;
import com.transitops.driver.DriverStatus;
import com.transitops.trip.TripRepository;
import com.transitops.trip.TripStatus;
import com.transitops.vehicle.VehicleRepository;
import com.transitops.vehicle.VehicleStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public Map<String, Object> calculateKpis(String vehicleType, String status, String region) {
        long totalVehicles = vehicleRepository.count();
        long activeVehicles = vehicleRepository.findAll().stream()
                .filter(v -> v.getStatus() == VehicleStatus.On_Trip).count();
        long availableVehicles = vehicleRepository.findAll().stream()
                .filter(v -> v.getStatus() == VehicleStatus.Available).count();
        long inMaintenance = vehicleRepository.findAll().stream()
                .filter(v -> v.getStatus() == VehicleStatus.In_Shop).count();
        long activeTrips = tripRepository.findAll().stream()
                .filter(t -> t.getStatus() == TripStatus.Dispatched).count();
        long pendingTrips = tripRepository.findAll().stream()
                .filter(t -> t.getStatus() == TripStatus.Draft).count();
        long driversOnDuty = driverRepository.findAll().stream()
                .filter(d -> d.getStatus() == DriverStatus.Available || d.getStatus() == DriverStatus.On_Trip).count();
        double fleetUtilization = totalVehicles == 0 ? 0.0 : ((double) activeVehicles / totalVehicles) * 100.0;

        Map<String, Object> kpis = new HashMap<>();
        kpis.put("activeVehicles", activeVehicles);
        kpis.put("availableVehicles", availableVehicles);
        kpis.put("vehiclesInMaintenance", inMaintenance);
        kpis.put("activeTrips", activeTrips);
        kpis.put("pendingTrips", pendingTrips);
        kpis.put("driversOnDuty", driversOnDuty);
        kpis.put("fleetUtilization", Math.round(fleetUtilization * 10.0) / 10.0);
        return kpis;
    }
}
