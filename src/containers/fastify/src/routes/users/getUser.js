const isNumber = (result) => {
	return typeof result === 'number';
};

async function getUser(fastify, opts) {
	fastify.get('/:id', async (request, reply) => {
		const { id } = request.params;

		const stmt = fastify.usersDb.prepare('SELECT * FROM users WHERE id = ?');
		const userData = stmt.get(id);

		if (!userData)
			return reply.code(404).send({success: false, message: `User with id ${id} not found`});

		const data = {
			
		}

		return reply.send({
			success: true,
			message: 'Blocked users retrieved successfully.',
			data: blocked,
		});
	});
}

module.exports = getUser;
