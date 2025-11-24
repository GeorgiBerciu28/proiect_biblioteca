package com.example.backend.controller;

import com.example.backend.dto.BorrowRequest;
import com.example.backend.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/borrow")
@CrossOrigin(origins = "http://localhost:5173")
public class BorrowController {

    @Autowired
    private BookService bookService;

    @PostMapping
    public ResponseEntity<?> borrowBooks(@RequestBody BorrowRequest request) {
        return ResponseEntity.ok(bookService.borrowBooks(request));
    }
}
