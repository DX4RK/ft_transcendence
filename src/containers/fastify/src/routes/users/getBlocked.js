const isNumber = (result) => {
	return typeof result === 'number';
};

async function getBlocked(fastify, opts) {
	fastify.get(
		'/blocked',
		{ preValidation: [fastify.authenticate] },
		async (request, reply) => {
			const decoded = request.user;

			const stmt = fastify.usersDb.prepare('SELECT * FROM users WHERE id = ?');
			const userData = stmt.get(decoded.userId);

			if (!userData) {
				return reply.code(404).send({success: false, message: `User with id ${decoded.userId} not found`});
			}

			let blocked = [];
			try {
				blocked = JSON.parse(userData.blocked || '[]');
			} catch (e) {
				blocked = [];
			}

			return reply.send({
				success: true,
				message: 'Blocked users retrieved successfully.',
				data: blocked,
			}
		);
	});
}

module.exports = getBlocked;
