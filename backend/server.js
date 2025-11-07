require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

const createUsers = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('guest','user','admin') DEFAULT 'user'
) ENGINE=INNODB;`;

const createFeedback = `CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  username VARCHAR(255),
  email VARCHAR(255),
  message TEXT,
  sentiment VARCHAR(20),
  polarity DOUBLE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB;`;

(async ()=>{
  try{
    await db.execute(createUsers);
    await db.execute(createFeedback);
    console.log('✅ DB tables ensured');
  }catch(e){
    console.error('DB init error', e);
  }
})();

app.use('/auth', authRoutes);
app.use('/api', feedbackRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
