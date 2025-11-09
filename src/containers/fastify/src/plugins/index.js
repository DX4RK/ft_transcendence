const cors = require('@fastify/cors');
const cookie = require('@fastify/cookie');
const fastifyIO = require('fastify-better-socket.io');
const fastifyBetterSqlite3 = require('./db.js');
const auth = require('./auth.js');
const { cookieSecret } = require('../config/env');

const registerPlugins = async (fastify) => {
	// CORS
	await fastify.register(cors, {
		origin: 'http://localhost:5173',
		credentials: true,
		methods: ['GET', 'POST']
	});

	// Cookie
	await fastify.register(cookie, {
		secret: cookieSecret,
		hook: 'onRequest',
	});

	// Socket.IO
	await fastify.register(fastifyIO, {
		cors: {
			origin: 'http://localhost:5173',
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
