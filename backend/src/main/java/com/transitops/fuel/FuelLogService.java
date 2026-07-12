package com.transitops.fuel;

import com.transitops.vehicle.Vehicle;
import com.transitops.vehicle.VehicleRepository;
import com.transitops.expense.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class FuelLogService {

    private final FuelLogRepository fuelLogRepository;
    private final VehicleRepository vehicleRepository;
    private final ExpenseService expenseService;

    @Transactional
    public FuelLog addFuelLog(Long vehicleId, Double liters, Double cost, LocalDate date) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle ID not found: " + vehicleId));

        FuelLog fuelLog = FuelLog.builder()
                .vehicle(vehicle)
                .liters(liters)
                .cost(cost)
                .logDate(date)
                .build();

        FuelLog savedLog = fuelLogRepository.save(fuelLog);

        // Record auto-generated fuel expense
        expenseService.recordExpense(
                vehicle,
                "Fuel",
                cost,
                date,
                "Auto-generated from Fuel Log (" + liters + " L)"
        );

        return savedLog;
    }
}