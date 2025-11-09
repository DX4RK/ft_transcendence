const fp = require('fastify-plugin');
const fastifyJwt = require('@fastify/jwt');
const env = require("../config/env");

module.exports = fp(async function (fastify, opts) {
	const jwtSecret = await env.get('jwtSecret');
	
	fastify.register(fastifyJwt, { secret: jwtSecret });

	fastify.decorate(
		'authenticate',
		async (request, reply) => {
			try {
				await request.jwtVerify();
			} catch (error) {
				throw fastify.httpErrors.unauthorized();
			}
		}
	);
});
