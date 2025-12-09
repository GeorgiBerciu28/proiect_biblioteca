package com.example.backend.repository;

import com.example.backend.model.Borrow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {
    List<Borrow> findByUserIdOrderByIdDesc(Long userId);
    List<Borrow> findByStatus(String status);

    List<Borrow> findByUserIdAndStatus(Long userId, String status);
    @Query("""
       SELECT b, COUNT(br) 
       FROM Book b 
       JOIN Borrow br ON b.id = br.bookId 
       GROUP BY b.id 
       HAVING COUNT(br) >= :minReads 
       ORDER BY COUNT(br) DESC
       """)
    List<Object[]> findMostReadBooks(@Param("minReads") long minReads);
    long countByBookIdAndStatus(Long bookId, String status);

}