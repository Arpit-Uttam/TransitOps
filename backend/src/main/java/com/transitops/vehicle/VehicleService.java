package com.transitops.vehicle;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle ID not found: " + id));
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        if (vehicleRepository.existsByRegistrationNumber(vehicle.getRegistrationNumber())) {
            throw new IllegalArgumentException("Vehicle Registration Number must be unique!");
        }
        vehicle.setStatus(VehicleStatus.Available);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle details) {
        Vehicle vehicle = getVehicleById(id);
        if (!vehicle.getRegistrationNumber().equalsIgnoreCase(details.getRegistrationNumber())) {
            if (vehicleRepository.existsByRegistrationNumber(details.getRegistrationNumber())) {
                throw new IllegalArgumentException("Registration number is already allocated!");
            }
        }
        vehicle.setRegistrationNumber(details.getRegistrationNumber());
        vehicle.setNameModel(details.getNameModel());
        vehicle.setType(details.getType());
        vehicle.setMaxLoadCapacity(details.getMaxLoadCapacity());
        vehicle.setOdometer(details.getOdometer());
        vehicle.setAcquisitionCost(details.getAcquisitionCost());
        vehicle.setRegion(details.getRegion());
        if (details.getStatus() != null) {
            vehicle.setStatus(details.getStatus());
        }
        return vehicleRepository.save(vehicle);
    }

    public void retireVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setStatus(VehicleStatus.Retired);
        vehicleRepository.save(vehicle);
    }
}
