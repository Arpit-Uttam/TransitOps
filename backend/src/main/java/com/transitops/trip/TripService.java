package com.transitops.trip;

import com.transitops.driver.Driver;
import com.transitops.driver.DriverRepository;
import com.transitops.driver.DriverStatus;
import com.transitops.vehicle.Vehicle;
import com.transitops.vehicle.VehicleRepository;
import com.transitops.vehicle.VehicleStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public TripService(TripRepository tripRepository, VehicleRepository vehicleRepository, DriverRepository driverRepository) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll().stream().toList();
    }

    public List<Trip> searchTrips(String query) {
        if (query == null || query.isBlank()) {
            return tripRepository.findAll();
        }
        return tripRepository.findBySourceContainingIgnoreCaseOrDestinationContainingIgnoreCaseOrDriverNameContainingIgnoreCaseOrVehicleRegistrationNumberContainingIgnoreCase(
                query, query, query, query
        );
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found with ID: " + id));
    }

    @Transactional
    public Trip createTrip(Trip tripDetails) {
        Vehicle vehicle = vehicleRepository.findById(tripDetails.getVehicle().getId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle selection error"));
        Driver driver = driverRepository.findById(tripDetails.getDriver().getId())
                .orElseThrow(() -> new IllegalArgumentException("Driver selection error"));

        if (tripDetails.getCargoWeight() > vehicle.getMaxLoadCapacity()) {
            throw new IllegalArgumentException("Cargo capacity weight exceeds vehicle load limit of " + vehicle.getMaxLoadCapacity() + " kg!");
        }

        if (driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Driver has an expired license! Dispatch blocked.");
        }

        if (driver.getStatus() == DriverStatus.Suspended) {
            throw new IllegalArgumentException("Driver is suspended! Dispatch blocked.");
        }

        if (vehicle.getStatus() != VehicleStatus.Available) {
            throw new IllegalArgumentException("Vehicle status is not 'Available'. Selected vehicle is " + vehicle.getStatus());
        }
        if (driver.getStatus() != DriverStatus.Available) {
            throw new IllegalArgumentException("Driver status is not 'Available'. Selected driver is " + driver.getStatus());
        }

        tripDetails.setVehicle(vehicle);
        tripDetails.setDriver(driver);
        tripDetails.setStatus(TripStatus.Draft);
        tripDetails.setCreatedAt(LocalDateTime.now());

        return tripRepository.save(tripDetails);
    }

    @Transactional
    public Trip dispatchTrip(Long id) {
        Trip trip = getTripById(id);
        if (trip.getStatus() != TripStatus.Draft) {
            throw new IllegalStateException("Only Draft trips can be dispatched");
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        vehicle.setStatus(VehicleStatus.On_Trip);
        driver.setStatus(DriverStatus.On_Trip);

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);

        trip.setStatus(TripStatus.Dispatched);
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip completeTrip(Long id, Double actualDistance, Double fuelConsumed) {
        Trip trip = getTripById(id);
        if (trip.getStatus() != TripStatus.Dispatched) {
            throw new IllegalStateException("Only Dispatched trips can be Completed");
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        vehicle.setStatus(VehicleStatus.Available);
        driver.setStatus(DriverStatus.Available);

        vehicle.setOdometer(vehicle.getOdometer() + actualDistance);

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);

        trip.setActualDistance(actualDistance);
        trip.setFuelConsumed(fuelConsumed);
        trip.setStatus(TripStatus.Completed);

        return tripRepository.save(trip);
    }

    @Transactional
    public Trip cancelTrip(Long id) {
        Trip trip = getTripById(id);

        if (trip.getStatus() == TripStatus.Dispatched) {
            Vehicle vehicle = trip.getVehicle();
            Driver driver = trip.getDriver();

            if (vehicle.getStatus() == VehicleStatus.On_Trip) {
                vehicle.setStatus(VehicleStatus.Available);
            }
            if (driver.getStatus() == DriverStatus.On_Trip) {
                driver.setStatus(DriverStatus.Available);
            }

            vehicleRepository.save(vehicle);
            driverRepository.save(driver);
        }

        trip.setStatus(TripStatus.Cancelled);
        return tripRepository.save(trip);
    }
}