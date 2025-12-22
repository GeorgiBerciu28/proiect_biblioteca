package com.example.backend.repository;

import com.example.backend.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByUserIdAndBookId(Long userId, Long bookId);

    List<Rating> findByBookId(Long bookId);

    @Query("""
        SELECT r.bookId, AVG(r.rating), COUNT(r) 
        FROM Rating r 
        GROUP BY r.bookId 
        HAVING COUNT(r) >= :minRatings 
        ORDER BY AVG(r.rating) DESC, COUNT(r) DESC
    """)
    List<Object[]> findTopRatedBooks(@Param("minRatings") long minRatings);
}