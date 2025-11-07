const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/stats', auth, async (req,res)=>{
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  try {
    const [rows] = await db.execute("SELECT sentiment, COUNT(*) as count FROM feedback GROUP BY sentiment");
    res.json(rows);
  } catch (e) { res.status(500).json({ error: 'Stats failed' }); }
});

module.exports = router;
