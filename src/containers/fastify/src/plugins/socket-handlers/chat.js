const fp = require('fastify-plugin');

// interface ConnectedUser {
// 	userId: number;
// 	socketId: string;
// }

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

			socket.on('join-private-room', async (targetSocketId) => {
				if (!socket.userId || typeof targetSocketId !== 'string') return;

				const targetSocket = fastify.io.sockets.sockets.get(targetSocketId);
				if (!targetSocket) return;

				const userIds = [socket.userId, targetSocket.userId];
				userIds.sort((a, b) => a - b);

				const roomIndex = `${userIds[0]}:${userIds[1]}`;

				try {
					const roomExists = await fastify.usersDb.get(
						'SELECT 1 FROM rooms WHERE room_id = $roomId LIMIT 1',
						{ $roomId: roomIndex }
					);

					if (!roomExists) {
						await fastify.usersDb.prepare(
							`INSERT INTO rooms (room_id, name, description, is_public, created_by)
							VALUES ($roomId, 'Private Chat', 'Private chat room for two users', 0, NULL)`
						).run({
							$roomId: roomIndex
						});
					}

					socket.join(`private:${roomIndex}`);
					targetSocket.join(`private:${roomIndex}`);

					socket.set(`private:${roomIndex}`, true);

					fastify.log.info(`User ${socket.userId} joined private room ${roomIndex}`);
				} catch (err) {
					fastify.log.error('Error handling private room join:', err);
				}
			});

			socket.on('send-message', async (data) => {
				if (!socket.userId) return;

				const { roomId, message } = data;

				try {
					const msg = await fastify.usersDb.prepare(
						'INSERT INTO messages (room_id, user_id, message) VALUES (?, ?, ?)'
					).run(roomId, socket.userId, message);

					fastify.socketIO.to(`room:${roomId}`).emit('new-message', {
						id: msg.lastInsertRowid,
						userId: socket.userId,
						text: message,
						timestamp: Date.now()
					});
				} catch (err) {
					fastify.log.error('Error sending message:', err);
				}
			});

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
