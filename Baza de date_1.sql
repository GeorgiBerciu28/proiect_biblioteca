SET SQL_SAFE_UPDATES = 0;

DROP DATABASE IF EXISTS librarydb;

CREATE DATABASE librarydb
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE librarydb;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    subscription_status VARCHAR(20) DEFAULT 'inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (first_name, last_name, email, password, role, subscription_status)
VALUES ('Admin', 'Principal', 'admin@library.com', 'admin123', 'MANAGER', 'active');

INSERT INTO users (first_name, last_name, email, password, role, subscription_status)
VALUES ('User', 'Normal', 'user@library.com', 'user123', 'USER', 'active');

CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    year INT,
    description TEXT,
    status VARCHAR(50) DEFAULT 'disponibil',
    image VARCHAR(255),
    pdf VARCHAR(255),
    stock INT DEFAULT 1,
    average_rating DOUBLE DEFAULT 0.0,
    total_ratings INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO books (title, author, year, description, status, stock)
VALUES
('Mândrie și prejudecată', 'Jane Austen', 1813, 'Roman clasic despre dragoste și societate.', 'disponibil', 3),
('Crimă și pedeapsă', 'Feodor Dostoievski', 1866, 'Roman psihologic despre crimă și conștiință.', 'disponibil', 2),
('Anna Karenina', 'Lev Tolstoi', 1877, 'Poveste tragică despre iubire și societate.', 'disponibil', 2),
('Marele Gatsby', 'F. Scott Fitzgerald', 1925, 'Decadența Americii anilor 1920.', 'disponibil', 2),
('1984', 'George Orwell', 1949, 'Distopie despre un regim totalitar.', 'disponibil', 3),
('Maestrul și Margareta', 'Mihail Bulgakov', 1967, 'Roman fantastic și satiric.', 'disponibil', 2),
('Moby Dick', 'Herman Melville', 1851, 'Obsesia căpitanului Ahab.', 'disponibil', 1),
('Ulise', 'James Joyce', 1922, 'Roman modernist.', 'disponibil', 1),
('Harry Potter și Piatra Filozofală', 'J.K. Rowling', 1997, 'Aventurile unui tânăr vrăjitor.', 'disponibil', 5),
('Stăpânul Inelelor: Frăția Inelului', 'J.R.R. Tolkien', 1954, 'Trilogie epică fantasy.', 'disponibil', 4),
('Dune', 'Frank Herbert', 1965, 'Epic SF pe planeta Arrakis.', 'disponibil', 3),
('Fundația', 'Isaac Asimov', 1951, 'Salvarea cunoașterii umane.', 'disponibil', 2),
('Sapiens', 'Yuval Noah Harari', 2011, 'Istoria omenirii.', 'disponibil', 3),
('Puterea prezentului', 'Eckhart Tolle', 1997, 'Ghid spiritual.', 'disponibil', 2),
('Steve Jobs', 'Walter Isaacson', 2011, 'Biografia fondatorului Apple.', 'disponibil', 2),
('Scurtă istorie a timpului', 'Stephen Hawking', 1988, 'Explorarea universului.', 'disponibil', 2),
('Luceafărul', 'Mihai Eminescu', 1883, 'Capodopera poetică românească.', 'disponibil', 1);

CREATE TABLE book_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

INSERT INTO book_categories (book_id, category) VALUES
(1, 'clasica_literatura_universala'), (1, 'romantism'),
(2, 'clasica_literatura_universala'),
(3, 'clasica_literatura_universala'), (3, 'romantism'),
(4, 'clasica_literatura_universala'),
(5, 'science_fiction'),
(6, 'fantasy'),
(7, 'clasica_literatura_universala'),
(8, 'clasica_literatura_universala'),
(9, 'fantasy'),
(10, 'fantasy'),
(11, 'science_fiction'),
(12, 'science_fiction'),
(13, 'non_fictiune_eseuri_analize_jurnale'),
(14, 'dezvoltare_personala_psihologie'),
(15, 'istorie_biografii_memorii'),
(16, 'stiinta_tehnologie'),
(17, 'poezii');

CREATE TABLE ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review VARCHAR(1000),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book (user_id, book_id)
);

INSERT INTO ratings (user_id, book_id, rating, created_at) VALUES
(1, 1, 5, NOW()),
(1, 9, 5, NOW()),
(1, 10, 5, NOW()),
(2, 1, 5, NOW()),
(2, 3, 5, NOW()),
(2, 9, 5, NOW()),
(2, 10, 4, NOW()),
(2, 11, 4, NOW()),
(1, 5, 5, NOW()),
(2, 5, 4, NOW());

UPDATE books b
SET 
  average_rating = (SELECT COALESCE(AVG(r.rating), 0) FROM ratings r WHERE r.book_id = b.id),
  total_ratings = (SELECT COUNT(*) FROM ratings r WHERE r.book_id = b.id);


CREATE TABLE borrows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    user_first_name VARCHAR(100),
    user_last_name VARCHAR(100),
    user_email VARCHAR(150),
    book_title VARCHAR(255),
    book_author VARCHAR(255),
    book_image VARCHAR(255),
    borrow_date DATETIME NULL,
    due_date DATETIME NULL,
    return_date DATETIME NULL,
    confirm_date DATETIME NULL,
    reservation_date DATETIME NULL,
    reservation_expires_at DATETIME NULL,
    status VARCHAR(50) DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);


CREATE TABLE favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

SELECT 'VERIFICARE TABELURI' AS Status;
SHOW TABLES;

SELECT 'VERIFICARE RATINGS' AS Status;
SELECT * FROM ratings;

SELECT 'VERIFICARE BOOKS CU RATING' AS Status;
SELECT id, title, average_rating, total_ratings 
FROM books 
WHERE total_ratings > 0
ORDER BY average_rating DESC, total_ratings DESC;

SET SQL_SAFE_UPDATES = 1;

USE librarydb;
SELECT * FROM users;

SELECT id,
       user_first_name,
       user_last_name,
       user_email
FROM borrows
ORDER BY id DESC
LIMIT 5;

SELECT * FROM borrows WHERE status = 'active';
