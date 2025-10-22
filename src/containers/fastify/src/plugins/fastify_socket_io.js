const fastifyPlugin = require('fastify-plugin');
const { Server } = require('socket.io');

/**
 * @typedef {import('socket.io').ServerOptions} ServerOptions
 * @typedef {Partial<ServerOptions> & { preClose?: Function }} SocketIOOptions
 */

/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {SocketIOOptions} options
 */
const socketIO = fastifyPlugin(function (fastify, options) {
  const socketIO = new Server(fastify.server, options);

  fastify.decorate('socketIO', socketIO);

  fastify.addHook('preClose', (done) => {
    if (options.preClose) {
      return options.preClose(done);
    }
    fastify.socketIO.local.disconnectSockets(true);
    done();
  });

  fastify.addHook('onClose', (instance, done) => {
    instance.socketIO.close();
    done();
  });
}, {
  name: 'socket-io'
});

module.exports = socketIO;
