package com.transitops.report;

import com.transitops.expense.Expense;
import com.transitops.expense.ExpenseRepository;
import com.transitops.fuel.FuelLogService;
import com.transitops.vehicle.Vehicle;
import com.transitops.vehicle.VehicleRepository;
import com.transitops.vehicle.VehicleStatus;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@SpringBootTest
@Transactional
public class ReportServiceTest {

    @Autowired
    private FuelLogService fuelService;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Test
    public void whenFuelLogAdded_thenExpenseIsAutoCreated() {
        Vehicle car = Vehicle.builder()
                .registrationNumber("FUEL-TEST")
                .nameModel("Diesel Ranger")
                .type("Truck")
                .maxLoadCapacity(1500.0)
                .odometer(5000.0)
                .acquisitionCost(42000.0)
                .status(VehicleStatus.Available)
                .build();
        Vehicle saved = vehicleRepository.save(car);

        fuelService.addFuelLog(saved.getId(), 50.0, 110.0, LocalDate.now());

        List<Expense> expenses = expenseRepository.findByVehicleId(saved.getId());
        Assertions.assertFalse(expenses.isEmpty());
        Assertions.assertEquals("Fuel", expenses.get(0).getType());
        Assertions.assertEquals(110.0, expenses.get(0).getAmount());
    }
}
