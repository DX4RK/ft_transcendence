const fp = require('fastify-plugin');
const { verifyToken } = require('../../service/jwt');

const connectedSockets = new Map();

function getAllConnectedSockets() {
	return Array.from(connectedSockets.values()).map(socket => {
		return { id: socket.id, userId: socket.userId };
	});
}

async function socketAuthHandlers(fastify, opts) {
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

					console.log(getAllConnectedSockets());
					socket.emit('connected-users', getAllConnectedSockets());

					connectedSockets.set(socket.id, socket);
					socket.emit('authenticated', { userId: decoded.userId });
					fastify.socketIO.emit('user-added', { id: socket.id, userId: decoded.userId });
				} catch (err) {
					console.log(err);
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

			socket.on('disconnect', () => {
				fastify.log.info(`Client disconnected: ${socket.id}`);
				if (socket.userId) {
					connectedSockets.delete(socket.id);
					fastify.socketIO.emit('user-removed', { id: socket.id, userId: socket.userId });
				}
			});

		});
	});
}

module.exports = fp(socketAuthHandlers, {
  fastify: '5.x',
  name: 'socket-auth-handlers',
});
