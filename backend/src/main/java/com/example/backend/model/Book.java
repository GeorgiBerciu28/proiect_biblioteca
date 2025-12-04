package com.example.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String author;

    private int year;

    @ElementCollection
    @CollectionTable(
            name = "book_categories",
            joinColumns = @JoinColumn(name = "book_id")
    )
    @Column(name = "category")
    private List<String> categories = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "stock")
    private int stock;

    private String status;

    private String image;

    public Book() {}

    public Book(String title, String author, int year, String description,int stock, String status, String image) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.description = description;
        this.stock = stock;
        this.status = status;
        this.image = image;
        this.categories = new ArrayList<>();
    }

    public Long getId() { return id; }

    public String getAuthor() { return author; }

    public String getTitle() { return title; }

    public int getYear() { return year; }

    public String getDescription() { return description; }

    public String getStatus() { return status; }

    public String getImage() { return image; }

    public List<String> getCategories() { return categories; }

    public void setId(Long id) { this.id = id; }

    public void setAuthor(String author) { this.author = author; }

    public void setTitle(String title) { this.title = title; }

    public void setYear(int year) { this.year = year; }

    public void setDescription(String description) { this.description = description; }

    public void setStock(int stock) { this.stock = stock; }
    public int getStock() { return stock; }

    public void setStatus(String status) { this.status = status; }

    public void setImage(String image) { this.image = image; }

    public void setCategories(List<String> categories) { this.categories = categories; }
}
