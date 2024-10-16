const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const { handleSendMessage } = require('./events/sendInboxMessage');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

const CLIENT_PORT = 5173;
const io = new Server(server, {
    cors: {
        origin: `${process.env.CLIENT_URL}:${CLIENT_PORT}`,
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {};

const getSocketIdByUserId = (userId) => {
    return userSocketMap[userId] || null;
};

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    }

    socket.on('sendMessage', async (data) => {
        await handleSendMessage(io, userSocketMap, userId, data);
    });

    socket.on('sendMatchMessage', async (data) => {
        await handleSendMatchMessage(io, userSocketMap, userId, data);
    });

    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

module.exports = { io, app, server, getSocketIdByUserId };
