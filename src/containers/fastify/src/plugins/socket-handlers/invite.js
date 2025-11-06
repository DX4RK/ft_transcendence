const fp = require('fastify-plugin');

const isUserBlocked = (usersDb, userId, targetId) => {
	const stmt = usersDb.prepare('SELECT * FROM users WHERE id = ?');
	const userData = stmt.get(targetId);

	if (!userData) return false;

	let blocked = [];
	try {
		blocked = JSON.parse(userData.blocked || '[]');
	} catch (e) {
		blocked = [];
	}

	return blocked.includes(userId);
}

async function socketChatHandlers(fastify, opts) {
	fastify.addHook('onReady', async () => {
		fastify.socketIO.on('connection', (socket) => {
			socket.on('invite', async (targetSocketId) => {
				if (!socket.userId || typeof targetSocketId !== 'string') return;

				const targetSocket = fastify.io.sockets.sockets.get(targetSocketId);
				if (!targetSocket) return;

				try {
					if (isUserBlocked(fastify.usersDb, socket.userId, targetId))
						return;

					// invnite context
				} catch (err) {
					fastify.log.error(`Error handling private room join: ${err.message}`);
				}
			});
		});
	});
}

module.exports = fp(socketChatHandlers, {
	fastify: '5.x',
	name: 'socket-chat-handlers',
});
