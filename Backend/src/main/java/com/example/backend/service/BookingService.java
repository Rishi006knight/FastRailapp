package com.example.backend.service;

import com.example.backend.dto.BookingRequest;
import com.example.backend.model.Booking;
import com.example.backend.model.Train;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.TrainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TrainRepository trainRepository;

    public Booking createBooking(BookingRequest request) {
        Train train = trainRepository.findById(request.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        if (train.getAvailableSeats() <= 0) {
            throw new RuntimeException("No seats available on this train");
        }

        // Decrement available seats
        train.setAvailableSeats(train.getAvailableSeats() - 1);
        trainRepository.save(train);

        // Create booking
        Booking booking = new Booking();
        booking.setUserId(request.getUserId());
        booking.setTrainId(train.getId());
        booking.setTrainNumber(train.getTrainNumber());
        booking.setTrainName(train.getName());
        booking.setSource(train.getSource());
        booking.setDestination(train.getDestination());
        booking.setDepartureTime(train.getDepartureTime());
        booking.setArrivalTime(train.getArrivalTime());
        booking.setPassengerName(request.getPassengerName());
        booking.setPassengerAge(request.getPassengerAge());
        booking.setSeatNumber("S" + (train.getTotalSeats() - train.getAvailableSeats()));
        booking.setBookingDate(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        booking.setTravelDate(request.getTravelDate());
        booking.setPrice(train.getPrice());
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking cancelBooking(String bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus("CANCELLED");

        // Restore seat
        Train train = trainRepository.findById(booking.getTrainId()).orElse(null);
        if (train != null) {
            train.setAvailableSeats(train.getAvailableSeats() + 1);
            trainRepository.save(train);
        }

        return bookingRepository.save(booking);
    }
}
