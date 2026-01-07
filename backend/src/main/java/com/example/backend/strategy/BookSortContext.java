package com.example.backend.strategy;

import com.example.backend.model.Book;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class BookSortContext {

    private final Map<String, BookSortStrategy> strategies;

    public BookSortContext(Map<String, BookSortStrategy> strategies) {
        this.strategies = strategies;
    }

    public List<Book> executeStrategy(String strategyName, List<Book> books) {
        BookSortStrategy strategy = strategies.get(strategyName);
        if (strategy == null) {
            throw new IllegalArgumentException("Strategie de sortare invalidă: " + strategyName);
        }
        return strategy.sort(books);
    }
}
