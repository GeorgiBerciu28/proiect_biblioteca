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

CREATE TABLE IF NOT EXISTS books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    year INT,
    description TEXT,
    status VARCHAR(50) DEFAULT 'disponibil',
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS borrows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    book_title VARCHAR(255),
    book_author VARCHAR(255),
    book_image VARCHAR(255),
    borrow_date DATETIME NOT NULL,
    return_date DATETIME,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_borrow_date (borrow_date)
);

INSERT INTO books (title, author, year, description, status, image) VALUES
('Mândrie și prejudecată', 'Jane Austen', 1813, 'Un roman clasic despre dragoste, clasă socială și mândrie în Anglia secolului al XIX-lea.', 'disponibil', NULL),
('Crimă și pedeapsă', 'Feodor Dostoievski', 1866, 'Un roman psihologic profund despre crimă, conștiință și răscumpărare.', 'disponibil', NULL),
('Anna Karenina', 'Lev Tolstoi', 1877, 'Povestea tragică a Annei Karenina și a adulterului ei în societatea rusă aristocrată.', 'disponibil', NULL),
('Marele Gatsby', 'F. Scott Fitzgerald', 1925, 'O poveste despre decadența și idealismul din America anilor 1920.', 'disponibil', NULL),
('1984', 'George Orwell', 1949, 'O distopie asupra unui regim totalitar care controlează fiecare aspect al vieții.', 'disponibil', NULL),
('Maestrul și Margareta', 'Mihail Bulgakov', 1967, 'Un roman fantastic și satiric despre vizita Diavolului în Moscova sovietică.', 'disponibil', NULL),
('Moby Dick', 'Herman Melville', 1851, 'Povestea obsesiei căpitanului Ahab pentru balena albă Moby Dick.', 'disponibil', NULL),
('Ulise', 'James Joyce', 1922, 'Un roman modernist complex care urmărește o zi din viața lui Leopold Bloom în Dublin.', 'disponibil', NULL);

-- Adaugă categorii pentru clasici
INSERT INTO book_categories (book_id, category) VALUES
(1, 'clasica_literatura_universala'), (1, 'romantism'),
(2, 'clasica_literatura_universala'),
(3, 'clasica_literatura_universala'), (3, 'romantism'),
(4, 'clasica_literatura_universala'),
(5, 'clasica_literatura_universala'), (5, 'science_fiction'),
(6, 'clasica_literatura_universala'), (6, 'fantasy'),
(7, 'clasica_literatura_universala'),
(8, 'clasica_literatura_universala');

-- FANTASY
INSERT INTO books (title, author, year, description, status, image) VALUES
('Harry Potter și Piatra Filozofală', 'J.K. Rowling', 1997, 'Un băiat descoperă că este un vrăjitor și începe aventurile sale la Hogwarts.', 'disponibil', NULL),
('Stăpânul Inelelor: Frăția Inelului', 'J.R.R. Tolkien', 1954, 'Prima parte a trilogiei epice despre călătoria de a distruge Inelul Puterii.', 'disponibil', NULL),
('Cronicile din Narnia', 'C.S. Lewis', 1950, 'Copiii descoperă o lume magică accesibilă prin dulapul unui garderob.', 'disponibil', NULL),
('Numele Vântului', 'Patrick Rothfuss', 2007, 'Povestea lui Kvothe, un mag legendar, povestită de el însuși.', 'disponibil', NULL),
('Ucenicul Vrăjitorului', 'Terry Pratchett', 1998, 'Aventurile comice pe Discworld, o lume plată purtată de patru elefanți pe spatele unei broaște țestoase cosmice.', 'disponibil', NULL),
('Mistborn: Imperiul Final', 'Brandon Sanderson', 2006, 'Într-o lume dominată de un tiran nemuritor, un grup de rebeli plănuiește răsturnarea regimului.', 'disponibil', NULL);

INSERT INTO book_categories (book_id, category) VALUES
(9, 'fantasy'), (10, 'fantasy'), (11, 'fantasy'),
(12, 'fantasy'), (13, 'fantasy'), (14, 'fantasy');

-- SCIENCE FICTION
INSERT INTO books (title, author, year, description, status, image) VALUES
('Dune', 'Frank Herbert', 1965, 'Pe planeta deșertică Arrakis, Paul Atreides devine liderul unei revoluții intergalactice.', 'disponibil', NULL),
('Fundația', 'Isaac Asimov', 1951, 'Un matematician prezice căderea imperiului galactic și creează o fundație pentru a salva cunoașterea.', 'disponibil', NULL),
('Neuromantul', 'William Gibson', 1984, 'Un hacker este angajat pentru ultima lovitură în lumea cyberpunk-ului.', 'disponibil', NULL),
('Sfârșitul copilăriei', 'Arthur C. Clarke', 1953, 'Extratereștrii vin pe Pământ și aduc o eră de pace, dar cu un cost neașteptat.', 'disponibil', NULL),
('Mâna stângă a întunericului', 'Ursula K. Le Guin', 1969, 'Un diplomat terestru explorează o planetă unde locuitorii sunt androginii.', 'disponibil', NULL),
('Ready Player One', 'Ernest Cline', 2011, 'Într-o distopie din 2045, oamenii evadează în OASIS, un univers virtual.', 'disponibil', NULL);

INSERT INTO book_categories (book_id, category) VALUES
(15, 'science_fiction'), (16, 'science_fiction'),
(17, 'science_fiction'), (18, 'science_fiction'),
(19, 'science_fiction'), (20, 'science_fiction');

-- THRILLER/MYSTERY/CRIME
INSERT INTO books (title, author, year, description, status, image) VALUES
('Fata din tren', 'Paula Hawkins', 2015, 'O femeie devine obsedată de un cuplu pe care îl observă din tren, apoi femeia dispare.', 'disponibil', NULL),
('Codul lui Da Vinci', 'Dan Brown', 2003, 'Un profesor de simbolistică investighează o crimă în Luvru care dezvăluie un secret religios.', 'disponibil', NULL),
('Zăpada Cenuşie', 'Agatha Christie', 1922, 'Hercule Poirot investighează o crimă pe Nil Express.', 'disponibil', NULL),
('Millenium: Bărbați care urăsc femeile', 'Stieg Larsson', 2005, 'Un jurnalist și o hackeră investighează dispariția unei tinere din familia Vanger.', 'disponibil', NULL),
('Tăcerea mieilor', 'Thomas Harris', 1988, 'O studentă FBI cere ajutorul unui criminal în serie pentru a prinde un alt ucigaș.', 'disponibil', NULL),
('Gone Girl', 'Gillian Flynn', 2012, 'O femeie dispare în ziua aniversării căsătoriei, iar soțul devine principalul suspect.', 'disponibil', NULL);

INSERT INTO book_categories (book_id, category) VALUES
(21, 'thriller_mystery_crime'), (22, 'thriller_mystery_crime'),
(23, 'thriller_mystery_crime'), (24, 'thriller_mystery_crime'),
(25, 'thriller_mystery_crime'), (26, 'thriller_mystery_crime');

-- ROMANTISM
INSERT INTO books (title, author, year, description, status, image) VALUES
('Orgoliu și prejudecată', 'Jane Austen', 1813, 'Elizabeth Bennet și Mr. Darcy depășesc orgoliul și prejudecățile pentru a găsi dragostea.', 'disponibil', NULL),
('Înălțimi Turburi', 'Emily Brontë', 1847, 'O poveste de dragoste pasională și răzbunare pe mlaștinile din Yorkshire.', 'disponibil', NULL),
('Romeo și Julieta', 'William Shakespeare', 1597, 'Tragedia clasică a doi tineri îndrăgostiți din familii rivale.', 'disponibil', NULL),
('Memoriile unei gheișe', 'Arthur Golden', 1997, 'Povestea vieții unei gheișe celebre în Japonia secolului XX.', 'disponibil', NULL),
('Ca să nu ne mai gândim la asta', 'Colleen Hoover', 2016, 'O poveste de dragoste intensă despre alegeri dificile și iubire toxică.', 'disponibil', NULL),
('Notebook-ul', 'Nicholas Sparks', 1996, 'O poveste de dragoste ce durează o viață între Noah și Allie.', 'disponibil', NULL);

INSERT INTO book_categories (book_id, category) VALUES
(27, 'romantism'), (28, 'romantism'), (29, 'romantism'),
(30, 'romantism'), (31, 'romantism'), (32, 'romantism');

-- NON-FICȚIUNE
INSERT INTO books (title, author, year, description, status, image) VALUES
('Sapiens: Scurtă istorie a omenirii', 'Yuval Noah Harari', 2011, 'O explorare a istoriei speciei umane de la apariția Homo sapiens până în prezent.', 'disponibil', NULL),
('Gândire rapidă, gândire lentă', 'Daniel Kahneman', 2011, 'Despre cele două sisteme de gândire care modelează judecățile noastre.', 'disponibil', NULL),
('Educația', 'Tara Westover', 2018, 'Memoriile unei femei crescute de supraviețualiști care ajunge la Cambridge.', 'disponibil', NULL),
('Homo Deus', 'Yuval Noah Harari', 2015, 'O privire asupra viitorului omenirii în era tehnologiei și a inteligenței artificiale.', 'disponibil', NULL),
('Jurnalul Annei Frank', 'Anne Frank', 1947, 'Jurnalul unei fete evreice în timpul Holocaustului.', 'disponibil', NULL);

INSERT INTO book_categories (book_id, category) VALUES
(33, 'non_fictiune_eseuri_analize_jurnale'), (33, 'istorie_biografii_memorii'),
(34, 'non_fictiune_eseuri_analize_jurnale'), (34, 'dezvoltare_personala_psihologie'),
(35, 'non_fictiune_eseuri_analize_jurnale'), (35, 'istorie_biografii_memorii'),
(36, 'non_fictiune_eseuri_analize_jurnale'), (36, 'stiinta_tehnologie'),
(37, 'non_fictiune_eseuri_analize_jurnale'), (37, 'istorie_biografii_memorii');

-- DEZVOLTARE PERSONALĂ/PSIHOLOGIE
INSERT INTO books (title, author, year, description, status, image) VALUES
('Puterea prezentului', 'Eckhart Tolle', 1997, 'Un ghid spiritual despre trăirea în momentul prezent.', 'disponibil', NULL),
('Cele 7 deprinderi ale persoanelor eficiente', 'Stephen Covey', 1989, 'Principii pentru eficiență personală și profesională.', 'disponibil', NULL),
('Atomii obiceiurilor', 'James Clear', 2018, 'Cum să construiești obiceiuri bune și să scapi de cele rele.', 'disponibil', NULL),
('Omul în căutarea sensului vieții', 'Viktor Frankl', 1946, 'Experiențele unui psihiatru în lagărele naziste și lecții despre sens.', 'disponibil', NULL),
('Mindset: Psihologia succesului', 'Carol Dweck', 2006, 'Despre mentalitatea de creștere vs. mentalitatea fixă.', 'disponibil', NULL);

INSERT INTO book_categories (book_id, category) VALUES
(38, 'dezvoltare_personala_psihologie'),
(39, 'dezvoltare_personala_psihologie'),
(40, 'dezvoltare_personala_psihologie'),
(41, 'dezvoltare_personala_psihologie'),
(42, 'dezvoltare_personala_psihologie');

-- ISTORIE/BIOGRAFII
INSERT INTO books (title, author, year, description, status, image) VALUES
('Steve Jobs', 'Walter Isaacson', 2011, 'Biografia autorizată a co-fondatorului Apple.', 'disponibil', NULL),
('Soldatul necunoscut', 'Antony Beevor', 2012, 'O istorie a celui de-al Doilea Război Mondial.', 'disponibil', NULL),
('Becoming', 'Michelle Obama', 2018, 'Memoriile fostei Prime Doamne a Statelor Unite.', 'disponibil', NULL),
('Imperiul mongol', 'Jack Weatherford', 2004, 'Povestea lui Genghis Khan și a imperiului său.', 'disponibil', NULL);

INSERT INTO book_categories (book_id, category) VALUES
(43, 'istorie_biografii_memorii'),
(44, 'istorie_biografii_memorii'),
(45, 'istorie_biografii_memorii'),
(46, 'istorie_biografii_memorii');

-- ȘTIINȚĂ/TEHNOLOGIE
INSERT INTO books (title, author, year, description, status, image) VALUES
('Scurtă istorie a timpului', 'Stephen Hawking', 1988, 'O explorare a universului, de la Big Bang la găurile negre.', 'disponibil', NULL),
('Cosmosul', 'Carl Sagan', 1980, 'O călătorie prin univers și istoria științei.', 'disponibil', NULL),
('Originea speciilor', 'Charles Darwin', 1859, 'Lucrarea fundamentală despre evoluție prin selecție naturală.', 'disponibil', NULL),
('Genius', 'Walter Isaacson', 2007, 'Biografia lui Albert Einstein.', 'disponibil', NULL);

INSERT INTO book_categories (book_id, category) VALUES
(47, 'stiinta_tehnologie'),
(48, 'stiinta_tehnologie'),
(49, 'stiinta_tehnologie'),
(50, 'stiinta_tehnologie'), (50, 'istorie_biografii_memorii');

-- POEZII
INSERT INTO books (title, author, year, description, status, image) VALUES
('Luceafărul', 'Mihai Eminescu', 1883, 'Capodopera poetică a lui Eminescu despre dragoste și imposibilitate.', 'disponibil', NULL),
('Flori de mucigai', 'Charles Baudelaire', 1857, 'Colecție de poezii despre frumusețe, decadență și modernitate.', 'disponibil', NULL),
('Frunze de iarbă', 'Walt Whitman', 1855, 'Colecție de poezii celebrând natura și democrația americană.', 'disponibil', NULL),
('Cântece de experiență și nevinovăție', 'William Blake', 1794, 'Poezii despre dualitatea vieții umane.', 'disponibil', NULL);

INSERT INTO book_categories (book_id, category) VALUES
(51, 'poezii'), (52, 'poezii'), (53, 'poezii'), (54, 'poezii');

