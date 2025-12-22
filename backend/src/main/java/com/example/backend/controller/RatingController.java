package com.example.backend.controller;

import com.example.backend.model.Book;
import com.example.backend.model.Rating;
import com.example.backend.repository.BookRepository;
import com.example.backend.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "http://localhost:5173")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private BookRepository bookRepository;


    @PostMapping("/save")
    public ResponseEntity<?> saveRating(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long bookId = Long.valueOf(request.get("bookId").toString());
            int ratingValue = Integer.parseInt(request.get("rating").toString());

            if (ratingValue < 1 || ratingValue > 5) {
                return ResponseEntity.badRequest().body("Rating trebuie să fie între 1 și 5!");
            }


            Optional<Rating> existing = ratingRepository.findByUserIdAndBookId(userId, bookId);

            if (existing.isPresent()) {

                Rating rating = existing.get();
                rating.setRating(ratingValue);
                ratingRepository.save(rating);
            } else {

                Rating rating = new Rating(userId, bookId, ratingValue);
                ratingRepository.save(rating);
            }

            return ResponseEntity.ok("Rating salvat cu succes!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Eroare la salvarea rating-ului: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/book/{bookId}")
    public ResponseEntity<?> getUserRating(@PathVariable Long userId, @PathVariable Long bookId) {
        Optional<Rating> rating = ratingRepository.findByUserIdAndBookId(userId, bookId);

        if (rating.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("rating", rating.get().getRating());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.ok(Collections.singletonMap("rating", 0));
    }

    @GetMapping("/book/{bookId}/average")
    public ResponseEntity<?> getAverageRating(@PathVariable Long bookId) {
        List<Rating> ratings = ratingRepository.findByBookId(bookId);

        if (ratings.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("average", 0.0);
            response.put("count", 0);
            return ResponseEntity.ok(response);
        }

        double average = ratings.stream()
                .mapToInt(Rating::getRating)
                .average()
                .orElse(0.0);

        Map<String, Object> response = new HashMap<>();
        response.put("average", average);
        response.put("count", ratings.size());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/top-rated")
    public ResponseEntity<?> getTopRatedBooks(@RequestParam(defaultValue = "1") long minRatings) {
        try {
            List<Object[]> result = ratingRepository.findTopRatedBooks(minRatings);

            List<Map<String, Object>> response = new ArrayList<>();

            for (Object[] row : result) {
                Long bookId = ((Number) row[0]).longValue();
                Double avgRating = (Double) row[1];
                Long ratingCount = ((Number) row[2]).longValue();

                Optional<Book> bookOpt = bookRepository.findById(bookId);

                if (bookOpt.isPresent()) {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("book", bookOpt.get());
                    entry.put("averageRating", avgRating);
                    entry.put("ratingCount", ratingCount);
                    response.add(entry);
                }
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Eroare la încărcarea cărților recomandate");
        }
    }
}