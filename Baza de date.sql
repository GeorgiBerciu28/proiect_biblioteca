CREATE DATABASE IF NOT EXISTS librarydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE librarydb;

SELECT * FROM users;
INSERT INTO users (first_name, last_name, email, password, role, created_at)
VALUES (
  'Admin',
  'Principal',
  'admin@library.com',
  'admin123', 
  'MANAGER',
  NOW()
);