package com.transitops.trip;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByStatus(TripStatus status);

    List<Trip> findBySourceContainingIgnoreCaseOrDestinationContainingIgnoreCaseOrDriverNameContainingIgnoreCaseOrVehicleRegistrationNumberContainingIgnoreCase(
            String source, String destination, String driverName, String vehicleRegistrationNumber
    );
}
