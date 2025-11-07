Smart Feedback Collection and Analysis System
-Project Overview

The Smart Feedback Collection and Analysis System is a full-stack web application designed to collect, analyze, and visualize user feedback. It uses sentiment analysis to automatically classify feedback as Positive, Negative, or Neutral and displays dynamic visualizations for administrators.
This project demonstrates the integration of core web technologies — HTML, CSS, JavaScript, Node.js, Express, RESTful APIs, and MySQL — to build a complete, real-world web solution.

* Project Features

• User Feedback Submission: Users can submit feedback easily through a responsive web interface.
• Sentiment Analysis: The system automatically evaluates the sentiment of feedback (Positive, Negative, or Neutral).
• Data Visualization: Feedback trends are displayed using Chart.js for real-time insights.
• Admin Dashboard: Admins can view and manage all feedback entries, including deletion of negative feedback.
• Database Integration: All feedback and user data are securely stored in a structured MySQL database.
• Authentication: Supports user and admin login using JWT (JSON Web Tokens).

* Technologies Used

Frontend: HTML, CSS, JavaScript, Chart.js
Backend: Node.js, Express.js
Database: MySQL
API Type: RESTful APIs
Sentiment Analysis: Sentiment (npm package)
IDE / Editor: Visual Studio Code
Testing Tools: Postman, MySQL Workbench
Version Control: GitHub

* Setup Instructions

1️. Clone the Repository
git clone https://github.com/Srinidhhi-29/Smart-Feedback-Project.git

2️. Install Backend Dependencies
cd Smart-Feedback-Project/backend
npm install

3️. Setup Database
Create a MySQL database named feedbackdb
Run the SQL script:
CREATE DATABASE feedbackdb;
USE feedbackdb;

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(100) UNIQUE,
password VARCHAR(255),
role ENUM('user','admin') DEFAULT 'user'
);

CREATE TABLE feedback (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
username VARCHAR(100),
email VARCHAR(100),
message TEXT,
sentiment VARCHAR(20),
polarity INT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id)
);

* Run the Backend Server
node server.js
The server starts on: http://127.0.0.1:5000

*Serve the Frontend
Open another terminal:
cd ../frontend
python -m http.server 8000
Then open your browser and visit:
http://127.0.0.1:8000

*Testing & Validation

• Postman: Used to test REST APIs (/api/feedback, /auth/login, /auth/register, /api/all).
• MySQL Workbench: Verified feedback storage and sentiment classification.
• Frontend: Real-time updates visualized using Chart.js.
• Admin Actions: Validated deletion of negative feedback.

* Troubleshooting

Issue: Access denied for user 'root'@'localhost' → Update .env with correct MySQL username/password
Issue: Cannot find module 'dotenv' → Run npm install dotenv
Issue: Port 5000 busy → Change PORT value in .env file
Issue: Chart not loading → Ensure backend is running before opening frontend

* Repository Link

Smart Feedback Project on GitHub:
https://github.com/Srinidhhi-29/Smart-Feedback-Project
