const fp = require('fastify-plugin');
const jwt = require('jsonwebtoken');
const { get } = require("../config/env");

module.exports = fp(async function (fastify, opts) {
	fastify.decorate('authenticate', async (request, reply) => {
		try {
			const token = request.cookies.token;

			if (!token)
				return reply.code(401).send({ success: false, message: 'No token provided' });

			const jwtSecret = await get('jwtSecret');
			const decoded = jwt.verify(token, jwtSecret);
			request.user = decoded;

		} catch (error) {
			return reply.code(401).send({ success: false, message: 'Invalid authorization' });
		}
	});
});
