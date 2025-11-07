const fp = require('fastify-plugin');

// interface ConnectedUser {
// 	userId: number;
// 	socketId: string;
// }

async function socketChatHandlers(fastify, opts) {
	fastify.addHook('onReady', async () => {
		fastify.socketIO.on('connection', (socket) => {
			// socket.on('join-room', (roomId) => {
			// 	if (!socket.userId) return;

			// 	socket.join(`room:${roomId}`);
			// 	fastify.log.info(`User ${socket.userId} joined room ${roomId}`);

			// 	socket.to(`room:${roomId}`).emit('user-joined', {
			// 		userId: socket.userId,
			// 		roomId
			// 	});
			// });

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

			// socket.on('leave-room', (roomId) => {
			// 	socket.leave(`room:${roomId}`);
			// 	socket.to(`room:${roomId}`).emit('user-left', {
			// 		userId: socket.userId,
			// 		roomId
			// 	});
			// });

			socket.on('message', (msg, callback) => {
                if (msg.startsWith('/invit')) {
                    const parts = msg.split(' ');
                    const targetId = parts[1];
                    // if (clients.includes(targetId)) {
                        fastify.io.to(targetId).emit('invit-game', socket.id);
                        callback({ success: true, message: `Invitation sent to ${targetId}`});
                    // } else {
                    //     callback({ success: false, message: `User ${targetId} not found` });
                    // }
                    return;
                }
                fastify.log.info(socket.id + ": " + msg);
                callback({ success: true, message: `Message reçu : ${msg}` });
                fastify.io.emit('message', `${socket.id} dit : ${msg}`);
            });

            socket.on('priv-message', (dest, msg, callback) => {
                // if (!clients.includes(dest)) {
                //     callback({ success: false, message: `Message not sent. User ${dest} not found.` });
                //     return;
                // }
                // if (blockedUser[dest]?.has(socket.id) || blockedUser[socket.id]?.has(dest)) {
                //     callback({ success: false, message: `Message not sent. You are blocked by ${dest}.` });
                //     return;
                // }
                fastify.log.info(socket.id + " send to " + dest + ": " + msg);
                // for (let clientId of clients) {
                //     if (clientId === dest || clientId === socket.id)
                        fastify.io.to(dest).emit('priv-message', socket.id, `${socket.id} dit : ${msg}`);
                // }
                callback({ success: true, message: `Message reçu : ${msg}` });
            });

            // socket.on('block-user', (user, callback) => {
            //     fastify.log.info(socket.id + " block " + user);
            //     if (!blockedUser[socket.id]) {
            //         blockedUser[socket.id] = new Set();
            //     }
            //     blockedUser[socket.id].add(user);
            //     for (let clientId of clients) {
            //         if (clientId === user || clientId === socket.id)
            //             fastify.io.to(clientId).emit('user-blocked', socket.id, user);
            //     }
            //     callback({ success: true, message: `User ${user} bloked` });
            // });

            socket.on("invit-game", (user, callback) => {
                // if (!clients.includes(user)) {
                //     callback({ success: false, message: `Invite not sent. User ${user} not found.` });
                //     return;
                // }
                // if (blockedUser[user]?.has(socket.id) || blockedUser[socket.id]?.has(user)) {
                //     callback({ success: false, message: `Invite not sent. You are blocked by ${user}.` });
                //     return;
                // }
                fastify.log.info(socket.id + " invite " + user + " to play a game");
                fastify.io.to(user).emit('invit-game', socket.id);
                callback({ success: true, message: `Invitation sent to ${targetId}` });
            });

		});
	});
}

module.exports = fp(socketChatHandlers, {
	fastify: '5.x',
	name: 'socket-chat-handlers',
});
