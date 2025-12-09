package com.example.backend.dto;

import java.util.List;

public class BorrowRequest {
    public Long userId;
    public List<Long> bookIds;

    public Long getUserId() {
        return userId;
    }

    public List<Long> getBookIds() {
        return bookIds;
    }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setBookIds(List<Long> bookIds) { this.bookIds = bookIds; }
}
