const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmailCode = require('../../service/send/send_email');

async function signRoutes(fastify, opts) {
	const { transporter } = opts;
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

			const code = crypto.randomInt(100000, 999999).toString();
			const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
			
			const tmp = fastify.usersDb.prepare('SELECT * FROM users WHERE username = ?');
			const user_id = tmp.get(username).id;

			fastify.usersDb
				.prepare('DELETE FROM tmp_2fa_codes WHERE user_id = ?')
				.run(user_id);
			
			fastify.usersDb
				.prepare('INSERT INTO tmp_2fa_codes (user_id, code, expires_at) VALUES (?, ?, ?)')
				.run(user_id, code, expiresAt);
			
			await sendEmailCode(transporter, username, email, code);

			return reply.send({
				success: true,
				message: 'User registered successfully, 2FA code sent ',
				userId: info.lastInsertRowid,
			});
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ success: false, message: 'Server error' });
		}
	});
};

module.exports = signRoutes;
