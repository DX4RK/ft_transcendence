const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendSMSCode = require('../../service/send/send_sms');
const sendEmailCode = require('../../service/send/send_email');

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

			if (!user) {
				return reply.code(400).send({ success: false, message: 'User not found' });
			}

			const tmpCodeStmt = fastify.usersDb.prepare('SELECT * FROM tmp_2fa_codes WHERE user_id = ?');
			const tmpCode = tmpCodeStmt.get(user.id);

			if (!tmpCode) {
				return reply.code(400).send({ success: false, message: 'No 2FA code found for this user' });
			}

			const now = new Date();
			const expiresAt = new Date(tmpCode.expires_at);
			if (now > expiresAt) {
				fastify.usersDb.prepare('DELETE FROM tmp_2fa_codes WHERE user_id = ?').run(user.id);
				return reply.code(400).send({ success: false, message: 'Code expired. Please request a new one.' });
			}

			if (tmpCode.code !== code) {
				return reply.code(400).send({ success: false, message: 'Invalid code' });
			}

			fastify.usersDb.prepare('DELETE FROM tmp_2fa_codes WHERE user_id = ?').run(user.id);

			const token = generateToken({ userId: user.id });
			return reply.send({
				success: true,
				message: '2FA verfication went successfull',
				code: token,
			});
		} catch (err) {
			fastify.log.error(err);
			return reply.code(500).send({ success: false, message: 'Server error' });
		}
	});

	fastify.post('/test', async (request, reply) => {

	});
};

module.exports = signRoutes;
