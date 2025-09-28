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
const nodemailer = require('nodemailer');
const {Vonage} = require('@vonage/server-sdk');

const authMiddleware = require('./routes/auth/authMiddleware');
const { port, gmailUser, gmailPass, vonageKey, vonageSecret } = require("./config/env");
const { generateToken } = require("./service/jwt");

//----------------
// Plugins
//----------------

fastify.register(cors, { origin: true });

//----------------
// Services externes
//----------------

const vonage = new Vonage({
  apiKey: vonageKey,
  apiSecret: vonageSecret
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPass
  }
});

//----------------
// Variables en mémoire (à remplacer par DB + hashage)
//----------------

const clients_password = new Map(); 
const clients_phone = new Map();
const clients_email = new Map();
const clients_method_2fa = new Map();
const code_tmp_2fa = new Map();
const code_totp_2fa = new Map();

//----------------
// Routes
//----------------

fastify.register(require('./routes/sign/sign'), {
  prefix: '/sign',
  vonage,
  transporter,
  clients_password,
  clients_phone,
  clients_email,
  clients_method_2fa,
  code_tmp_2fa
});

fastify.register(require('./routes/2fa/sms'), {
  prefix: '/sms',
  vonage,
  clients_phone,
  clients_method_2fa,
  code_tmp_2fa,
  generateToken
});

fastify.register(require('./routes/2fa/email'), {
  prefix: '/email',
  transporter,
  clients_email,
  clients_method_2fa,
  code_tmp_2fa,
  generateToken
});

fastify.register(require('./routes/2fa/totp'), {
  prefix: '/totp',
  clients_method_2fa,
  code_totp_2fa,
  generateToken
});

//----------------
//  PROFIL
//----------------

fastify.post('/profil', { preHandler: authMiddleware }, async (request, reply) => {
  return { success: true, message: 'Accès autorisé au profil', user: request.user };
});

//----------------
// Start
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
