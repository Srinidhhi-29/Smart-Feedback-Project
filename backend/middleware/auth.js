const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secret';
module.exports = function(req,res,next){
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'No token' });
  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Malformed token' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
