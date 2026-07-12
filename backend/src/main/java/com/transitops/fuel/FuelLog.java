package com.transitops.fuel;

import com.transitops.vehicle.Vehicle;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "fuel_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FuelLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private Double liters;

    @Column(nullable = false)
    private Double cost;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;
}