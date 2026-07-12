package com.transitops.report;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/roi")
    public ResponseEntity<List<Map<String, Object>>> getRoiReport() {
        return ResponseEntity.ok(reportService.generateRoiReport());
    }

    @GetMapping("/export/csv")
    public void exportCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=fleet_roi_report.csv"
        );

        reportService.streamRoiReportCsv(response.getWriter());
    }
}