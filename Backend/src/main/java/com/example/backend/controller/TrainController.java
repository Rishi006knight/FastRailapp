package com.example.backend.controller;

import com.example.backend.model.Train;
import com.example.backend.service.TrainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
@RequiredArgsConstructor
public class TrainController {

    private final TrainService trainService;

    @GetMapping
    public ResponseEntity<List<Train>> getAllTrains() {
        return ResponseEntity.ok(trainService.getAllTrains());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Train> getTrainById(@PathVariable String id) {
        return ResponseEntity.ok(trainService.getTrainById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Train>> searchTrains(
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String destination) {
        return ResponseEntity.ok(trainService.searchTrains(source, destination));
    }

    @PostMapping
    public ResponseEntity<Train> createTrain(@RequestBody Train train) {
        return ResponseEntity.ok(trainService.createTrain(train));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Train> updateTrain(@PathVariable String id, @RequestBody Train train) {
        return ResponseEntity.ok(trainService.updateTrain(id, train));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrain(@PathVariable String id) {
        trainService.deleteTrain(id);
        return ResponseEntity.ok().build();
    }
}
