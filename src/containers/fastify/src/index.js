const fastify = require('fastify')({ logger: true });

const cors = require('@fastify/cors');
const nodemailer = require('nodemailer');
const {Vonage} = require('@vonage/server-sdk');

const fastifyBetterSqlite3 = require('./plugins/db.js');

//const authMiddleware = require('./routes/auth/authMiddleware');
const { port, gmailUser, gmailPass, vonageKey, vonageSecret } = require("./config/env");
//const { generateToken } = require("./service/jwt");

// PLUGINS

fastify.register(cors, { origin: true });
fastify.register(fastifyBetterSqlite3, {
  name: 'usersDb',
  pathToDb: '/data/users.db',
});


// EXTERNAL SERVICES

//const vonage = new Vonage({
//	apiKey: vonageKey,
//	apiSecret: vonageSecret
//});
console.log(gmailPass);
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: "fttranscendence03@gmail.com",
		pass: "rqws vbkc xjyl mcoe"
	}
});

fastify.get('/', async (request, reply) => {
	return { message: 'Hello from Fastify!' };
});

const signRoute = require('./routes/sign/sign')
fastify.register(signRoute, {
	prefix: '/sign',
	transporter
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
