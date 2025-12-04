package com.example.backend.controller;

import com.example.backend.model.Book;
import com.example.backend.model.Borrow;
import com.example.backend.repository.BookRepository;
import com.example.backend.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrows")
@CrossOrigin(origins = "http://localhost:5173")
public class BorrowController {

    @Autowired
    private BorrowService borrowService;
    @Autowired
    private BookRepository bookRepository;
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Borrow>> getUserBorrowHistory(@PathVariable Long userId) {
        List<Borrow> history = borrowService.getBorrowHistoryByUserId(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Borrow>> getActiveBorrows() {
        List<Borrow> activeBorrows = borrowService.getActiveBorrows();
        return ResponseEntity.ok(activeBorrows);
    }

    @PutMapping("/{borrowId}/return")
    public ResponseEntity<String> returnBook(@PathVariable Long borrowId) {
        try {
            borrowService.returnBook(borrowId);
            return ResponseEntity.ok("Cartea a fost returnată cu succes!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Eroare: " + e.getMessage());
        }
    }
    @GetMapping("/most-read")
    public ResponseEntity<List<Map<String, Object>>> getMostReadBooks(
            @RequestParam(defaultValue = "1") long minReads) {

        List<Object[]> result = borrowService.getMostReadBooks(minReads);

        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : result) {
            Book book = (Book) row[0];
            Long count = (Long) row[1];

            Map<String, Object> entry = new HashMap<>();
            entry.put("book", book);
            entry.put("count", count);

            response.add(entry);
        }

        return ResponseEntity.ok(response);
    }


}