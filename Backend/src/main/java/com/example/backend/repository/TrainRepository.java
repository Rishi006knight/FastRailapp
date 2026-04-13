package com.example.backend.repository;

import com.example.backend.model.Train;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface TrainRepository extends MongoRepository<Train, String> {
    List<Train> findBySourceContainingIgnoreCaseAndDestinationContainingIgnoreCase(String source, String destination);
    List<Train> findBySourceContainingIgnoreCase(String source);
    List<Train> findByDestinationContainingIgnoreCase(String destination);
    Optional<Train> findByTrainNumber(String trainNumber);
    boolean existsByTrainNumber(String trainNumber);
}
