const defaultSettings = require('../../config/defaultSettings');

async function getSettings(fastify, opts) {
	fastify.get(
		'/settings',
		{ preValidation: [fastify.authenticate] },
		async (request, reply) => {
			const decoded = request.user;

			const stmt = fastify.usersDb.prepare('SELECT * FROM users WHERE id = ?');
			const userData = stmt.get(decoded.userId);

			if (!userData) {
				return reply.code(404).send({success: false, message: `User with id ${decoded.userId} not found`});
			}

			let settings = {};
			try {
				settings = JSON.parse(userData.settings || '{}');
			} catch (e) {
				settings = {};
			}

			const mergedSettings = { ...defaultSettings, ...settings };

			if (!userData.settings || userData.settings === '{}') {
				const updateStmt = fastify.usersDb.prepare(
					'UPDATE users SET settings = ? WHERE id = ?'
				);
				updateStmt.run(JSON.stringify(mergedSettings), decoded.userId);
			}

			const toptpStmt = fastify.usersDb.prepare('SELECT * FROM totp_2fa WHERE user_id = ?');
			const totp = toptpStmt.get(decoded.userId);

			mergedSettings.user = userData.username;
			mergedSettings.email = userData.email;
			mergedSettings.twofa_method = userData.twofa_method;

			if (!userData.phone_number || userData.phone_number.trim() === '') {
				mergedSettings.phone = 'none';
			} else {
				mergedSettings.phone = userData.phone_number;
			}

			if (!totp) {
				mergedSettings.totp = 'unlinked';
			} else {
				mergedSettings.totp = 'linked';
			}

			return reply.send({
				success: true,
				message: 'User settings retrieved successfully.',
				data: mergedSettings,
			}
		);
	});
}

module.exports = getSettings;
