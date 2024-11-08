const { Server } = require('socket.io')
const { GameManager } = require('./GameManager')

let io

const connected_users = new Map() // online users
const rooms = {} // store online rooms
const gameManager = new GameManager()

const initSocket = (httpServer) => {
    // create connect
    io = new Server(httpServer, {
        connectionStateRecovery: {},
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        }
    })

    // apply middleware 
    io.use((socket, next) => {
        const user_id = socket.handshake.auth.user_id
        if (!user_id) return next(new Error('Invalid user_id'))

        socket.user_id = user_id
        next()
    })

    // event
    io.on('connection', (socket) => {
        connected_users.set(socket.user_id, socket.id)
        console.log(`[SOCKET]: User [${socket.user_id}] connected with socket id: [${socket.id}].`)
        console.log(connected_users)

        // create a room
        socket.on('create_room', async (callback) => {
            const game_id = await gameManager.createGame(socket)

            callback(game_id)
        })

        // join a room
        socket.on('join_room', (room_id) => {
            // if (rooms[room_id]) {
            //     rooms[room_id].players.push(socket.id)
            //     rooms[room_id].black = socket.id
            //     socket.join(room_id)
            //     io.to(room_id).emit('start_game', { players: rooms[room_id].players })
            //     console.log(`User joined room ${room_id}`)
            //     console.log(`User joined room ${rooms[room_id].white}`)
            //     console.log(`User joined room ${rooms[room_id].black}`)
            // } else {
            //     socket.emit('error', 'Room not found')
            // }

            gameManager.joinGame(socket, room_id, io)
        })

        // leave room
        socket.on('leave_room', (room_id) => {
            socket.leave(room_id)
            console.log(`user left room: ${room_id}`)
        })

        // move a piece
        socket.on('move', ({ room_id, move }) => {
            // const room = rooms[room_id]
            // if (!room) console.log('not foundg room')

            // if ((room.turn === 'w' && room.white === socket.id) ||
            //     (room.turn === 'b' && room.black === socket.id)) {

            //     socket.to(room_id).emit('move', move)

            //     room.turn = room.turn === 'w' ? 'b' : 'w'
            // } else {
            //     socket.emit('error', 'not your turn')
            //     console.log('nbot your turn')
            // }

            // socket.to(room_id).emit('move', move)
            gameManager.gameMove(room_id, move, socket)

        })

        socket.on('disconnect', () => {
            console.log(`[SOCKET]: User [${socket.user_id}] disconnected with socket id: [${socket.id}].`)
            connected_users.delete(socket.user_id)

            for (const room_id in rooms) {
                const players = rooms[room_id].players
                const index = players.indexOf(socket.id)
                if (index !== -1) {
                    players.splice(index, 1) // Remove player from room
                    if (players.length === 0) {
                        delete rooms[room_id] // Delete room if no players left
                        console.log(`Room ${room_id} deleted`)
                    }
                    break
                }
            }
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