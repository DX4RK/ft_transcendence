const fp = require('fastify-plugin');

async function socketNotificationHandlers(fastify, opts) {
	fastify.addHook('onReady', async () => {
		fastify.socketIO.on('connection', (socket) => {

			socket.on('subscribe-notifications', () => {
				console.log("yes?");
				if (!socket.userId) return;

				socket.join(`notifications:${socket.userId}`);
				fastify.log.info(`User ${socket.userId} subscribed to notifications`);
			});
		});
	});

	fastify.decorate('sendNotification', (userId, notification) => {
		fastify.socketIO.to(`notifications:${userId}`).emit('notification', notification);
	});
}

module.exports = fp(socketNotificationHandlers, {
  fastify: '5.x',
  name: 'socket-notification-handlers',
});
