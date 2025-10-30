const { verifyToken } = require("../../service/jwt");
const defaultSettings = require('../../config/defaultSettings');

async function getSettings(fastify, opts) {
	const { verifyToken } = opts;

	fastify.get('/settings', async (request, reply) => {
		const authHeader = request.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (!token)
			return reply.code(401).send({ success: false, message: 'Missing token' });

		const { valid, decoded } = verifyToken(token);

		if (!valid)
			return reply.code(403).send({ success: false, message: 'Invalid token' });

		const stmt = fastify.usersDb.prepare('SELECT * FROM users WHERE id = ?');
		const userData = stmt.get(decoded.userId);

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
		});
	});
}

module.exports = getSettings;
