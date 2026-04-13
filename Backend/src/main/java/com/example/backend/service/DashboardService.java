package com.example.backend.service;

import com.example.backend.dto.DashboardStats;
import com.example.backend.model.Booking;
import com.example.backend.model.Train;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.TrainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final TrainRepository trainRepository;

    public DashboardStats getStats() {
        List<Booking> allBookings = bookingRepository.findAll();
        List<Train> allTrains = trainRepository.findAll();

        long totalBookings = allBookings.size();
        long confirmedBookings = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus())).count();
        long cancelledBookings = allBookings.stream()
                .filter(b -> "CANCELLED".equals(b.getStatus())).count();

        double totalRevenue = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .mapToDouble(Booking::getPrice)
                .sum();

        int totalSeats = allTrains.stream().mapToInt(Train::getTotalSeats).sum();
        int occupiedSeats = allTrains.stream()
                .mapToInt(t -> t.getTotalSeats() - t.getAvailableSeats()).sum();
        double avgOccupancy = totalSeats > 0 ?
                Math.round((double) occupiedSeats / totalSeats * 10000.0) / 100.0 : 0;

        return new DashboardStats(
                totalBookings,
                totalRevenue,
                avgOccupancy,
                allTrains.size(),
                confirmedBookings,
                cancelledBookings,
                0 // pending - not used currently
        );
    }
}
