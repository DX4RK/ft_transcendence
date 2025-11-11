const fp = require('fastify-plugin');
const { verifyToken } = require('../../service/jwt');
const jwt = require('jsonwebtoken');
const { get } = require("../../config/env");

const connectedSockets = new Map();

function getAllConnectedSockets() {
	return Array.from(connectedSockets.values()).map(socket => {
		return { id: socket.id, userId: socket.userId };
	});
}

async function socketAuthHandlers(fastify, opts) {
	fastify.addHook('onReady', async () => {
		fastify.socketIO.use(async (socket, next) => {
			const cookieHeader = socket.handshake.headers.cookie;
			if (!cookieHeader) {
				console.log("eoweh");
				socket.emit('auth-error', { message: 'Invalid or expired token' });
				return socket.disconnect();
			}

			const cookies = Object.fromEntries(
				cookieHeader.split(';').map(c => {
					const [key, ...v] = c.trim().split('=');
					return [key, decodeURIComponent(v.join('='))];
				})
			);

			const token = cookies['token']
			if (!token) {
				socket.emit('auth-error', { message: 'Token not found' });
				return socket.disconnect();
			};

			const jwtSecret = await get('jwtSecret');
			const decoded = jwt.verify(token, jwtSecret);

			if (!decoded) {
				socket.emit('auth-error', { message: 'Invalid or expired token' });
				return socket.disconnect();
			}

			socket.userId = decoded.userId;
			socket.join(`user:${decoded.userId}`);
			fastify.log.info(`User ${decoded.userId} authenticated`);
			next();
		});
		fastify.socketIO.on('connection', (socket) => {
			fastify.log.info(`Client connected: ${socket.id}`);

			socket.on('initLiveChat', () => {
				socket.emit('connected-users', getAllConnectedSockets());
				socket.emit('authenticated', { userId: socket.userId });
				connectedSockets.set(socket.id, socket);
				fastify.socketIO.emit('user-added', { id: socket.id, userId: socket.userId });
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
