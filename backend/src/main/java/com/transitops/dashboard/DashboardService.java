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
        var vehicles = vehicleRepository.findAll().stream()
                .filter(v -> (vehicleType == null || vehicleType.isBlank() || v.getType().equalsIgnoreCase(vehicleType)))
                .filter(v -> (status == null || status.isBlank() || v.getStatus().name().equalsIgnoreCase(status)))
                .filter(v -> (region == null || region.isBlank() || v.getRegion().equalsIgnoreCase(region)))
                .toList();

        long totalVehicles = vehicles.size();
        long activeVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.On_Trip).count();
        long availableVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.Available).count();
        long inMaintenance = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.In_Shop).count();

        var trips = tripRepository.findAll().stream()
                .filter(t -> (vehicleType == null || vehicleType.isBlank() || t.getVehicle().getType().equalsIgnoreCase(vehicleType)))
                .filter(t -> (region == null || region.isBlank() || t.getVehicle().getRegion().equalsIgnoreCase(region)))
                .toList();

        long activeTrips = trips.stream()
                .filter(t -> t.getStatus() == TripStatus.Dispatched).count();
        long pendingTrips = trips.stream()
                .filter(t -> t.getStatus() == TripStatus.Draft).count();

        var drivers = driverRepository.findAll().stream()
                .filter(d -> (status == null || status.isBlank() || d.getStatus().name().equalsIgnoreCase(status)))
                .toList();

        long driversOnDuty = drivers.stream()
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
