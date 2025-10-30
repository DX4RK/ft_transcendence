async function getMatchStats(fastify, opts) {
	fastify.get(
		'/matches/me',
		{ preValidation: [fastify.authenticate] },
		async (request, reply) => {
			const decoded = request.user;

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
			}
		);
	});
}

module.exports = getMatchStats;
