const fs = require('fs');
const path = require('path');
const loggerConfig = require('./config/loggerConfig')
// const fastifyHttps = require('fastifyHttps')({ logger: loggerConfig });

// Config
const env = require('./config/env');

// Services
const { createEmailTransporter } = require('./service/email');
const { createVonageClient } = require('./service/sms');
const { generateToken } = require('./service/jwt');

// Plugins and Routes
const registerPlugins = require('./plugins');
const registerRoutes = require('./routes');

const keyPath = path.join(__dirname, '..', 'certs', 'server.key');
const certPath = path.join(__dirname, '..', 'certs', 'server.crt');

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
	console.error('SSL certificates not found! Please create server.key and server.crt in the ./certs folder.');
	process.exit(1);
}

const fastify = require('fastify')({
	logger: loggerConfig,
	https: {
	  key: fs.readFileSync(keyPath),
	  cert: fs.readFileSync(certPath),
	},
});

// fastifyHttps.setPrefix('/api');

const start = async () => {
	try {
		// Wait for configuration to be available
		const config = await env.getConfig();

		// Initialize services
		const transporter = await createEmailTransporter();
		const vonage = await createVonageClient();

		// Register plugins
		await registerPlugins(fastify);

		// Register routes
		await registerRoutes(fastify, {
			transporter,
			vonage,
			generateToken
		});

		// Start server
		// await fastifyHttps.listen({ port: config.port || 3000, host: '0.0.0.0' });
		await fastify.listen({ port: config.port || 3000, host: '0.0.0.0' });
		fastify.log.info(`Server listening on port ${config.port || 3000}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
