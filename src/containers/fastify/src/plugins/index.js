const cors = require('@fastify/cors');
const cookie = require('@fastify/cookie');
const fastifyIO = require('fastify-better-socket.io');
const fastifyBetterSqlite3 = require('./db.js');
const auth = require('./auth.js');

const registerPlugins = async (fastify) => {
	// CORS
	await fastify.register(cors, {
		origin: 'https://localhost:8443',
		credentials: true,
		methods: ['GET', 'POST']
	});

	// Cookie
	await fastify.register(cookie, {
		secret: process.env.COOKIE_SECRET,
		hook: 'onRequest',
	});

	// Socket.IO
	await fastify.register(fastifyIO, {
		cors: {
			origin: 'https://localhost:8443',
			methods: ['GET', 'POST'],
			credentials: true,
		}
	});

	// Database
	await fastify.register(fastifyBetterSqlite3, {
		name: 'usersDb',
		pathToDb: '/data/users.db',
	});

	// Auth

	await fastify.register(auth);
};

module.exports = registerPlugins;
