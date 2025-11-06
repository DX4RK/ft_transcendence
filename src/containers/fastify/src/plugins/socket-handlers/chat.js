const fp = require('fastify-plugin');

// interface ConnectedUser {
// 	userId: number;
// 	socketId: string;
// }

const getPrivateRoomId = (userId, targetId) => {
	return [userId, targetId].sort().join('-');
}

const extractPrivateRoomMembers = (roomId) => {
	const parts = roomId.split(':');
	return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
}

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

const getRoomMessage = (usersDb, roomId) => {
	const stmt = usersDb.prepare(`
		SELECT
		  m.id,
		  m.room_id,
		  m.user_id,
		  u.username,
		  m.message,
		  m.created_at
		FROM messages m
		LEFT JOIN users u ON u.id = m.user_id
		WHERE m.room_id = ?
		ORDER BY m.created_at ASC
	`);
	return stmt.all(roomId);
}

async function socketChatHandlers(fastify, opts) {
	fastify.addHook('onReady', async () => {
		fastify.socketIO.on('connection', (socket) => {
			socket.on('join-room', (roomId) => {
				if (!socket.userId) return;

				socket.join(`room:${roomId}`);
				const messages = getRoomMessage(fastify.usersDb, roomId);
				fastify.socketIO.to(`room:${roomId}`).emit('room-messages', messages.map(m => ({
					id: String(m.id),
					text: m.message,
					userId: String(m.user_id),
					timestamp: new Date(m.created_at).getTime()
				})));
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

				const roomIndex = getPrivateRoomId(socket.userId, targetSocket.userId);
				try {
					const stmt = fastify.usersDb.prepare('SELECT 1 FROM rooms WHERE room_id = ? LIMIT 1');
					const roomExists = stmt.get(roomIndex);

					if (!roomExists) {
						await fastify.usersDb.prepare(
							`INSERT OR IGNORE INTO rooms (room_id, name, description, is_public, created_by)
							VALUES (?, ?, ?, ?, ?);`
						).run(roomIndex, 'Private Messages', 'Private chat witht the user', 0, socket.userId);
					}

					socket.join(`private:${roomIndex}`);
					targetSocket.join(`private:${roomIndex}`);

					const messages = getRoomMessage(fastify.usersDb, roomIndex);
					fastify.socketIO.to(`private:${roomIndex}`).emit('room-messages', messages.map(m => ({
						id: String(m.id),
						text: m.message,
						userId: String(m.user_id),
						timestamp: new Date(m.created_at).getTime()
					})));

					socket.data.privateRoom = roomIndex;

					fastify.log.info(`User ${socket.userId} joined private room ${roomIndex}`);
				} catch (err) {
					fastify.log.error(`Error handling private room join: ${err.message}`);
					console.error(err);
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
					fastify.log.error(`Error sending message: ${err.message}`);
				}
			});

			socket.on('send-private-message', async (data) => {
				if (!socket.userId) return;

				const { roomId, message } = data;

				try {
					const roomMembers = extractPrivateRoomMembers(roomId);
					const targetId = roomMembers[0] === socket.userId ? roomMembers[1] : roomMembers[0];

					if (isUserBlocked(fastify.usersDb, socket.userId, targetId))
						return;

					const msg = await fastify.usersDb.prepare(
						'INSERT INTO messages (room_id, user_id, message) VALUES (?, ?, ?)'
					).run(roomId, socket.userId, message);

					fastify.socketIO.to(`private:${roomId}`).emit('new-message', {
						id: msg.lastInsertRowid,
						userId: socket.userId,
						text: message,
						timestamp: Date.now()
					});
				} catch (err) {
					fastify.log.error(`Error sending private message: ${err.message}`);
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
