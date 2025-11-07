const defaultSettings = require('../../config/defaultSettings');

const isValidE164 = (phone) => {
	const e164Regex = /^\+[1-9]\d{1,14}$/;
	return e164Regex.test(phone);
}

async function updatePhone(fastify, opts) {
	fastify.post(
		'/change-phone',
		{ preValidation: [fastify.authenticate] },
		async (request, reply) => {
			const decoded = request.user;
			const { phoneNumber } = request.body;

			if (!phoneNumber || phoneNumber.length < 1 || !isValidE164(phoneNumber))
				return reply.code(400).send({ success: false, message: 'Invalid phone format.' });

			const updateStmt = fastify.usersDb.prepare(
				'UPDATE users SET phone_number = ? WHERE id = ?'
			);

			try {
				const changeResult = updateStmt.run(phoneNumber, decoded.userId);
				if (changeResult.changes === 0) {
					return reply.code(404).send({ success: false, message: 'User not found.' });
				}
				return reply.send({ success: true, message: 'Updated phone successfully.', phoneNumber });
			} catch (err) {
				console.error(err);
				return
			}
			return reply.send({
				success: true,
				message: 'Updated phone successfully.',
			}
		);
	});
}

module.exports = updatePhone;
