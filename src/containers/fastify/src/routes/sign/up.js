const bcrypt = require('bcrypt');
const crypto = require('crypto');
async function signRoutes(fastify, opts) {
	fastify.post('/up', async (request, reply) => {
		const { username, email, password } = request.body;

		if (!username || !email || !password) {
			return reply.code(400).send({ success: false, message: 'Missing username, email, or password' });
		}

		try {
			const stmt = fastify.usersDb.prepare('SELECT * FROM users WHERE username = ? OR email = ?');
			const user = stmt.get(username, email);

			if (user) {
				return reply.code(400).send({ success: false, message: 'User is already registered' });
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const insertStmt = fastify.usersDb.prepare('INSERT INTO users (username, email, twofa_method, password_hash) VALUES (?, ?, ?, ?)');
			const info = insertStmt.run(username, email, "email", hashedPassword);

			return reply.send({
				success: true,
				message: 'User registered successfully',
				userId: info.lastInsertRowid,
			});
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ success: false, message: 'Server error' });
		}
	});
};

module.exports = signRoutes;
