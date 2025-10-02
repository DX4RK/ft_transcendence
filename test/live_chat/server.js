const fastify = require('fastify')({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    }
  }
});

const cors = require('@fastify/cors'); 

//----------------
//  Message
//----------------

io.on("connection", (socket) => {
  fastify.console.log("new connection !!");
});

socket.on("message", (arg, callback) => {
  console.log(arg); // "world"

  // envoyer a tout les utilisateurs

  callback("got it");
});

//----------------
//  Start
//----------------

const start = async () => {
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`Serveur lancé sur http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
