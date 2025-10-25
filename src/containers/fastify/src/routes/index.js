const signInRoute = require('./sign/in');
const signUpRoute = require('./sign/up');
const verifyRoute = require('./2FA/verify');
const authMiddlewareRoute = require('./auth/authMiddleware');
const socketAuthHandlers = require('../plugins/socket-handlers/auth.js');
const socketChatHandlers = require('../plugins/socket-handlers/chat.js');
const socketNotificationHandlers = require('../plugins/socket-handlers/notifications.js');

const registerRoutes = async (fastify, { transporter, vonage, generateToken, verifyToken }) => {
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

	// Notifications
	fastify.post('/send-notification', async (request, reply) => {
		const { userId, message } = request.body;

		fastify.sendNotification(userId, {
			message,
			timestamp: Date.now()
		});

		return { status: 'sent' };
	});

	// Socket handlers
	await fastify.register(socketAuthHandlers, { verifyToken });
	await fastify.register(socketChatHandlers);
	await fastify.register(socketNotificationHandlers);

};

module.exports = registerRoutes;
