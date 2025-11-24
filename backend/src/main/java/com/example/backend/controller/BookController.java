package com.example.backend.controller;

import com.example.backend.dto.AddBookRequest;
import com.example.backend.dto.BorrowRequest;
import com.example.backend.model.Book;
import com.example.backend.repository.BookRepository;

import com.example.backend.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "http://localhost:5173") // frontend vite
public class BookController {

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private BookService bookService;

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addBook(
            @RequestPart("data") AddBookRequest data,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
            String fileName = null;

            if (image != null && !image.isEmpty()) {
                fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path imagePath = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(imagePath.getParent());
                Files.write(imagePath, image.getBytes());
            }

            Book book = new Book(
                    data.getTitle(),
                    data.getAuthor(),
                    data.getYear(),
                    data.getType(),
                    data.getDescription(),
                    data.getStatus(),
                    fileName
            );

            bookRepository.save(book);

            return ResponseEntity.ok("Cartea a fost adaugată!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Eroare la încărcare");
        }
    }
    @GetMapping
    public ResponseEntity<?> getAllBooks() {
        try {
            return ResponseEntity.ok(bookRepository.findAll());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Eroare la încărcarea cărților.");
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            Book book = bookRepository.findById(id).orElse(null);

            if (book == null) {
                return ResponseEntity.status(404).body("Cartea nu există.");
            }

            if (!book.getStatus().equals("disponibil")) {
                return ResponseEntity.status(400).body("Nu poți șterge o carte împrumutată!");
            }

            bookRepository.deleteById(id);
            return ResponseEntity.ok("Cartea a fost ștearsă.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Eroare la ștergere.");
        }
    }
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateBook(
            @PathVariable Long id,
            @RequestPart("data") AddBookRequest data,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
            Book book = bookRepository.findById(id)
                    .orElse(null);

            if (book == null) {
                return ResponseEntity.status(404).body("Cartea nu există.");
            }


            book.setType(data.getType());
            book.setDescription(data.getDescription());
            book.setStatus(data.getStatus());

            // Dacă se trimite o imagine nouă — o salvăm
            if (image != null && !image.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path imagePath = Paths.get("uploads/" + fileName);
                Files.createDirectories(imagePath.getParent());
                Files.write(imagePath, image.getBytes());

                book.setImage(fileName); // actualizăm imaginea
            }

            bookRepository.save(book);
            return ResponseEntity.ok("Cartea a fost actualizată!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Eroare la actualizare.");
        }
    }
    @PostMapping
    public ResponseEntity<?> borrowBooks(@RequestBody BorrowRequest request) {
        return ResponseEntity.ok(bookService.borrowBooks(request));
    }

}
