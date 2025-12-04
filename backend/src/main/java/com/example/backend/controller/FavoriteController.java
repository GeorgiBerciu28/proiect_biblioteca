package com.example.backend.controller;

import com.example.backend.model.Favorite;
import com.example.backend.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController

@RequestMapping("/favorites")

public class FavoriteController {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addFavorite(@RequestBody Map<String, Long> req) {
        Long userId = req.get("userId");
        Long bookId = req.get("bookId");

        if (favoriteRepository.existsByUserIdAndBookId(userId, bookId)) {
            return ResponseEntity.status(400).body("Cartea este deja în favorite!");
        }

        favoriteRepository.save(new Favorite(userId, bookId));
        return ResponseEntity.ok("Adăugată la favorite!");
    }

    @GetMapping("/{userId}")
    public List<Favorite> getFavorites(@PathVariable Long userId) {
        return favoriteRepository.findByUserId(userId);
    }
    @PostMapping("/remove")
    public ResponseEntity<?> removeFavorite(@RequestBody Map<String, Long> req) {
        Long userId = req.get("userId");
        Long bookId = req.get("bookId");

        Favorite fav = favoriteRepository.findByUserIdAndBookId(userId, bookId);
        if (fav == null) {
            return ResponseEntity.status(404).body("Nu este în favorite!");
        }

        favoriteRepository.delete(fav);
        return ResponseEntity.ok("Șters din favorite!");
    }

}
