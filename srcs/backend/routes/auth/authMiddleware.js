const { verifyToken } = require("../../service/jwt");

async function authMiddleware(request, reply) {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return reply.status(401).json({ success: false, message: 'Token manquant' });
  }

  const { valid, decoded } = verifyToken(token);

  if (!valid) {
    return reply.status(403).json({ success: false, message: "Token invalide" });
  }

  request.user = decoded;
};

module.exports = authMiddleware;
