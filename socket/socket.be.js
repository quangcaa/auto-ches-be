const { Server } = require('socket.io')
const { GameManager } = require('./GameManager')
const { handleSendMessage } = require('./InboxManager')
const { User } = require('../db/models')

let io

const connected_users = new Map() // online users
const gameManager = new GameManager() // instance

const {
    SEND_INBOX_MESSAGE
} = require('./message')

const CLIENT_URL = process.env.CLIENT_URL

const initSocket = (httpServer) => {
    // if (io) {
    //     console.log('Socket.io server already initialized.')
    //     return;
    // }

    io = new Server(httpServer, {
        connectionStateRecovery: {},
        cors: {
            origin: CLIENT_URL,
            credentials: true,
        }
    })


    io.use(async (socket, next) => {
        const user_id = socket.handshake.auth.user_id
        if (!user_id) return next(new Error('Invalid user_id'))

        socket.user_id = user_id

        // update user online status
        await User.update({ online: true }, { where: { user_id } });

        next()
    })


    io.on('connection', (socket) => {
        connected_users.set(socket.user_id, socket.id)
        console.log(`[SOCKET]: User [${socket.user_id}] connected with socket id: [${socket.id}].`)

        // emit 'user_online' event to all clients
        io.emit('user_online', { user_id: socket.user_id })

        socket.on(SEND_INBOX_MESSAGE, async (data) => {
            await handleSendMessage(data, io, connected_users)
        })

        gameManager.handleEvent(socket, io, connected_users)

        socket.on('disconnect', async () => {
            console.log(`[SOCKET]: User [${socket.user_id}] disconnected with socket id: [${socket.id}].`)
            connected_users.delete(socket.user_id)

            // update user online status
            await User.update({ online: false }, { where: { user_id: socket.user_id } });

            // emit 'user_offline' event to all clients
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