package com.transitops.driver;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends CrudRepository<Driver, Long> {
    List<Driver> findByNameContainingIgnoreCase(String name);

    List<Driver> findByLicenseNoContainingIgnoreCase(String licenseNo);

    List<Driver> findByStatus(DriverStatus status);
}
