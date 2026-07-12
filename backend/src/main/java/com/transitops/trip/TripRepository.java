package com.transitops.trip;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends CrudRepository<Trip, Long> {
    List<Trip> findByDriverContainingIgnoreCase(String driver);

    List<Trip> findByVehicleContainingIgnoreCase(String vehicle);

    List<Trip> findByStatus(TripStatus status);
}
