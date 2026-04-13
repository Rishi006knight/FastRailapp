package com.example.backend.config;

import com.example.backend.model.Train;
import com.example.backend.model.User;
import com.example.backend.repository.TrainRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TrainRepository trainRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) {
        initializeAdmin();
        initializeTrains();
    }

    private void initializeAdmin() {
        if (!userRepository.existsByEmail("admin@fastrail.com")) {
            User admin = new User();
            admin.setEmail("admin@fastrail.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setName("Admin User");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            log.info("✅ Admin user created: admin@fastrail.com / admin123");
        }

        if (!userRepository.existsByEmail("user@fastrail.com")) {
            User user = new User();
            user.setEmail("user@fastrail.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setName("Rajesh Kumar");
            user.setRole("USER");
            userRepository.save(user);
            log.info("✅ Demo user created: user@fastrail.com / user123");
        }
    }

    private void initializeTrains() {
        if (trainRepository.count() == 0) {
            List<String> allDays = Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
            List<String> weekdays = Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday");

            List<Train> trains = Arrays.asList(
                new Train(null, "12301", "Howrah Rajdhani Express", "Kolkata", "New Delhi",
                        "16:50", "09:55", 450, 320, 1850.0, allDays),

                new Train(null, "12951", "Mumbai Rajdhani Express", "Mumbai Central", "New Delhi",
                        "16:35", "08:35", 500, 275, 2150.0, allDays),

                new Train(null, "12002", "Bhopal Shatabdi Express", "New Delhi", "Bhopal",
                        "06:00", "14:35", 380, 245, 1250.0, weekdays),

                new Train(null, "12627", "Karnataka Express", "Bangalore", "New Delhi",
                        "19:20", "05:00", 420, 310, 1800.0, allDays),

                new Train(null, "22436", "Vande Bharat Express", "Varanasi", "New Delhi",
                        "06:00", "14:00", 320, 180, 1750.0,
                        Arrays.asList("Monday", "Wednesday", "Friday", "Sunday")),

                new Train(null, "12621", "Tamil Nadu Express", "Chennai Central", "New Delhi",
                        "22:00", "07:30", 480, 350, 1650.0, allDays),

                new Train(null, "12859", "Gitanjali Express", "Mumbai CSMT", "Howrah",
                        "06:00", "20:05", 400, 260, 1450.0, allDays),

                new Train(null, "12124", "Deccan Queen Express", "Mumbai CSMT", "Pune",
                        "17:10", "20:25", 280, 195, 350.0, weekdays)
            );

            trainRepository.saveAll(trains);
            log.info("✅ Seeded {} trains into MongoDB", trains.size());
        } else {
            log.info("ℹ️ Trains already exist in database, skipping seed");
        }
    }
}
