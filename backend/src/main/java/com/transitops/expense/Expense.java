package com.transitops.expense;

import com.transitops.vehicle.Vehicle;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @NotBlank
    @Column(nullable = false)
    private String type;

    @NotNull
    @Column(nullable = false)
    private Double amount;

    @NotNull
    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    private String description;
}