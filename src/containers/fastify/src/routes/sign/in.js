const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendSMSCode = require('../../service/send/send_sms');
const sendEmailCode = require('../../service/send/send_email');

async function signRoutes(fastify, opts) {
	const { transporter } = opts;
	fastify.post('/in', async (request, reply) => {
		const { username, password } = request.body;

		if (!username || !password) {
			return reply.code(400).send({ success: false, message: 'Missing username, or password' });
		}

		try {
			const stmt = fastify.usersDb.prepare('SELECT * FROM users WHERE username = ?');
			const user = stmt.get(username);

			if (!user) {
				return reply.code(400).send({ success: false, message: 'User not found' });
			}

			const passwordMatch = await bcrypt.compare(password, user.password_hash);

			if (!passwordMatch) {
				return reply.code(401).send({ success: false, message: 'Invalid password' });
			}

			// 2FA SETUP

			const code = crypto.randomInt(100000, 999999).toString();
			const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

			fastify.usersDb
				.prepare('DELETE FROM tmp_2fa_codes WHERE user_id = ?')
				.run(user.id);

			fastify.usersDb
				.prepare('INSERT INTO tmp_2fa_codes (user_id, code, expires_at) VALUES (?, ?, ?)')
				.run(user.id, code, expiresAt);

			if (user.twofa_method == "email") {
				await sendEmailCode(transporter, username, user.email, code);
			}

			return reply.send({
				success: true,
				message: '2FA code sent successfully',
				userId: user.id,
			});
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ success: false, message: 'Server error' });
		}
	});
};

module.exports = signRoutes;
