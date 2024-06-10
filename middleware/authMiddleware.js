const jwt = require('jsonwebtoken');
const config = require('../config/config');
const secretKey = config.secretKey;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
 // console.log('Auth Header:', authHeader);
  
  if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  //console.log('Token:', token);

  if (!token) {
      return res.status(401).json({ error: 'Token missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
          return res.status(401).json({ error: 'Invalid token' });
      }
      req.user = decoded;
    //  console.log('Decoded user:', decoded);
      next();
  });
};

const isAdminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isadmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

module.exports = {
  authMiddleware,
  isAdminMiddleware
};