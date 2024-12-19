const { Server } = require('socket.io')
const shortid = require('shortid')
const { GameManager } = require('./GameManager')
const { handleSendMessage } = require('./InboxManager')
const { User } = require('../db/models')
const {
    SEND_INBOX_MESSAGE,
} = require('./message')

let io

const connected_users = new Map() // online users
const gameManager = new GameManager() // instance

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        connectionStateRecovery: {},
        cors: {
            origin: '*',
            credentials: true,
        }
    })


    io.use(async (socket, next) => {
        const user_id = socket.handshake.auth.user_id
        if (!user_id) return next(new Error('Invalid user_id'))

        socket.user_id = user_id

        await User.update({ online: true }, { where: { user_id } });

        next()
    })


    io.on('connection', (socket) => {
        connected_users.set(socket.user_id, socket.id)
        console.log(`[SOCKET]: User [${socket.user_id}] connected.`)

        io.emit('user_online', { user_id: socket.user_id })

        socket.on(SEND_INBOX_MESSAGE, async (data) => {
            console.log('get message')
            await handleSendMessage(data, io, connected_users)
        })

        gameManager.handleEvent(socket, io, connected_users)

        socket.on('disconnect', async () => {
            console.log(`[SOCKET]: User [${socket.user_id}] disconnected.`)
            connected_users.delete(socket.user_id)

            await User.update({ online: false }, { where: { user_id: socket.user_id } });
            io.emit('user_offline', { user_id: socket.user_id });
        })
    })
}

const getIO = () => {
    if (!io) {
        throw new Error('Socket not initialized');
    }

    return io;
};

const getConnectedUsers = () => connected_users

module.exports = { initSocket, getIO, getConnectedUsers }