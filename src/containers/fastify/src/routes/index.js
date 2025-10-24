const signInRoute = require('./sign/in');
const signUpRoute = require('./sign/up');
const verifyRoute = require('./2FA/verify');
const authMiddlewareRoute = require('./auth/authMiddleware');
const socketAuthHandlers = require('../plugins/socket-handlers/auth.js');
const socketChatHandlers = require('../plugins/socket-handlers/chat.js');

const registerRoutes = async (fastify, { transporter, vonage, generateToken, verifyToken }) => {
	// Socket handlers
	await fastify.register(socketAuthHandlers, { verifyToken });
	await fastify.register(socketChatHandlers);

	// Auth middleware
	await fastify.register(authMiddlewareRoute, { verifyToken });

	// Check
	fastify.get('/', async (request, reply) => {
		return { message: 'Hello from Fastify!' };
	});

	// Feature routes
	await fastify.register(signInRoute, {
		prefix: '/sign',
		transporter,
		vonage
	});
	await fastify.register(signUpRoute, { prefix: '/sign' });

	await fastify.register(verifyRoute, {
		prefix: '/twofa',
		generateToken
	});
};

module.exports = registerRoutes;
