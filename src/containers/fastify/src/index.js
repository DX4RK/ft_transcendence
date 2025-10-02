const fastify = require('fastify')({ logger: true });

const cors = require('@fastify/cors');
const nodemailer = require('nodemailer');
const fastifySqlite = require('fastify-sqlite');
const {Vonage} = require('@vonage/server-sdk');

//const authMiddleware = require('./routes/auth/authMiddleware');
//const { port, gmailUser, gmailPass, vonageKey, vonageSecret } = require("./config/env");
//const { generateToken } = require("./service/jwt");

// PLUGINS

fastify.register(cors, { origin: true });
//fastify.register(fastifySqlite, {
//	dbFile: 'test.db'
//})

// EXTERNAL SERVICES

//const vonage = new Vonage({
//	apiKey: vonageKey,
//	apiSecret: vonageSecret
//});

//const transporter = nodemailer.createTransport({
//	service: 'gmail',
//	auth: {
//		user: gmailUser,
//		pass: gmailPass
//	}
//});

fastify.get('/', async (request, reply) => {
	return { message: 'Hello from Fastify!' };
});

const signRoute = require('./routes/sign/sign')
fastify.register(signRoute, {
	prefix: '/sign'
})

const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
