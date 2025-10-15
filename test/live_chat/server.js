//----------------
//  Notes
//----------------
//
// y faut faire un middleware pour le jwt pour authentifier les user
//
// y faut faire une liste pour stoquer les user blocker et leur interdir les futur message
//
// gerer les invitation de jeu
// 
// faire des notification pour les parties a venir dans le tournoi
//
//----------------

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
const fastifyIO = require('fastify-socket.io');
const { port } = require("./config/env");
const { text } = require('stream/consumers');

//----------------
//  Start
//----------------

const clients = [];

const start = async () => {
    try {
        await fastify.register(cors, {
            origin: "http://localhost:5500",
            methods: ["GET", "POST"]
        });

        await fastify.register(fastifyIO, {
            cors: {
                origin: 'http://localhost:5500',
                methods: ['GET', 'POST']
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
                fastify.log.info(`Client déconnecté : ${socket.id}`);
            });

            socket.on('message', (msg, callback) => { // message pour le chat public
                if (msg.startsWith('/invit')) { // commande pour inviter un user a jouer
                    const parts = msg.split(' ');
                    const targetId = parts[1];
                    if (clients.includes(targetId)) {
                        fastify.io.to(targetId).emit('notify-invit-game', `Invitation to play from ${socket.id}`);
                        callback(`Invitation sent to ${targetId}`);
                    } else {
                        callback(`User ${targetId} not found`);
                    }
                    return;
                }
                fastify.log.info(socket.id + ": " + msg);
                callback(`Message reçu : ${msg}`);
                fastify.io.emit('message', socket.id, msg);
            });

            socket.on('priv-message', (dest, msg, callback) => {
                fastify.log.info(socket.id + " send to " + dest + ": " + msg);
                for (let clientId of clients) {
                    if (clientId === dest || clientId === socket.id) // ajouter une condition si blocked
                        fastify.io.to(clientId).emit('priv-message', socket.id, `${socket.id} dit : ${msg}`);
                }
                callback(`Message reçu : ${msg}`);
            });

            socket.on('block-user', (user, callback) => { // y faudra rajoute une liste pour stoquer les user blocker et leur interdir les futur message
                fastify.log.info(socket.id + " block " + user);
                for (let clientId of clients) {
                    if (clientId === user || clientId === socket.id)
                        fastify.io.to(clientId).emit('block-user', socket.id, user);
                }
                callback(`User ${user} bloked`);
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
