package com.transitops.driver;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public List<Driver> listDrivers() {
        List<Driver> drivers = new ArrayList<>();
        driverRepository.findAll().forEach(drivers::add);
        return drivers;
    }

    public Optional<Driver> getDriverById(Long id) {
        return driverRepository.findById(id);
    }

    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    public Optional<Driver> updateDriver(Long id, Driver updatedDriver) {
        return driverRepository.findById(id).map(existing -> {
            existing.setName(updatedDriver.getName());
            existing.setLicenseNo(updatedDriver.getLicenseNo());
            existing.setPhone(updatedDriver.getPhone());
            existing.setEmail(updatedDriver.getEmail());
            existing.setRenewalDate(updatedDriver.getRenewalDate());
            existing.setStatus(updatedDriver.getStatus());
            existing.setHealthStatus(updatedDriver.getHealthStatus());
            return driverRepository.save(existing);
        });
    }

    public boolean deleteDriver(Long id) {
        if (driverRepository.existsById(id)) {
            driverRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Driver> searchDrivers(String query) {
        if (query == null || query.isBlank()) {
            return listDrivers();
        }

        List<Driver> results = new ArrayList<>();
        results.addAll(driverRepository.findByNameContainingIgnoreCase(query));
        results.addAll(driverRepository.findByLicenseNoContainingIgnoreCase(query));
        return results.stream().distinct().toList();
    }
}
