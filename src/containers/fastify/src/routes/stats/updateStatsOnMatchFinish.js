const { verifyToken } = require("../../service/jwt");

const isNumber = (result) => {
  return typeof result === 'number';
};

async function updateStatsOnMatchFinish(fastify, opts) {
	const { verifyToken } = opts;

	fastify.post('/match-finished', async (request, reply) => {
		const authHeader = request.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		const { userResult, guestResult } = request.body;

		if (!isNumber(userResult) || !isNumber(guestResult))
			return reply.code(401).send({ success: false, message: 'Invalid parameters' });

		if (!token)
			return reply.code(401).send({ success: false, message: 'Missing token' });

		const { valid, decoded } = verifyToken(token);

		if (!valid)
			return reply.code(403).send({ success: false, message: 'Invalid token' });
		console.log(decoded.userId);

		const userWon = userResult > guestResult ? 1 : 0;
		fastify.usersDb.prepare(`
			INSERT INTO user_matches (user_id, match_played, match_won)
			VALUES (?, 1, ?)
			ON CONFLICT(user_id)
			DO UPDATE SET match_played = match_played + 1, match_won = match_won + ?
		`).run(decoded.userId, userWon, userWon);

		return reply.send({
			success: true,
			message: 'Updated stats successfully.',
		});
	});
}

module.exports = updateStatsOnMatchFinish;
