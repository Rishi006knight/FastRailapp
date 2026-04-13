package com.example.backend.service;

import com.example.backend.model.Train;
import com.example.backend.repository.TrainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainService {

    private final TrainRepository trainRepository;

    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }

    public Train getTrainById(String id) {
        return trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found"));
    }

    public List<Train> searchTrains(String source, String destination) {
        if (source != null && !source.isEmpty() && destination != null && !destination.isEmpty()) {
            return trainRepository.findBySourceContainingIgnoreCaseAndDestinationContainingIgnoreCase(source, destination);
        } else if (source != null && !source.isEmpty()) {
            return trainRepository.findBySourceContainingIgnoreCase(source);
        } else if (destination != null && !destination.isEmpty()) {
            return trainRepository.findByDestinationContainingIgnoreCase(destination);
        }
        return trainRepository.findAll();
    }

    public Train createTrain(Train train) {
        if (trainRepository.existsByTrainNumber(train.getTrainNumber())) {
            throw new RuntimeException("Train with this number already exists");
        }
        train.setAvailableSeats(train.getTotalSeats());
        return trainRepository.save(train);
    }

    public Train updateTrain(String id, Train trainUpdate) {
        Train existing = getTrainById(id);
        existing.setTrainNumber(trainUpdate.getTrainNumber());
        existing.setName(trainUpdate.getName());
        existing.setSource(trainUpdate.getSource());
        existing.setDestination(trainUpdate.getDestination());
        existing.setDepartureTime(trainUpdate.getDepartureTime());
        existing.setArrivalTime(trainUpdate.getArrivalTime());
        existing.setTotalSeats(trainUpdate.getTotalSeats());
        existing.setAvailableSeats(trainUpdate.getAvailableSeats());
        existing.setPrice(trainUpdate.getPrice());
        existing.setDaysOfOperation(trainUpdate.getDaysOfOperation());
        return trainRepository.save(existing);
    }

    public void deleteTrain(String id) {
        if (!trainRepository.existsById(id)) {
            throw new RuntimeException("Train not found");
        }
        trainRepository.deleteById(id);
    }
}
