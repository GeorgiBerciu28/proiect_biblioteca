package com.example.backend.repository;

import com.example.backend.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    boolean existsByUserIdAndBookId(Long userId, Long bookId);
    Favorite findByUserIdAndBookId(Long userId, Long bookId);
    void deleteByBookId(Long bookId);
}
