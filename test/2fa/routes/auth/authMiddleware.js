const { verifyToken } = require("../../service/jwt");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  const { valid, decoded } = verifyToken(token);

  if (!valid) {
    return res.status(403).json({ success: false, message: "Token invalide" });
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;
