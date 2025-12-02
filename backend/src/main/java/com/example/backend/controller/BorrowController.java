package com.example.backend.controller;

import com.example.backend.model.Borrow;
import com.example.backend.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrows")
@CrossOrigin(origins = "http://localhost:5173")
public class BorrowController {

    @Autowired
    private BorrowService borrowService;

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
}