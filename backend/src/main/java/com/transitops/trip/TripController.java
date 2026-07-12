package com.transitops.trip;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public ResponseEntity<List<Trip>> getTrips(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(tripService.searchTrips(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        Trip created = tripService.createTrip(trip);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}/dispatch")
    public ResponseEntity<Trip> dispatchTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.dispatchTrip(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Trip> completeTrip(@PathVariable Long id,
                                             @RequestParam Double actualDistance,
                                             @RequestParam Double fuelConsumed) {
        return ResponseEntity.ok(tripService.completeTrip(id, actualDistance, fuelConsumed));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Trip> cancelTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.cancelTrip(id));
    }
}
