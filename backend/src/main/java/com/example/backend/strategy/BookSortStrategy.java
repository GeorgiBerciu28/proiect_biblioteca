package com.example.backend.strategy;

import com.example.backend.model.Book;
import java.util.List;

public interface BookSortStrategy {
    List<Book> sort(List<Book> books);
}
