const fp = require('fastify-plugin');

async function socketAuthHandlers(fastify, opts) {
	fastify.addHook('onReady', async () => {
		fastify.socketIO.on('connection', (socket) => {
			fastify.log.info(`Client connected: ${socket.id}`);
		});
	});
}

module.exports = fp(socketAuthHandlers, {
  fastify: '5.x',
  name: 'socket-auth-handlers',
});
