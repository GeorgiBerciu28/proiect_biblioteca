package com.example.backend.controller;

import com.example.backend.dto.AddBookRequest;
import com.example.backend.model.Book;
import com.example.backend.repository.BookRepository;
import com.example.backend.repository.BorrowRepository;
import com.example.backend.repository.FavoriteRepository;
import com.example.backend.service.BorrowService;
import com.example.backend.service.BookService;

import com.example.backend.strategy.BookSortContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "http://localhost:5173")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookService bookService;

    @Autowired
    private BorrowService borrowService;
    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private BookSortContext bookSortContext;

    private static final String UPLOAD_DIR = "uploads/";


    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addBook(
            @RequestPart("data") AddBookRequest data,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "pdf", required = false) MultipartFile pdf
    ) {
        try {
            String fileName = null;

            if (image != null && !image.isEmpty()) {
                fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path imagePath = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(imagePath.getParent());
                Files.write(imagePath, image.getBytes());
            }

            String pdfName = null;

            if (pdf != null && !pdf.isEmpty()) {
                pdfName = System.currentTimeMillis() + "_" + pdf.getOriginalFilename();
                Path pdfPath = Paths.get(UPLOAD_DIR + pdfName);
                Files.createDirectories(pdfPath.getParent());
                Files.write(pdfPath, pdf.getBytes());
            }


            Book book = new Book();
            book.setTitle(data.getTitle());
            book.setAuthor(data.getAuthor());
            book.setYear(data.getYear());
            book.setDescription(data.getDescription());
            book.setStatus(data.getStatus());
            book.setImage(fileName);
            book.setCategories(data.getCategories());
            book.setStock(data.getStock());
            book.setPdf(pdfName);


            bookRepository.save(book);
            return ResponseEntity.ok("Cartea a fost adaugată!");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la încărcare");
        }
    }


    @GetMapping
    public ResponseEntity<?> getAllBooks() {
        try {
            return ResponseEntity.ok(bookRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la încărcarea cărților.");
        }
    }


    @GetMapping("/category/{category}")
    public List<Book> getBooksByCategory(@PathVariable String category) {
        return bookRepository.findByCategory(category);
    }


    @GetMapping("/search")
    public ResponseEntity<?> searchBooks(@RequestParam String query) {
        try {
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.ok(bookRepository.findAll());
            }

            List<Book> results = bookRepository.searchBooks(query.toLowerCase());
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la căutare: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            Book book = bookRepository.findById(id).orElse(null);

            if (book == null) {
                return ResponseEntity.status(404).body("Cartea nu există.");
            }


            long activeBorrows = borrowRepository.countByBookIdAndStatus(id, "active");
            if (activeBorrows > 0) {
                return ResponseEntity.status(400)
                        .body("Nu poți șterge o carte care este încă împrumutată!");
            }


            favoriteRepository.deleteByBookId(id);


            bookRepository.deleteById(id);

            return ResponseEntity.ok("Cartea a fost ștearsă.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Eroare la ștergere: " + e.getMessage());
        }
    }




    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateBook(
            @PathVariable Long id,
            @RequestPart("data") AddBookRequest data,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "pdf", required = false) MultipartFile pdf
    ) {
        try {
            Book book = bookRepository.findById(id).orElse(null);

            if (book == null)
                return ResponseEntity.status(404).body("Cartea nu există.");

            if (!book.getStatus().equals("disponibil")) {
                return ResponseEntity.status(400).body("Nu poți modifica o carte împrumutată!");
            }

            book.setCategories(data.getCategories());
            book.setDescription(data.getDescription());
            book.setStatus(data.getStatus());
            book.setStock(data.getStock());
            if (image != null && !image.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path imagePath = Paths.get("uploads/" + fileName);
                Files.createDirectories(imagePath.getParent());
                Files.write(imagePath, image.getBytes());
                book.setImage(fileName);
            }
            if (pdf != null && !pdf.isEmpty()) {
                String pdfName = System.currentTimeMillis() + "_" + pdf.getOriginalFilename();
                Path pdfPath = Paths.get(UPLOAD_DIR + pdfName);
                Files.createDirectories(pdfPath.getParent());
                Files.write(pdfPath, pdf.getBytes());
                book.setPdf(pdfName);
            }


            bookRepository.save(book);
            return ResponseEntity.ok("Cartea a fost actualizată!");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la actualizare.");
        }
    }


    @PostMapping("/borrow")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<String> borrowBooks(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());

            @SuppressWarnings("unchecked")
            List<Integer> intIds = (List<Integer>) request.get("bookIds");
            List<Long> bookIds = intIds.stream().map(Integer::longValue).toList();

            borrowService.createMultipleBorrows(userId, bookIds);

            return ResponseEntity.ok("Împrumut efectuat cu succes!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Eroare la împrumut: " + e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookById(@PathVariable Long id) {
        try {
            Book book = bookRepository.findById(id).orElse(null);

            if (book == null) {
                return ResponseEntity.status(404).body("Cartea nu există.");
            }

            return ResponseEntity.ok(book);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la încărcarea cărții.");
        }
    }
    @GetMapping("/sorted")
    public ResponseEntity<?> getSortedBooks(@RequestParam(defaultValue = "sortByTitle") String sort) {
        List<Book> books = bookRepository.findAll();
        List<Book> sortedBooks = bookSortContext.executeStrategy(sort, books);
        return ResponseEntity.ok(sortedBooks);
    }

}
