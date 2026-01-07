package com.example.backend.strategy;

import com.example.backend.model.Book;
import org.springframework.stereotype.Component;
import java.util.Comparator;
import java.util.List;

@Component("sortByAuthor")
public class SortByAuthorStrategy implements BookSortStrategy {

    @Override
    public List<Book> sort(List<Book> books) {
        return books.stream()
                .sorted(Comparator.comparing(Book::getAuthor))
                .toList();
    }
}
