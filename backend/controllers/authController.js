const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret';

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const [exists] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length) return res.status(400).json({ error: 'Email already registered' });
    const hash = bcrypt.hashSync(password, 8);
    await db.execute('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', [name||'',email,hash,'user']);
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.execute('SELECT id,name,email,password,role FROM users WHERE email = ?', [email]);
    if (!rows || rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, SECRET, { expiresIn: '12h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'Login failed' });
  }
};
