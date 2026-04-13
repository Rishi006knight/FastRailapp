package com.example.backend.repository;

import com.example.backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByTrainId(String trainId);
    List<Booking> findByStatus(String status);
    long countByStatus(String status);
}
