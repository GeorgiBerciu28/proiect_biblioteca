package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String author;

    private int year;

    private String type;
    @Column(columnDefinition = "TEXT")
    private String description;

    private String status; // disponibil / imprumutat

    private String image; // nume de fișier imagine

    public Book() {}

    public Book(String title, String author, int year,String type, String description, String status, String image) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.type = type;
        this.description = description;
        this.status = status;
        this.image = image;
    }

    public Long getId() {
        return id;
    }

    public String getAuthor() {
        return author;
    }

    public String getTitle() {
        return title;
    }

    public int getYear() {
        return year;
    }
    public String getDescription() {
        return description;
    }
    public String getStatus() {
        return status;
    }
    public String getImage() {
        return image;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public void setYear(int year) {
        this.year = year;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public void setImage(String image) {
        this.image = image;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }


}
