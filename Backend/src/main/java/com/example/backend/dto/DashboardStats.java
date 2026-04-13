package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalBookings;
    private double totalRevenue;
    private double averageOccupancy;
    private long activeTrains;
    private long confirmedBookings;
    private long cancelledBookings;
    private long pendingBookings;
}
