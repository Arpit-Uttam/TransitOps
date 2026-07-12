package com.transitops.driver;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Driver ID not found: " + id));
    }

    public Driver registerDriver(Driver driver) {
        if (driverRepository.existsByLicenseNumber(driver.getLicenseNumber())) {
            throw new IllegalArgumentException("Driving License Number must be unique!");
        }
        driver.setStatus(DriverStatus.Available);
        driver.setSafetyScore(100.0);
        return driverRepository.save(driver);
    }

    public Driver updateDriver(Long id, Driver details) {
        Driver driver = getDriverById(id);

        if (details.getLicenseNumber() != null && !driver.getLicenseNumber().equalsIgnoreCase(details.getLicenseNumber())) {
            if (driverRepository.existsByLicenseNumber(details.getLicenseNumber())) {
                throw new IllegalArgumentException("Driving License is already registered!");
            }
        }

        if (details.getName() != null) {
            driver.setName(details.getName());
        }
        if (details.getLicenseNumber() != null) {
            driver.setLicenseNumber(details.getLicenseNumber());
        }
        if (details.getLicenseCategory() != null) {
            driver.setLicenseCategory(details.getLicenseCategory());
        }
        if (details.getLicenseExpiryDate() != null) {
            driver.setLicenseExpiryDate(details.getLicenseExpiryDate());
        }
        if (details.getContactNumber() != null) {
            driver.setContactNumber(details.getContactNumber());
        }
        if (details.getStatus() != null) {
            driver.setStatus(details.getStatus());
        }
        if (details.getSafetyScore() != null) {
            driver.setSafetyScore(details.getSafetyScore());
        }

        return driverRepository.save(driver);
    }
}