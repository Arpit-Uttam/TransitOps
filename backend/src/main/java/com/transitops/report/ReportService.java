package com.transitops.report;

import com.transitops.vehicle.Vehicle;
import com.transitops.vehicle.VehicleRepository;
import com.transitops.expense.Expense;
import com.transitops.expense.ExpenseRepository;
import com.transitops.trip.TripRepository;
import com.transitops.trip.TripStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final VehicleRepository vehicleRepository;
    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;

    public List<Map<String, Object>> generateRoiReport() {

        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Map<String, Object>> report = new ArrayList<>();

        for (Vehicle v : vehicles) {

            double totalFuelCost = expenseRepository.findByVehicleId(v.getId())
                    .stream()
                    .filter(e -> "Fuel".equalsIgnoreCase(e.getType()))
                    .mapToDouble(Expense::getAmount)
                    .sum();

            double totalMaintCost = expenseRepository.findByVehicleId(v.getId())
                    .stream()
                    .filter(e -> "Maintenance".equalsIgnoreCase(e.getType()))
                    .mapToDouble(Expense::getAmount)
                    .sum();

            double totalOtherCost = expenseRepository.findByVehicleId(v.getId())
                    .stream()
                    .filter(e ->
                            !"Fuel".equalsIgnoreCase(e.getType()) &&
                            !"Maintenance".equalsIgnoreCase(e.getType()))
                    .mapToDouble(Expense::getAmount)
                    .sum();

            double totalExpenses =
                    totalFuelCost +
                    totalMaintCost +
                    totalOtherCost;

            double flatRevenue = tripRepository.findAll()
                    .stream()
                    .filter(t ->
                            t.getVehicle().getId().equals(v.getId()) &&
                            t.getStatus() == TripStatus.Completed)
                    .mapToDouble(t ->
                            t.getPlannedDistance() * 2.50)
                    .sum();

            double roiVal =
                    v.getAcquisitionCost() == 0
                            ? 0.0
                            : (flatRevenue - totalExpenses)
                            / v.getAcquisitionCost();

            double totalDistance = tripRepository.findAll()
                    .stream()
                    .filter(t ->
                            t.getVehicle().getId().equals(v.getId()) &&
                            t.getStatus() == TripStatus.Completed)
                    .mapToDouble(t ->
                            t.getActualDistance() != null
                                    ? t.getActualDistance()
                                    : 0.0)
                    .sum();

            double totalFuelLiters = tripRepository.findAll()
                    .stream()
                    .filter(t ->
                            t.getVehicle().getId().equals(v.getId()) &&
                            t.getStatus() == TripStatus.Completed)
                    .mapToDouble(t ->
                            t.getFuelConsumed() != null
                                    ? t.getFuelConsumed()
                                    : 0.0)
                    .sum();

            double fuelEfficiency =
                    totalFuelLiters == 0
                            ? 0.0
                            : totalDistance / totalFuelLiters;

            Map<String, Object> data = new HashMap<>();

            data.put("vehicleId", v.getId());
            data.put("registrationNumber", v.getRegistrationNumber());
            data.put("nameModel", v.getNameModel());
            data.put("fuelCost", totalFuelCost);
            data.put("maintenanceCost", totalMaintCost);
            data.put("otherCost", totalOtherCost);
            data.put("revenue", flatRevenue);
            data.put("roi", Math.round(roiVal * 10000.0) / 10000.0);
            data.put("fuelEfficiency",
                    Math.round(fuelEfficiency * 100.0) / 100.0);

            report.add(data);
        }

        return report;
    }

    public void streamRoiReportCsv(PrintWriter writer) {

        writer.println(
                "Vehicle ID,Registration Number,Name/Model,Fuel Cost,Maintenance Cost,Other Cost,Revenue,ROI,Fuel Efficiency (km/L)"
        );

        List<Map<String, Object>> records = generateRoiReport();

        for (Map<String, Object> r : records) {

            writer.printf(
                    "%s,%s,%s,%.2f,%.2f,%.2f,%.2f,%.4f,%.2f%n",
                    r.get("vehicleId"),
                    r.get("registrationNumber"),
                    r.get("nameModel"),
                    r.get("fuelCost"),
                    r.get("maintenanceCost"),
                    r.get("otherCost"),
                    r.get("revenue"),
                    r.get("roi"),
                    r.get("fuelEfficiency")
            );
        }

        writer.flush();
    }
}