package com.transitops.vehicle;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehicles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
