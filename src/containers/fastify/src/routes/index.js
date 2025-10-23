const signRoute = require('./sign/sign');
const verifyRoute = require('./2FA/verify');
const authMiddlewareRoute = require('./auth/authMiddleware');
const socketAuthHandlers = require('../plugins/socket-handlers/auth.js');

const registerRoutes = async (fastify, { transporter, generateToken, verifyToken }) => {
	// Socket handlers
	await fastify.register(socketAuthHandlers);

	// Auth middleware
	await fastify.register(authMiddlewareRoute, { verifyToken });

	// Check
	fastify.get('/', async (request, reply) => {
		return { message: 'Hello from Fastify!' };
	});

	// Feature routes
	await fastify.register(signRoute, {
		prefix: '/sign',
		transporter
	});

	await fastify.register(verifyRoute, {
		prefix: '/twofa',
		generateToken
	});
};

module.exports = registerRoutes;
