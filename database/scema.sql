-- Smart College Portal Database Schema

CREATE DATABASE IF NOT EXISTS smart_college_portal;
USE smart_college_portal;

-- Users table (extends Django's auth_user)
CREATE TABLE college_portal_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME(6),
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) UNIQUE NOT NULL,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined DATETIME(6) NOT NULL,
    role VARCHAR(10) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    date_of_birth DATE
);

-- Classes table
CREATE TABLE college_portal_class (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    section VARCHAR(10) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    capacity INT NOT NULL,
    created_at DATETIME(6) NOT NULL
);

-- Subjects table
CREATE TABLE college_portal_subject (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    credits INT NOT NULL,
    description TEXT
);

-- Subject-Class relationship
CREATE TABLE college_portal_subject_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    class_id INT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES college_portal_subject(id),
    FOREIGN KEY (class_id) REFERENCES college_portal_class(id),
    UNIQUE KEY unique_subject_class (subject_id, class_id)
);

-- Teachers table
CREATE TABLE college_portal_teacher (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    qualification VARCHAR(200) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES college_portal_user(id)
);

-- Teacher-Subject relationship
CREATE TABLE college_portal_teacher_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    subject_id INT NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES college_portal_teacher(id),
    FOREIGN KEY (subject_id) REFERENCES college_portal_subject(id),
    UNIQUE KEY unique_teacher_subject (teacher_id, subject_id)
);

-- Teacher-Class relationship
CREATE TABLE college_portal_teacher_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    class_id INT NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES college_portal_teacher(id),
    FOREIGN KEY (class_id) REFERENCES college_portal_class(id),
    UNIQUE KEY unique_teacher_class (teacher_id, class_id)
);

-- Students table
CREATE TABLE college_portal_student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    student_class_id INT NOT NULL,
    admission_date DATE NOT NULL,
    parent_name VARCHAR(100) NOT NULL,
    parent_phone VARCHAR(15) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES college_portal_user(id),
    FOREIGN KEY (student_class_id) REFERENCES college_portal_class(id)
);

-- Schedule table
CREATE TABLE college_portal_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_assigned_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    day_of_week VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    FOREIGN KEY (class_assigned_id) REFERENCES college_portal_class(id),
    FOREIGN KEY (subject_id) REFERENCES college_portal_subject(id),
    FOREIGN KEY (teacher_id) REFERENCES college_portal_teacher(id),
    UNIQUE KEY unique_class_day_time (class_assigned_id, day_of_week, start_time)
);

-- Attendance table
CREATE TABLE college_portal_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    date DATE NOT NULL,
    is_present BOOLEAN NOT NULL DEFAULT FALSE,
    marked_by_id INT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES college_portal_student(id),
    FOREIGN KEY (subject_id) REFERENCES college_portal_subject(id),
    FOREIGN KEY (marked_by_id) REFERENCES college_portal_teacher(id),
    UNIQUE KEY unique_student_subject_date (student_id, subject_id, date)
);

-- Examinations table
CREATE TABLE college_portal_examination (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    exam_type VARCHAR(20) NOT NULL,
    subject_id INT NOT NULL,
    class_assigned_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_marks INT NOT NULL,
    created_by_id INT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES college_portal_subject(id),
    FOREIGN KEY (class_assigned_id) REFERENCES college_portal_class(id),
    FOREIGN KEY (created_by_id) REFERENCES college_portal_teacher(id)
);

-- Marks table
CREATE TABLE college_portal_marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    examination_id INT NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    remarks TEXT,
    entered_by_id INT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES college_portal_student(id),
    FOREIGN KEY (examination_id) REFERENCES college_portal_examination(id),
    FOREIGN KEY (entered_by_id) REFERENCES college_portal_teacher(id),
    UNIQUE KEY unique_student_examination (student_id, examination_id)
);

-- Assignments table
CREATE TABLE college_portal_assignment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    subject_id INT NOT NULL,
    class_assigned_id INT NOT NULL,
    teacher_id INT NOT NULL,
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_marks INT NOT NULL,
    file_attachment VARCHAR(100),
    FOREIGN KEY (subject_id) REFERENCES college_portal_subject(id),
    FOREIGN KEY (class_assigned_id) REFERENCES college_portal_class(id),
    FOREIGN KEY (teacher_id) REFERENCES college_portal_teacher(id)
);

-- Assignment Submissions table
CREATE TABLE college_portal_assignmentsubmission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    submission_file VARCHAR(100) NOT NULL,
    submission_text TEXT,
    submitted_at DATETIME(6) NOT NULL,
    marks_obtained DECIMAL(5,2),
    feedback TEXT,
    FOREIGN KEY (assignment_id) REFERENCES college_portal_assignment(id),
    FOREIGN KEY (student_id) REFERENCES college_portal_student(id),
    UNIQUE KEY unique_assignment_student (assignment_id, student_id)
);

-- Notices table
CREATE TABLE college_portal_notice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(10) NOT NULL DEFAULT 'medium',
    target_audience VARCHAR(20) NOT NULL,
    target_class_id INT,
    created_by_id INT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (target_class_id) REFERENCES college_portal_class(id),
    FOREIGN KEY (created_by_id) REFERENCES college_portal_user(id)
);

-- Feedback table
CREATE TABLE college_portal_feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feedback_type VARCHAR(20) NOT NULL,
    from_user_id INT NOT NULL,
    to_user_id INT,
    subject_id INT,
    rating INT NOT NULL,
    comments TEXT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    FOREIGN KEY (from_user_id) REFERENCES college_portal_user(id),
    FOREIGN KEY (to_user_id) REFERENCES college_portal_user(id),
    FOREIGN KEY (subject_id) REFERENCES college_portal_subject(id)
);

-- Chat Messages table
CREATE TABLE college_portal_chatmessage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    timestamp DATETIME(6) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES college_portal_user(id),
    FOREIGN KEY (receiver_id) REFERENCES college_portal_user(id)
);

-- Downloadable Resources table
CREATE TABLE college_portal_downloadableresource (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_type VARCHAR(20) NOT NULL,
    file VARCHAR(100) NOT NULL,
    subject_id INT,
    class_assigned_id INT,
    uploaded_by_id INT NOT NULL,
    upload_date DATETIME(6) NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (subject_id) REFERENCES college_portal_subject(id),
    FOREIGN KEY (class_assigned_id) REFERENCES college_portal_class(id),
    FOREIGN KEY (uploaded_by_id) REFERENCES college_portal_user(id)
);

-- Create indexes for better performance
CREATE INDEX idx_attendance_student_date ON college_portal_attendance(student_id, date);
CREATE INDEX idx_marks_student_exam ON college_portal_marks(student_id, examination_id);
CREATE INDEX idx_schedule_class_day ON college_portal_schedule(class_assigned_id, day_of_week);
CREATE INDEX idx_notice_target ON college_portal_notice(target_audience, is_active);
CREATE INDEX idx_chat_participants ON college_portal_chatmessage(sender_id, receiver_id);

-- Insert sample data
INSERT INTO college_portal_user (username, password, first_name, last_name, email, role, is_staff, is_active, date_joined) VALUES
('admin', 'pbkdf2_sha256$320000$sample_hash', 'Admin', 'User', 'admin@college.edu', 'admin', TRUE, TRUE, NOW()),
('teacher1', 'pbkdf2_sha256$320000$sample_hash', 'John', 'Smith', 'john.smith@college.edu', 'teacher', FALSE, TRUE, NOW()),
('student1', 'pbkdf2_sha256$320000$sample_hash', 'Alice', 'Johnson', 'alice.johnson@student.edu', 'student', FALSE, TRUE, NOW());

INSERT INTO college_portal_class (name, section, academic_year, capacity, created_at) VALUES
('Computer Science', 'A', '2023-24', 60, NOW()),
('Information Technology', 'B', '2023-24', 55, NOW());

INSERT INTO college_portal_subject (name, code, credits, description) VALUES
('Data Structures', 'CS101', 4, 'Introduction to data structures and algorithms'),
('Database Management', 'CS102', 3, 'Database design and management systems'),
('Web Development', 'IT101', 3, 'Frontend and backend web development');
