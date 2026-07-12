package com.transitops.trip;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TripService {

    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public List<Trip> listTrips() {
        List<Trip> trips = new ArrayList<>();
        tripRepository.findAll().forEach(trips::add);
        return trips;
    }

    public Optional<Trip> getTripById(Long id) {
        return tripRepository.findById(id);
    }

    public Trip createTrip(Trip trip) {
        return tripRepository.save(trip);
    }

    public Optional<Trip> updateTrip(Long id, Trip updatedTrip) {
        return tripRepository.findById(id).map(existing -> {
            existing.setVehicle(updatedTrip.getVehicle());
            existing.setDriver(updatedTrip.getDriver());
            existing.setOrigin(updatedTrip.getOrigin());
            existing.setDestination(updatedTrip.getDestination());
            existing.setDeparts(updatedTrip.getDeparts());
            existing.setStatus(updatedTrip.getStatus());
            return tripRepository.save(existing);
        });
    }

    public boolean deleteTrip(Long id) {
        if (tripRepository.existsById(id)) {
            tripRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Trip> searchTrips(String query) {
        if (query == null || query.isBlank()) {
            return listTrips();
        }

        List<Trip> results = new ArrayList<>();
        results.addAll(tripRepository.findByDriverContainingIgnoreCase(query));
        results.addAll(tripRepository.findByVehicleContainingIgnoreCase(query));
        return results.stream().distinct().toList();
    }
}
