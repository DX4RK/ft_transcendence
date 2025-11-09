const loggerConfig = require('./config/loggerConfig')
const fastify = require('fastify')({ logger: loggerConfig });

const { port } = require('./config/env');

// Config

// Services
const { createEmailTransporter } = require('./service/email');
const { createVonageClient } = require('./service/sms');
const { generateToken } = require('./service/jwt');

// Plugins and Routes
const registerPlugins = require('./plugins');
const registerRoutes = require('./routes');

// Initialize services
const transporter = createEmailTransporter();
const vonage = createVonageClient();

const start = async () => {
	// const port = await get('srerver');

	try {
		// Register plugins
		await registerPlugins(fastify);

		// Register routes
		await registerRoutes(fastify, {
			transporter,
			vonage,
			generateToken
		});

		// Start server
		await fastify.listen({ port: port || 3000, host: '0.0.0.0' });

		fastify.log.info(`Server listening on port ${port || 3000}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
