package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "trains")
public class Train {
    @Id
    private String id;

    @Indexed(unique = true)
    private String trainNumber;

    private String name;
    private String source;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    private int totalSeats;
    private int availableSeats;
    private double price;
    private List<String> daysOfOperation;
}
