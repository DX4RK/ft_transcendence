async function authMiddleware(fastify, opts) {
	fastify.post(
		'/test',
		{ preValidation: [fastify.authenticate] },
		async (request, reply) => {
			const decoded = request.user;

			return reply.send({
				success: true,
				message: 'Access granted.',
				user: decoded,
			}
		);
	});
}

module.exports = authMiddleware;
