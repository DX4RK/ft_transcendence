const fp = require('fastify-plugin');

async function socketAuthHandlers(fastify, opts) {
	const { verifyToken } = opts;

	fastify.addHook('onReady', async () => {
		fastify.socketIO.on('connection', (socket) => {
			fastify.log.info(`Client connected: ${socket.id}`);

			socket.on('authenticate', async (token) => {
				try {
					const { valid, decoded } = verifyToken(token);

					if (!valid) {
						socket.emit('auth-error', { message: 'Invalid or expired token' });
						fastify.log.warn('Socket authentication failed: invalid token');
						socket.disconnect();
						return;
					}

					socket.userId = decoded.userId;
					socket.join(`user:${decoded.userId}`);

					fastify.log.info(`User ${decoded.userId} authenticated`);
					socket.emit('authenticated', { userId: decoded.userId });
				} catch (err) {
					fastify.log.error('Authentication failed:', err);
					socket.emit('auth-error', { message: 'Invalid token' });
					socket.disconnect();
				}
			});

			socket.use((packet, next) => {
				if (packet[0] === 'authenticate') {
					return next();
				}
				if (!socket.userId) {
					return next(new Error('Not authenticated'));
				}
				next();
			});

			// socket.on('disconnect', () => {
			// 	fastify.log.info(`Client disconnected: ${socket.id}`);
			// });

			socket.on('disconnect', () => {
                socket.broadcast.emit('disconnected-user', socket.id);
                // const index = clients.indexOf(socket.id);
                // if (index > -1)
                //     clients.splice(index, 1);
                // delete blockedUser[socket.id];
                // for (const user in blockedUser) {
                //     blockedUser[user].delete(socket.id);
                // }
                fastify.log.info(`Client déconnecté : ${socket.id}`);
            });

		});
	});
}

module.exports = fp(socketAuthHandlers, {
  fastify: '5.x',
  name: 'socket-auth-handlers',
});
