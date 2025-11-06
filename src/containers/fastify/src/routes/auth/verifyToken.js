async function verifyToken(fastify, opts) {
	fastify.get(
		'/verify',
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

module.exports = verifyToken;
