package com.transitops.driver;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    List<Driver> findByNameContainingIgnoreCase(String name);

    List<Driver> findByLicenseNumberContainingIgnoreCase(String licenseNumber);

    List<Driver> findByStatus(DriverStatus status);

    boolean existsByLicenseNumber(String licenseNumber);

    List<Driver> findByNameContainingIgnoreCaseOrLicenseNumberContainingIgnoreCase(String name, String licenseNumber);
}
