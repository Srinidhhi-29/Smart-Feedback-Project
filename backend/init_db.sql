CREATE DATABASE IF NOT EXISTS feedbackdb;
USE feedbackdb;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('guest','user','admin') DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  username VARCHAR(255),
  email VARCHAR(255),
  message TEXT,
  sentiment VARCHAR(20),
  polarity DOUBLE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- insert demo admin (password plain for demo; backend uses bcrypt for logins registered via API)
INSERT IGNORE INTO users (name,email,password,role) VALUES ('Admin','admin@tcs.com','admin123','admin');
