const signInRoute = require('./sign/in');
const signUpRoute = require('./sign/up');

const verifyRoute = require('./2FA/verify');
const totpRoute = require('./2FA/totp');

const getMatchStatsRoute = require('./stats/getMatchStats');
const updateStatsOnMatchFinishRoute = require('./stats/updateStatsOnMatchFinish');

const verifyTokenRoute = require('./auth/verifyToken');

const getSettings = require('./my/getSettings');
const updateSettings = require('./my/updateSettings');
const updatePhone = require('./my/updatePhone');
const updateTwofa = require('./my/updateTwofa');
const disconnect = require('./my/disconnect');

const blockUserRoute = require('./users/block');
const unBlockUserRoute = require('./users/unblock');
const getBlockedRoute = require('./users/getBlocked');

const socketAuthHandlers = require('../plugins/socket-handlers/auth.js');
const socketChatHandlers = require('../plugins/socket-handlers/chat.js');
const socketNotificationHandlers = require('../plugins/socket-handlers/notifications.js');

const registerRoutes = async (fastify, { transporter, vonage, generateToken }) => {
	// Auth
	await fastify.register(verifyTokenRoute, { prefix: '/api/auth' });

	// Users
	await fastify.register(blockUserRoute, { prefix: '/api/users' });
	await fastify.register(unBlockUserRoute, { prefix: '/api/users' });
	await fastify.register(getBlockedRoute, { prefix: '/api/users' });

	// Stats
	await fastify.register(getMatchStatsRoute, { prefix: '/api/stats' });
	await fastify.register(updateStatsOnMatchFinishRoute, { prefix: '/api/stats' });

	// My
	await fastify.register(getSettings, { prefix: '/api/my' });
	await fastify.register(updateSettings, { prefix: '/api/my' });
	await fastify.register(updatePhone, { prefix: '/api/my' });
	await fastify.register(updateTwofa, { prefix: '/api/my' });
	await fastify.register(disconnect, { prefix: '/api/my' });

	// Check
	fastify.get('/api/', async (request, reply) => {
		return { message: 'Hello from Fastify!' };
	});

	// Feature routes
	await fastify.register(signInRoute, {
		prefix: '/api/sign',
		transporter,
		vonage
	});
	await fastify.register(signUpRoute, { prefix: '/api/sign' });

	// 2FA
	await fastify.register(totpRoute, { prefix: '/api/twofa'});
	await fastify.register(verifyRoute, { prefix: '/api/twofa', generateToken});

	// Notifications
	fastify.post('/api/send-notification', async (request, reply) => {
		const { userId, message } = request.body;

		fastify.sendNotification(userId, {
			message,
			timestamp: Date.now()
		});

		return { status: 'sent' };
	});

	// Socket handlers
	await fastify.register(socketAuthHandlers);
	await fastify.register(socketChatHandlers);
	await fastify.register(socketNotificationHandlers);

};

module.exports = registerRoutes;
