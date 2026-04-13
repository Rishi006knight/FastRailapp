package com.example.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BookingRequest {
    @NotBlank(message = "Train ID is required")
    private String trainId;

    @NotBlank(message = "Passenger name is required")
    private String passengerName;

    @Min(value = 1, message = "Age must be at least 1")
    private int passengerAge;

    @NotBlank(message = "Travel date is required")
    private String travelDate;

    @NotBlank(message = "User ID is required")
    private String userId;
}
