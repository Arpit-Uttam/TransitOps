package com.transitops.driver;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "drivers")
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(name = "license_number", unique = true, nullable = false)
    private String licenseNumber;

    @NotBlank
    @Column(name = "license_category", nullable = false)
    private String licenseCategory;

    @NotNull
    @Column(name = "license_expiry_date", nullable = false)
    private LocalDate licenseExpiryDate;

    @NotBlank
    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "safety_score")
    private Double safetyScore = 100.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverStatus status = DriverStatus.Available;

    public Driver() {
    }

    public Driver(Long id, String name, String licenseNumber, String licenseCategory,
                  LocalDate licenseExpiryDate, String contactNumber, Double safetyScore, DriverStatus status) {
        this.id = id;
        this.name = name;
        this.licenseNumber = licenseNumber;
        this.licenseCategory = licenseCategory;
        this.licenseExpiryDate = licenseExpiryDate;
        this.contactNumber = contactNumber;
        this.safetyScore = safetyScore;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getLicenseCategory() {
        return licenseCategory;
    }

    public void setLicenseCategory(String licenseCategory) {
        this.licenseCategory = licenseCategory;
    }

    public LocalDate getLicenseExpiryDate() {
        return licenseExpiryDate;
    }

    public void setLicenseExpiryDate(LocalDate licenseExpiryDate) {
        this.licenseExpiryDate = licenseExpiryDate;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public Double getSafetyScore() {
        return safetyScore;
    }

    public void setSafetyScore(Double safetyScore) {
        this.safetyScore = safetyScore;
    }

    public DriverStatus getStatus() {
        return status;
    }

    public void setStatus(DriverStatus status) {
        this.status = status;
    }
}