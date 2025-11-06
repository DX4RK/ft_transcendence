const defaultSettings = require('../../config/defaultSettings');

async function updateSettings(fastify, opts) {
	fastify.post(
		'/settings',
		{ preValidation: [fastify.authenticate] },
		async (request, reply) => {
			const decoded = request.user;
			const body = request.body;

			if (typeof body !== 'object' || body === null)
				return reply.code(400).send({ success: false, message: 'Invalid JSON body.' });

			const keys = Object.keys(body);
			if (keys.length !== 1)
				return reply.code(400).send({success: false, message: 'Body must contain exactly one key.'});

			const key = keys[0];
			const value = body[key];

			if (!(key in defaultSettings) || typeof defaultSettings[key] !== typeof value)
				return reply.code(401).send({ success: false, message: 'Invalid parameters' });

			fastify.usersDb.prepare(`
				UPDATE users
				SET settings = json_set(settings, '$.${key}', json(?))
				WHERE id = ?
			`).run(JSON.stringify(value), decoded.userId);

			return reply.send({
				success: true,
				message: 'Updated settings successfully.',
			}
		);
	});
}

module.exports = updateSettings;
