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
const cookie = require('@fastify/cookie'); 
const nodemailer = require('nodemailer');
const {Vonage} = require('@vonage/server-sdk');

const authMiddleware = require('./routes/auth/authMiddleware');
const { port, gmailUser, gmailPass, vonageKey, vonageSecret, cookieSecret } = require("./config/env");
const { generateToken, verifyToken } = require("./service/jwt");

const fastifyIO = require('fastify-socket.io');

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

const clients = [];
const blockedUser = {};

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

fastify.post('/logout', async (request, reply) => { // pour logout (pas encore utilisé)
    reply
        .clearCookie('jwt', { path: '/' })
        .send({ success: true, message: 'Déconnecté' });
});

//----------------
//  PROFIL
//----------------

fastify.get('/profil', { preHandler: authMiddleware }, async (request, reply) => {
    return { success: true, message: 'Accès autorisé au profil', user: request.user };
});

//----------------
// Start
//----------------

const start = async () => {
    try {
        await fastify.register(cors, {
            origin: "http://localhost:5500",
            credentials: true,
            methods: ["GET", "POST"]
        });

        await fastify.register(cookie, {
            secret: process.env.COOKIE_SECRET,
            hook: 'onRequest',
        });

        await fastify.register(fastifyIO, {
            cors: {
                origin: 'http://localhost:5500',
                methods: ['GET', 'POST']
            }
        });

        fastify.io.use((socket, next) => {
            const cookies = socket.request.headers.cookie;
            if (!cookies) {
                return next(new Error("No cookies provided"));
            }

            const parsed = fastify.parseCookie(cookies);
            const signed = fastify.unsignCookie(parsed.jwt);

            if (!signed.valid) {
                return next(new Error("Invalid or tampered cookie"));
            }

            try {
                const decoded = verifyToken(signed.value);
                socket.user = decoded;
                next();
            } catch (err) {
                next(new Error("Invalid token"));
            }
        });

        fastify.io.on('connection', (socket) => {
            fastify.log.info(`Nouveau client connecté : ${socket.id}`);
            clients.push(socket.id);
            socket.emit('list-connected-user', clients.filter(id => id !== socket.id));
            socket.broadcast.emit('connected-user', socket.id);

            socket.on('disconnect', () => {
                socket.broadcast.emit('disconnected-user', socket.id);
                const index = clients.indexOf(socket.id);
                if (index > -1)
                    clients.splice(index, 1);
                delete blockedUser[socket.id];
                for (const user in blockedUser) {
                    blockedUser[user].delete(socket.id);
                }
                fastify.log.info(`Client déconnecté : ${socket.id}`);
            });

            socket.on('message', (msg, callback) => { // message pour le chat public
                if (msg.startsWith('/invit')) { // commande pour inviter un user a jouer
                    const parts = msg.split(' ');
                    const targetId = parts[1];
                    if (clients.includes(targetId)) {
                        fastify.io.to(targetId).emit('notify-invit-game', `Invitation to play from ${socket.id}`);
                        callback({ success: true, message: `Invitation sent to ${targetId}` });
                    } else {
                        callback({ success: false, message: `User ${targetId} not found` });
                    }
                    return;
                }
                fastify.log.info(socket.id + ": " + msg);
                callback({ success: true, message: `Message reçu : ${msg}` });
                fastify.io.emit('message', socket.id, msg);
            });

            socket.on('priv-message', (dest, msg, callback) => {
                if (!clients.includes(dest)) {
                    callback({ success: false, message: `Message not sent. User ${dest} not found.` });
                    return;
                }
                if (blockedUser[dest]?.has(socket.id) || blockedUser[socket.id]?.has(dest)) {
                    callback({ success: false, message: `Message not sent. You are blocked by ${dest}.` });
                    return;
                }
                fastify.log.info(socket.id + " send to " + dest + ": " + msg);
                for (let clientId of clients) {
                    if (clientId === dest || clientId === socket.id) // ajouter une condition si blocked
                        fastify.io.to(clientId).emit('priv-message', socket.id, `${socket.id} dit : ${msg}`);
                }
                callback({ success: true, message: `Message reçu : ${msg}` });
            });

            socket.on('block-user', (user, callback) => { // y faudra rajoute une liste pour stoquer les user blocker et leur interdir les futur message
                fastify.log.info(socket.id + " block " + user);
                if (!blockedUser[socket.id]) {
                    blockedUser[socket.id] = new Set();
                }
                blockedUser[socket.id].add(user);
                for (let clientId of clients) {
                    if (clientId === user || clientId === socket.id)
                        fastify.io.to(clientId).emit('block-user', socket.id, user);
                }
                callback({ success: true, message: `User ${user} bloked` });
            });
        });

        const server = await fastify.listen({ port, host: '0.0.0.0' });
        fastify.log.info(`Serveur lancé sur http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
