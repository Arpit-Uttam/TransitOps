package com.transitops.expense;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<Expense>> getAll() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @PostMapping
    public ResponseEntity<Expense> record(@RequestParam Long vehicleId,
                                          @RequestParam String type,
                                          @RequestParam Double amount,
                                          @RequestParam String description) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(expenseService.recordManualExpense(
                        vehicleId,
                        type,
                        amount,
                        description
                ));
    }
}