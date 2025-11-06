const isNumber = (result) => {
	return typeof result === 'number';
};

async function blockUser(fastify, opts) {
	fastify.post(
		'/block',
		{ preValidation: [fastify.authenticate] },
		async (request, reply) => {
			const decoded = request.user;
			const { userId } = request.body;

			if (!isNumber(userId) || userId == decoded.userId)
				return reply.code(401).send({ success: false, message: 'Invalid parameters' });

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

			if (!blocked.includes(userId)) {
				blocked.push(userId);
			}

			if (!userData.blocked || userData.blocked === '[]') {
				const updateStmt = fastify.usersDb.prepare(
					'UPDATE users SET blocked = ? WHERE id = ?'
				);
				updateStmt.run(JSON.stringify(blocked), decoded.userId);
			}

			return reply.send({
				success: true,
				message: 'Blocked user successfully.',
			}
		);
	});
}

module.exports = blockUser;
