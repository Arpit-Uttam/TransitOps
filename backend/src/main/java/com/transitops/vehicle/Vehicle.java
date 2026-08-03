package com.transitops.vehicle;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Builder;
import lombok.Data;

@Entity
@Table(name = "vehicles")
@Data
@Builder
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "registration_number", unique = true, nullable = false)
    private String registrationNumber;

    @NotBlank
    @Column(name = "name_model", nullable = false)
    private String nameModel;

    @NotBlank
    @Column(nullable = false)
    private String type;

    @NotNull
    @PositiveOrZero
    @Column(name = "max_load_capacity", nullable = false)
    private Double maxLoadCapacity;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Double odometer;

    @NotNull
    @PositiveOrZero
    @Column(name = "acquisition_cost", nullable = false)
    private Double acquisitionCost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status = VehicleStatus.Available;

    private String region;

    public Vehicle() {
    }

    public Vehicle(Long id, String registrationNumber, String nameModel, String type,
                   Double maxLoadCapacity, Double odometer, Double acquisitionCost,
                   VehicleStatus status, String region) {
        this.id = id;
        this.registrationNumber = registrationNumber;
        this.nameModel = nameModel;
        this.type = type;
        this.maxLoadCapacity = maxLoadCapacity;
        this.odometer = odometer;
        this.acquisitionCost = acquisitionCost;
        this.status = status;
        this.region = region;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getNameModel() {
        return nameModel;
    }

    public void setNameModel(String nameModel) {
        this.nameModel = nameModel;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getMaxLoadCapacity() {
        return maxLoadCapacity;
    }

    public void setMaxLoadCapacity(Double maxLoadCapacity) {
        this.maxLoadCapacity = maxLoadCapacity;
    }

    public Double getOdometer() {
        return odometer;
    }

    public void setOdometer(Double odometer) {
        this.odometer = odometer;
    }

    public Double getAcquisitionCost() {
        return acquisitionCost;
    }

    public void setAcquisitionCost(Double acquisitionCost) {
        this.acquisitionCost = acquisitionCost;
    }

    public VehicleStatus getStatus() {
        return status;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }
}
