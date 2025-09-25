const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  jwt.verify(token, /*process.env.JWT_SECRET*/'c4d33a89a49710c12fce5a7d272f470a82ddd04b7680f46529514fce5ad41905', (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Token invalide' });
      }

      req.user = decoded;
      next();
    }
  );
};

module.exports = authMiddleware;
