const fastify = require('fastify')({ logger: true });

const cors = require('@fastify/cors');
const cookie = require('@fastify/cookie');

const nodemailer = require('nodemailer');
const {Vonage} = require('@vonage/server-sdk');

const fastifyBetterSqlite3 = require('./plugins/db.js');
const fastifyIO = require('./plugins/fastify_socket_io.js');
const authMiddlewareRoute = require('./routes/auth/authMiddleware');

//const authMiddleware = require('./routes/auth/authMiddleware');
const { port, gmailUser, gmailPass, vonageKey, vonageSecret } = require("./config/env");
const { generateToken, verifyToken } = require("./service/jwt");

/**
 * Plugins
 * this part register plugins to fastify
*/

fastify.register(cors, {
	origin: "http://localhost:8080",
	credentials: true,
	methods: ["GET", "POST"]
});

fastify.register(cookie, {
	secret: process.env.COOKIE_SECRET,
	hook: 'onRequest',
});

fastify.register(fastifyIO, {
	cors: {
		origin: "http://localhost:8080",
		methods: ["GET", "POST"]
	}
});

fastify.register(fastifyBetterSqlite3, {
  name: 'usersDb',
  pathToDb: '/data/users.db',
});

fastify.register(authMiddlewareRoute, { verifyToken });

/**
 * External Services
 * this part initialize external services
*/

//const vonage = new Vonage({
//	apiKey: vonageKey,
//	apiSecret: vonageSecret
//});

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: gmailUser,
		pass: gmailPass
	}
});

/**
 * Routes
 * this part initialize routes for fastify
*/

fastify.get('/', async (request, reply) => {
	return { message: 'Hello from Fastify!' };
});

const signRoute = require('./routes/sign/sign')
fastify.register(signRoute, {
	prefix: '/sign',
	transporter
})

const verifyRoute = require('./routes/2FA/verify')
fastify.register(verifyRoute, {
	prefix: '/twofa',
	generateToken
})

fastify.ready().then(() => {
	fastify.socketIO.on("connection", (socket) => {
		console.log("hellooo");
	});
});

const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
