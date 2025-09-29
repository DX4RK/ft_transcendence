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
