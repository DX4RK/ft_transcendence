const isValidTwofa = (option) => {
	return typeof option === 'string' && (option === 'email' || option === 'phone' || option === 'totp');
};

async function updateTwofa(fastify, opts) {
	fastify.post(
		'/change-twofa',
		{ preValidation: [fastify.authenticate] },
		async (request, reply) => {
			const decoded = request.user;
			const { option } = request.body;

			if (!option || option.length < 1 || !isValidTwofa(option))
				return reply.code(400).send({ success: false, message: 'Invalid twofa option.' });

			const updateStmt = fastify.usersDb.prepare(
				'UPDATE users SET twofa_method = ? WHERE id = ?'
			);

			try {
				const changeResult = updateStmt.run(option, decoded.userId);
				if (changeResult.changes === 0) {
					return reply.code(404).send({ success: false, message: 'User not found.' });
				}
				return reply.send({ success: true, message: 'Updated method successfully.', option });
			} catch (err) {
				console.error(err);
				return
			}
			return reply.send({
				success: true,
				message: 'Updated method successfully.',
			}
		);
	});
}

module.exports = updateTwofa;
