package com.example.backend.repository;

import com.example.backend.model.Borrow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {


    List<Borrow> findByUserIdOrderByBorrowDateDesc(Long userId);


    List<Borrow> findByStatus(String status);


    List<Borrow> findByUserIdAndStatus(Long userId, String status);
}