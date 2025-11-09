const speakeasy = require('speakeasy');

async function signRoutes(fastify, opts) {
	const { generateToken } = opts;

	fastify.post('/verify', async (request, reply) => {
		const { username, code } = request.body;

		if (!username || !code) {
			return reply.code(400).send({ success: false, message: 'Missing username, or code' });
		}

		try {
			const userStmt = fastify.usersDb.prepare('SELECT * FROM users WHERE username = ?');
			const user = userStmt.get(username);

			if (!user)
				return reply.code(400).send({ success: false, message: 'User not found' });

			if (user.twofa_method == 'totp') {
				const totpStmt = fastify.usersDb.prepare('SELECT * FROM totp_2fa WHERE user_id = ?');
				const totpData = totpStmt.get(decoded.userId);

				if (!totpData)
					return reply.code(400).send({ success: false, message: 'Totp is not linked for this user' });

				const verified = speakeasy.totp.verify({
					secret: totpData.secret,
					encoding: 'base32',
					token: code,
					window: 1
				});

				if (!verified)
					return reply.code(401).send({ success: false, message: 'Invalid code' });
			} else {
				const tmpCodeStmt = fastify.usersDb.prepare('SELECT * FROM tmp_2fa_codes WHERE user_id = ?');
				const tmpCode = tmpCodeStmt.get(user.id);

				if (!tmpCode)
					return reply.code(400).send({ success: false, message: 'No 2FA code found for this user' });

				const now = new Date();
				const expiresAt = new Date(tmpCode.expires_at);
				if (now > expiresAt) {
					fastify.usersDb.prepare('DELETE FROM tmp_2fa_codes WHERE user_id = ?').run(user.id);
					return reply.code(400).send({ success: false, message: 'Code expired. Please request a new one.' });
				}

				if (tmpCode.code !== code)
					return reply.code(400).send({ success: false, message: 'Invalid code' });
				fastify.usersDb.prepare('DELETE FROM tmp_2fa_codes WHERE user_id = ?').run(user.id);
			}

			const token = await generateToken({ userId: user.id });
			return reply
				.setCookie('token', token, {
					httpOnly: true,
					sameSite: 'lax',  // change from 'strict' when prod
					path: '/',
					maxAge: 60 * 60
				})
				.send({ success: true, message: 'Verification successfull', code: token });
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ success: false, message: 'Server error' });
		}
	});
};

module.exports = signRoutes;
