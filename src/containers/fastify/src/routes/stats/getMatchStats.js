const { verifyToken } = require("../../service/jwt");

async function getMatchStats(fastify, opts) {
	const { verifyToken } = opts;

	fastify.get('/matches/me', async (request, reply) => {
		const authHeader = request.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (!token)
			return reply.code(401).send({ success: false, message: 'Missing token' });

		const { valid, decoded } = verifyToken(token);

		if (!valid)
			return reply.code(403).send({ success: false, message: 'Invalid token' });
		console.log(decoded.userId);

		const stmt = fastify.usersDb.prepare('SELECT * FROM user_matches WHERE user_id = ?');
		const userStats = stmt.get(decoded.userId);

		if (!userStats) {
			return reply.send({
				success: true,
				message: 'No stats yet.',
				data: { matchWon: 0, matchPlayed: 0 }
			});
		}

		return reply.send({
			success: true,
			message: 'User stats retrieved successfully.',
			data: {
				matchWon: userStats.match_won,
				matchLost: userStats.match_played - userStats.match_won,
				matchPlayed: userStats.match_played,
			}
		});
	});
}

module.exports = getMatchStats;
