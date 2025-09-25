import express from 'express';
import { Server } from "socket.io";
import { createServer } from 'node:http';

const app = express();
const server = createServer(app)
const io = new Server(server)

const WebSocket = require('ws');

const PORT = 9999;
const wss = new WebSocket.Server({ port: PORT });

const clients = [];

//----------------
//  Start
//----------------

server.listen(PORT, () => {
  console.log(`Serveur lancé sur ws://localhost:${PORT}`);
});

io.on("connection", (socket) => {
    console.log('user connected');

    socket.on("new message", (args) => {
        socket.broadcast.emit("new message", args);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

// wss.on('connection', function connection(ws) { 
//     clients.push(ws);

//     ws.on('message', function incoming(message) {
//         console.log('received: %s', message);
//         broadcast(String(message));
//     });

//     ws.send('Bienvenue sur le Live Chat de transcendence!');
// });

// function broadcast(message) {
//     clients.forEach(function(client) {
//         client.send(message);
//     });
// }

// console.log(`Serveur lancé sur ws://localhost:${PORT}`);