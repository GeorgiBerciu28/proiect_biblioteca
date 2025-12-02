package com.example.backend.service;

import com.example.backend.model.Borrow;
import com.example.backend.model.Book;
import com.example.backend.repository.BorrowRepository;
import com.example.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BorrowService {

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private BookRepository bookRepository;


    @Transactional
    public Borrow createBorrow(Long userId, Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Cartea nu a fost găsită"));

        if (!"disponibil".equals(book.getStatus())) {
            throw new RuntimeException("Cartea nu este disponibilă");
        }

        Borrow borrow = new Borrow(
                userId,
                bookId,
                book.getTitle(),
                book.getAuthor(),
                book.getImage()
        );

        book.setStatus("imprumutat");
        bookRepository.save(book);

        return borrowRepository.save(borrow);
    }


    public Borrow getBorrowById(Long borrowId) {
        return borrowRepository.findById(borrowId)
                .orElseThrow(() -> new RuntimeException("Împrumutul nu a fost găsit"));
    }


    public Borrow saveBorrow(Borrow borrow) {
        return borrowRepository.save(borrow);
    }

    public List<Borrow> getBorrowHistoryByUserId(Long userId) {
        return borrowRepository.findByUserIdOrderByBorrowDateDesc(userId);
    }

    public List<Borrow> getActiveBorrows() {
        return borrowRepository.findByStatus("active");
    }

    @Transactional
    public void returnBook(Long borrowId) {
        Borrow borrow = borrowRepository.findById(borrowId)
                .orElseThrow(() -> new RuntimeException("Împrumutul nu a fost găsit"));

        if ("returned".equals(borrow.getStatus())) {
            throw new RuntimeException("Cartea a fost deja returnată");
        }

        borrow.setStatus("returned");
        borrow.setReturnDate(LocalDateTime.now());
        borrowRepository.save(borrow);

        Book book = bookRepository.findById(borrow.getBookId())
                .orElseThrow(() -> new RuntimeException("Cartea nu a fost găsită"));
        book.setStatus("disponibil");
        bookRepository.save(book);
    }

    @Transactional
    public void createMultipleBorrows(Long userId, List<Long> bookIds) {
        for (Long bookId : bookIds) {
            createBorrow(userId, bookId);
        }
    }
}