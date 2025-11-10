async function disconnect(fastify, opts) {
	fastify.post(
		'/disconnect',
		{ preValidation: [fastify.authenticate] },
		async (request, reply) => {
			return reply
			.clearCookie('token', {
				path: '/',
			})
			.send({
				success: true,
				message: 'Logged out successfully.',
			}
		);
	});
}

module.exports = disconnect;
