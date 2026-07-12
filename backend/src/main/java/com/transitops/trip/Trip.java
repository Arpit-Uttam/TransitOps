package com.transitops.trip;

import com.transitops.driver.Driver;
import com.transitops.vehicle.Vehicle;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String source;

    @NotBlank
    @Column(nullable = false)
    private String destination;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(optional = false)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @NotNull
    @Column(name = "cargo_weight", nullable = false)
    private Double cargoWeight;

    @NotNull
    @Column(name = "planned_distance", nullable = false)
    private Double plannedDistance;

    @Column(name = "actual_distance")
    private Double actualDistance;

    @Column(name = "fuel_consumed")
    private Double fuelConsumed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripStatus status = TripStatus.Draft;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Trip() {
    }

    public Trip(Long id, String source, String destination, Vehicle vehicle, Driver driver,
                Double cargoWeight, Double plannedDistance, Double actualDistance,
                Double fuelConsumed, TripStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.source = source;
        this.destination = destination;
        this.vehicle = vehicle;
        this.driver = driver;
        this.cargoWeight = cargoWeight;
        this.plannedDistance = plannedDistance;
        this.actualDistance = actualDistance;
        this.fuelConsumed = fuelConsumed;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public Double getCargoWeight() {
        return cargoWeight;
    }

    public void setCargoWeight(Double cargoWeight) {
        this.cargoWeight = cargoWeight;
    }

    public Double getPlannedDistance() {
        return plannedDistance;
    }

    public void setPlannedDistance(Double plannedDistance) {
        this.plannedDistance = plannedDistance;
    }

    public Double getActualDistance() {
        return actualDistance;
    }

    public void setActualDistance(Double actualDistance) {
        this.actualDistance = actualDistance;
    }

    public Double getFuelConsumed() {
        return fuelConsumed;
    }

    public void setFuelConsumed(Double fuelConsumed) {
        this.fuelConsumed = fuelConsumed;
    }

    public TripStatus getStatus() {
        return status;
    }

    public void setStatus(TripStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}