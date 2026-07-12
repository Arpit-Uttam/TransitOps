package com.transitops.expense;

import com.transitops.vehicle.Vehicle;
import com.transitops.vehicle.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final VehicleRepository vehicleRepository;

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @Transactional
    public Expense recordExpense(Vehicle vehicle, String type, Double amount, LocalDate date, String description) {
        Expense expense = Expense.builder()
                .vehicle(vehicle)
                .type(type)
                .amount(amount)
                .expenseDate(date)
                .description(description)
                .build();
        return expenseRepository.save(expense);
    }

    @Transactional
    public Expense recordManualExpense(Long vehicleId, String type, Double amount, String description) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle ID not found"));

        return recordExpense(vehicle, type, amount, LocalDate.now(), description);
    }
}