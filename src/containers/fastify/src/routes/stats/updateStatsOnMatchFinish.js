const isNumber = (result) => {
	return typeof result === 'number';
};

const isValidData = (data) =>
	typeof data?.score === "number" &&
	typeof data?.name === "string" &&
	data.name.length > 0;

async function updateStatsOnMatchFinish(fastify, opts) {
	fastify.post(
		'/match-finished',
		{ preValidation: [fastify.authenticate] },
		async (request, reply) => {
			const decoded = request.user;
			const { userData, guestData } = request.body;

			if (!isValidData(userData) || !isValidData(guestData))
				return reply.code(401).send({ success: false, message: 'Invalid parameters' });

			console.log(decoded.userId);

			const history = {
				players: [userData.name, guestData.name],
				score: {
					[userData.name]: userData.score,
					[guestData.name]: guestData.score
				},
				date: new Date().toISOString()
			};

			const userWon = userData.score > guestData.score ? 1 : 0;
			const row = fastify.usersDb.prepare(`SELECT history FROM user_matches WHERE user_id = ?`).get(decoded.userId);

			let newHistory = [];
			if (row && row.history) {
				try {
					newHistory = JSON.parse(row.history);
				} catch (e) {
					newHistory = [];
				}
			}
			newHistory.push(history);

			fastify.usersDb.prepare(`
				INSERT INTO user_matches (user_id, match_played, match_won, history)
				VALUES (?, 1, ?, json(?))
				ON CONFLICT(user_id)
				DO UPDATE SET
				    match_played = match_played + 1,
				    match_won = match_won + ?,
				    history = json(?)
			`).run(decoded.userId, userWon, JSON.stringify(newHistory), userWon, JSON.stringify(newHistory));

			return reply.send({
				success: true,
				message: 'Updated stats successfully.',
			}
		);
	});
}

module.exports = updateStatsOnMatchFinish;
