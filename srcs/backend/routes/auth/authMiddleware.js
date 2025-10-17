const { verifyToken } = require("../../service/jwt");

async function authMiddleware(request, reply) {
    const cookies = request.unsignCookie(request.cookies?.jwt);

    if (!cookies.valid) {
        return reply.code(401).send({ success: false, message: 'Cookie manquant ou non signé' });
    }

    const token = cookies.value;

    if (!token) {
        return reply.code(401).send({ success: false, message: 'Token manquant' });
    }

    const { valid, decoded } = verifyToken(token);

    if (!valid) {
        return reply.code(403).send({ success: false, message: "Token invalide" });
    }

    request.user = decoded;
};

module.exports = authMiddleware;
