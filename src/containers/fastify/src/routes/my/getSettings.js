const { verifyToken } = require("../../service/jwt");
const defaultSettings = require('../../config/defaultSettings');

async function getSettings(fastify, opts) {
	const { verifyToken } = opts;

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

			console.log(mergedSettings);

			return reply.send({
				success: true,
				message: 'User settings retrieved successfully.',
				data: mergedSettings,
			}
		);
	});
}

module.exports = getSettings;
