-- ============================================
-- KAMPALA COMMUNITY EDUCATION HUB - DATABASE
-- ============================================

-- Create Database
CREATE DATABASE  kceh_db;
USE kceh_db;

-- ============================================
-- TABLE: volunteers
-- ============================================
CREATE TABLE volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    skills VARCHAR(100) NOT NULL,
    availability INT NOT NULL,
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: contact_messages
-- ============================================
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: newsletter_subscribers
-- ============================================
CREATE TABLE newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: resources
-- ============================================
CREATE TABLE resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    file_name VARCHAR(200),
    file_path VARCHAR(300),
    file_type VARCHAR(50),
    download_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    is_external BOOLEAN DEFAULT FALSE,
    external_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: success_stories
-- ============================================
CREATE TABLE success_stories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    title VARCHAR(200),
    story TEXT NOT NULL,
    story_tag VARCHAR(50),
    image VARCHAR(200),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: events
-- ============================================
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(200),
    max_participants INT DEFAULT 50,
    registered_count INT DEFAULT 0,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: jobs
-- ============================================
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    description TEXT,
    requirements TEXT,
    salary VARCHAR(100),
    job_type ENUM('full-time', 'part-time', 'internship', 'contract') DEFAULT 'full-time',
    status ENUM('active', 'filled', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: resource_downloads (for tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS resource_downloads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id INT NOT NULL,
    user_ip VARCHAR(45),
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources(id)
);

-- ============================================
-- INSERT SAMPLE RESOURCES
-- ============================================
INSERT INTO resources (title, description, category, file_name, file_path, file_type, download_count) VALUES
('Mathematics Textbook - S1 to S4', 'Complete mathematics textbook covering all topics from S1 to S4.', 'textbooks', 'math-textbook.pdf', 'resources/math-textbook.pdf', 'PDF', 1234),
('English Grammar Handbook', 'Complete guide to English grammar, punctuation, and writing skills.', 'textbooks', 'english-grammar.pdf', 'resources/english-grammar.pdf', 'PDF', 876),
('Science Textbook - S1 to S4', 'Complete science textbook covering biology, chemistry, and physics.', 'textbooks', 'science-textbook.pdf', 'resources/science-textbook.pdf', 'PDF', 654),
('Math Practice Worksheets - Set 1', '50+ practice questions with answers for S1 mathematics.', 'worksheets', 'math-worksheets.pdf', 'resources/math-worksheets.pdf', 'PDF', 567);

INSERT INTO resources (title, description, category, file_type, is_external, external_url, view_count) VALUES
('Introduction to Coding - Video Series', 'Learn HTML, CSS, and JavaScript with this complete video series.', 'videos', 'Video', TRUE, 'https://www.youtube.com/playlist?list=PLYOUR_PLAYLIST', 2345),
('Free Online Courses - Coursera', 'Access thousands of free courses from top universities worldwide.', 'links', 'Link', TRUE, 'https://www.coursera.org', 0);

-- ============================================
-- INSERT SAMPLE SUCCESS STORIES
-- ============================================
INSERT INTO success_stories (name, age, title, story, story_tag, status) VALUES
('John', 19, 'From Dropout to Web Developer', 'I dropped out of school but found free coding lessons here. Now I work as a web developer and support my family!', 'Tech Success', 'approved'),
('Mary', 16, 'Passed Her Exams', 'I was failing mathematics until I got a volunteer tutor through this platform. I passed my S4 exams with distinction!', 'Academic Success', 'approved'),
('Peter', 24, 'Found Employment', 'After university, I could not find a job. This platform connected me with an employer. Now I pay my own rent!', 'Career Success', 'approved');

-- ============================================
-- INSERT SAMPLE EVENTS
-- ============================================
INSERT INTO events (title, description, event_date, event_time, location, max_participants) VALUES
('Free Coding Workshop', 'Learn HTML, CSS, and JavaScript from professional developers. No experience needed!', '2026-01-15', '10:00:00', 'Kampala Youth Center, Kawempe', 50),
('Women''s Empowerment Workshop', 'Learn about entrepreneurship, financial literacy, and leadership skills.', '2026-01-22', '09:00:00', 'Gayaza Community Hall', 30);

-- ============================================
-- INSERT SAMPLE JOBS
-- ============================================
INSERT INTO jobs (title, company, location, description, salary, job_type) VALUES
('Web Developer', 'Tech Solutions Uganda', 'Kampala, Uganda', 'Looking for a skilled web developer with experience in HTML, CSS, JavaScript, and PHP.', '1.5M - 2.5M UGX', 'full-time'),
('Math Teacher', 'Kampala International School', 'Kampala, Uganda', 'Qualified math teacher for secondary school. Must have teaching experience and a degree.', '1.2M - 2M UGX', 'full-time');
-- ============================================
-- INSERT SAMPLE VOLUNTEER NEEDS
-- ============================================
-- (These are just for display, not stored in database)