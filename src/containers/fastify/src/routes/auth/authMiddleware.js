const { verifyToken } = require("../../service/jwt");

async function authMiddleware2(request, reply) {
	const authHeader = request.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return reply.status(401).json({ success: false, message: 'Missing token.' });
	}

	const { valid, decoded } = verifyToken(token);

	if (!valid) {
		return reply.status(403).json({ success: false, message: "Invalid token." });
	}

	request.user = decoded;
};

async function authMiddleware(fastify, opts) {
	const { verifyToken } = opts;

	fastify.post('/test', async (request, reply) => {
		const authHeader = request.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
console.log(authHeader);
		if (!token) {
			return reply.code(401).send({ success: false, message: 'Missing token' });
		}

		const { valid, decoded } = verifyToken(token);

		if (!valid) {
			return reply.code(403).send({ success: false, message: 'Invalid token' });
		}

		return reply.send({
			success: true,
			message: 'Access granted.',
			user: decoded,
		});
	});
}

module.exports = authMiddleware;
