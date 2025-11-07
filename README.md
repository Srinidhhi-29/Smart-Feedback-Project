Smart-Feedback (HTML + JS + Node.js + MySQL)
============================================

This package contains a fully functional professional-looking feedback system:
- Frontend: Plain HTML/CSS/JS
- Backend: Node.js + Express + MySQL
- Sentiment analysis: `sentiment` npm package
- Admin panel: view & delete negative feedbacks
- Frontend port recommended: http://127.0.0.1:8000 (use http-server or python -m http.server)

Quick start (Windows):
1. then:
   cd Smart-Feedback/backend
   npm install
   mysql -u root -p < init_db.sql
   node server.js

2. Serve frontend on port 8000 (recommended):
   cd Smart-Feedback/frontend
   npx http-server . -p 8000
   # or: python -m http.server 8000

3. Open http://127.0.0.1:8000 in browser

Default admin:
 - email: admin@tcs.com
 - password: admin123

Troubleshooting:
 - If `Cannot find module 'dotenv'`: run `npm install` inside backend
 - If DB access denied: update .env with correct DB credentials or run SQL with proper user
 - If port busy: change PORT in .env before running server

