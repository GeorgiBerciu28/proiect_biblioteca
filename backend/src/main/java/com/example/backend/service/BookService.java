package com.example.backend.service;

import com.example.backend.dto.BorrowRequest;
import com.example.backend.model.Book;
import com.example.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public Book saveBook(Book book) {
        if (book.getStock() == 0) {
            book.setStatus("indisponibil");
        } else if (!book.getStatus().equalsIgnoreCase("imprumutat")) {
            book.setStatus("disponibil");
        }
        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
    public String borrowBooks(BorrowRequest request) {

        for (Long bookId : request.getBookIds()) {

            Optional<Book> bookOpt = bookRepository.findById(bookId);

            if (bookOpt.isEmpty()) {
                return "Cartea cu ID " + bookId + " nu există!";
            }

            Book book = bookOpt.get();

            if (!book.getStatus().equalsIgnoreCase("disponibil")) {
                return "Cartea " + book.getTitle() + " NU este disponibilă!";
            }

            book.setStatus("imprumutat");
            bookRepository.save(book);
        }

        return "Împrumut realizat!";
    }


}
