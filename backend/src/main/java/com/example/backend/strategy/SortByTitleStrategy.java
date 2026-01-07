package com.example.backend.strategy;

import com.example.backend.model.Book;
import org.springframework.stereotype.Component;
import java.util.Comparator;
import java.util.List;

@Component("sortByTitle")
public class SortByTitleStrategy implements BookSortStrategy {

    @Override
    public List<Book> sort(List<Book> books) {
        return books.stream()
                .sorted(Comparator.comparing(Book::getTitle))
                .toList();
    }
}
