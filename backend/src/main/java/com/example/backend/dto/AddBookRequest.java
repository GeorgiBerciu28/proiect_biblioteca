package com.example.backend.dto;

public class AddBookRequest {
    private String title;
    private String author;
    private int year;
    private String type;
    private String description;
    private String status;
    public AddBookRequest() {}
    public AddBookRequest(String title, String author, int year,String type, String description, String status) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.type = type;
        this.description = description;
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
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }


}
