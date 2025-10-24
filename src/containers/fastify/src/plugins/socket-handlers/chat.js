const fp = require('fastify-plugin');

async function socketChatHandlers(fastify, opts) {
	fastify.addHook('onReady', async () => {
		fastify.socketIO.on('connection', (socket) => {
			socket.on('join-room', (roomId) => {
				if (!socket.userId) return;

				socket.join(`room:${roomId}`);
				fastify.log.info(`User ${socket.userId} joined room ${roomId}`);

				socket.to(`room:${roomId}`).emit('user-joined', {
					userId: socket.userId,
					roomId
				});
			});

			// BETA (DB CRASH)
			/*socket.on('send-message', async (data) => {
				if (!socket.userId) return;

				const { roomId, message } = data;

				const msg = await fastify.usersDb.prepare(
					'INSERT INTO messages (room_id, user_id, message) VALUES (?, ?, ?)'
				).run(roomId, socket.userId, message);

				fastify.socketIO.to(`room:${roomId}`).emit('new-message', {
					id: msg.lastInsertRowid,
					userId: socket.userId,
					message,
					timestamp: Date.now()
				});
			});*/

			socket.on('leave-room', (roomId) => {
				socket.leave(`room:${roomId}`);
				socket.to(`room:${roomId}`).emit('user-left', {
					userId: socket.userId,
					roomId
				});
			});
		});
	});
}

module.exports = fp(socketChatHandlers, {
	fastify: '5.x',
	name: 'socket-chat-handlers',
});
