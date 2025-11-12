const qrcode = require('qrcode');
const speakeasy = require('speakeasy');

async function totp(fastify, opts) {
	fastify.post(
		'/generate-totp',
		{ preValidation: [fastify.authenticate] },
		async (request, reply) => {
			const decoded = request.user;

			const stmt = fastify.usersDb.prepare('SELECT * FROM users WHERE id = ?');
			const userData = stmt.get(decoded.userId);

			if (!userData)
				return reply.code(404).send({success: false, message: `User with id ${decoded.userId} not found`});

			try {
				let userSecret;
				const totpStmt = fastify.usersDb.prepare('SELECT * FROM totp_2fa WHERE user_id = ?');
				const totpData = totpStmt.get(decoded.userId);

				if (!totpData) {
					const secret = speakeasy.generateSecret({ length: 20, name: `${decoded.userId}`, issuer: 'fastify' });
					userSecret = secret.base32;

					fastify.usersDb
						.prepare('INSERT INTO totp_2fa (user_id, secret) VALUES (?, ?)')
						.run(decoded.userId, userSecret);

					const data_url = await qrcode.toDataURL(secret.otpauth_url);
					return reply.send({ success: true, qrCode: data_url, secret: secret.base32 });
				} else
					return reply.code(409).send({ success: false, message: 'Totp is already configured'});
			} catch(err) {
				fastify.log.error(err);
				return reply.code(500).send({ success: false, message: err.message });
			}

			return reply.send({
				success: false,
				message: '???',
			}
		);
	});
}

module.exports = totp;
