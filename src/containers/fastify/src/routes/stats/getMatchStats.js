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
					data: {
						history: {},
						matchWon: 0,
						matchLost: 0,
						matchPlayed: 0,
					}
				});
			}

			let history = {};
			try {
				history = JSON.parse(userStats.history || '{}');
			} catch (e) {
				history = {};
			}

			return reply.send({
				success: true,
				message: 'User stats retrieved successfully.',
				data: {
					matchWon: userStats.match_won,
					matchLost: (userStats.match_played - userStats.match_won),
					matchPlayed: userStats.match_played,
					history: history,
				}
			}
		);
	});
}

module.exports = getMatchStats;
