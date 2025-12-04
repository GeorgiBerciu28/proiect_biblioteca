package com.example.backend.dto;

import java.util.ArrayList;
import java.util.List;

public class AddBookRequest {
    private String title;
    private String author;
    private int year;
    private List<String> categories= new ArrayList<>();
    private String description;
    private int stock;
    private String status;
    public AddBookRequest() {}
    public AddBookRequest(String title, String author, int year, String description,int stock, String status) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.categories = new ArrayList<>();
        this.description = description;
        this.stock = stock;
        this.status = status;

    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    public int getYear() {
        return year;
    }
    public void setYear(int year) {
         this.year = year;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public List<String> getCategories() {
        return categories;
    }
    public void setCategories(List<String> categories) {
        this.categories = categories;
    }
    public void setStock(int stock) {
        this.stock = stock;
    }
    public int getStock() {
        return stock;
    }


}
