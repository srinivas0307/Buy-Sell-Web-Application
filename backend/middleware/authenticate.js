const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.jwt_secret;

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET); 
    req.userId = decoded.id;
    req.name = decoded.name;
    req.email = decoded.email;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(400).json({ message: 'Invalid token' });
  }
};


module.exports = authenticateToken;