const db = require('../db');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

exports.submit = async (req, res) => {
  try {
    const { user_id = null, username='Anonymous', email='', message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });
    const result = sentiment.analyze(message);
    const score = result.score;
    const label = score>0?'Positive':score<0?'Negative':'Neutral';
    await db.execute('INSERT INTO feedback (user_id, username, email, message, sentiment, polarity) VALUES (?,?,?,?,?,?)', [user_id, username, email, message, label, score]);
    res.status(201).json({ sentiment: label, score });
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'Save failed' });
  }
};

exports.summary = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT sentiment, COUNT(*) as count FROM feedback GROUP BY sentiment");
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Summary failed' }); }
};

exports.myFeedbacks = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.execute('SELECT * FROM feedback WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Fetch failed' }); }
};

exports.allFeedbacks = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const [rows] = await db.execute('SELECT * FROM feedback ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Fetch failed' }); }
};

exports.deleteById = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const id = parseInt(req.params.id,10);
    const [r] = await db.execute('SELECT sentiment FROM feedback WHERE id = ?', [id]);
    if (!r || r.length===0) return res.status(404).json({ error: 'Not found' });
    if (r[0].sentiment !== 'Negative') return res.status(400).json({ error: 'Can delete Negative only' });
    const [resu] = await db.execute('DELETE FROM feedback WHERE id = ?', [id]);
    res.json({ affectedRows: resu.affectedRows || 0 });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Delete failed' }); }
};
