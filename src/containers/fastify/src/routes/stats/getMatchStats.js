async function getMatchStats(fastify, opts) {
	fastify.get(
		'/matches/me',
		{ preValidation: [fastify.authenticate] },
		async (request, reply) => {
			const decoded = request.user;

			let stmt = fastify.usersDb.prepare('SELECT * FROM user_matches WHERE user_id = ?');
			const userStats = stmt.get(decoded.userId);

			stmt = fastify.usersDb.prepare('SELECT * FROM users WHERE id = ?');
			const userData = stmt.get(decoded.userId);

			if (!userStats) {
				return reply.send({
					success: true,
					message: 'No stats yet.',
					data: {
						username: userData.username,
						xp: userData.experience_point,
						matchWon: 0,
						matchLost: 0,
						matchPlayed: 0,
						history: {},
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
					username: userData.username,
					xp: userData.experience_point,
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
