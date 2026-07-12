package com.transitops.fuel;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/fuel")
@RequiredArgsConstructor
public class FuelLogController {

    private final FuelLogService fuelLogService;

    @PostMapping
    public ResponseEntity<FuelLog> addFuelLog(@RequestParam Long vehicleId,
                                              @RequestParam Double liters,
                                              @RequestParam Double cost) {
        FuelLog created = fuelLogService.addFuelLog(vehicleId, liters, cost, LocalDate.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}