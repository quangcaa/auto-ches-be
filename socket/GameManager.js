const { Game } = require('./Game')
const shortid = require('shortid')
const {
    CREATE_GAME,
    GAME_CREATED,
    START_GAME,
    MOVE,
    JOIN_GAME,
    LEAVE_GAME,
    GAME_OVER,
    SEND_MESSAGE,
    JOIN_QUICK_PAIRING
} = require('./message')

class GameManager {
    constructor() {
        this.games = new Map()
        this.playersQueue = []
    }

    handleEvent(socket, io, connected_users) {
        console.log("ran into GameManager/handleEvent")

        socket.on(CREATE_GAME, async (timeControl, callback) => {
            try {
                const game_id = shortid.generate()

                const newGame = new Game(socket.user_id, null, game_id, timeControl)
                this.games.set(game_id, newGame)

                socket.join(game_id)

                io.emit('update_lobby', Array.from(this.games.values()))

                callback({ success: true, game_id: game_id })
            } catch (error) {
                callback({ success: false, message: error.message })
            }
        })

        socket.on(JOIN_QUICK_PAIRING, async (timeControl) => {
            // check if player already in queue
            const isAlreadyInQueue = this.playersQueue.some(
                (player) => player.id === socket.id
            )

            // add player to queue
            if (!isAlreadyInQueue) {
                this.playersQueue.push({
                    socket: socket,
                    user_id: socket.user_id,
                    timeControl: timeControl,
                })
            }

            // matching 
            this.matchPlayers(io)
        })

        socket.on('cancel_quick_pairing', (selectedTimeControl) => {
            // remove player from queue
            this.playersQueue = this.playersQueue.filter(
                (player) => player.socket.id !== socket.id
            )

            console.log(`Player ${socket.user_id} has canceled quick pairing.`)

            socket.emit('cancel_paired')
        })

        socket.on(JOIN_GAME, (game_id, callback) => {
            const game = this.games.get(game_id)
            if (game) {
                if (socket.user_id === game.player1) {
                    // prevent the creator from joining their own game
                    callback({ success: false, message: 'You cannot join your own game' })
                    return
                }

                // Check if the game already has two players
                if (game.player2) {
                    callback({ success: false, message: 'Game is already full' })
                    return
                }

                game.addPlayer(socket.user_id)

                socket.join(game_id)

                const timeData = {
                    whiteTime: game.playerTimes['w'],
                    blackTime: game.playerTimes['b'],
                }

                io.to(game_id).emit('start_now', game_id)

                io.to(game_id).emit(START_GAME, { white: game.player1, black: game.player2, timeData })

                callback({ success: true })
            } else {
                socket.emit('error', 'Room not found')
                callback({ success: false, message: 'Game not found' })
            }
        })

        socket.on(MOVE, async ({ game_id, move }, callback) => {
            const game = this.games.get(game_id)
            if (game) {
                console.log(`[gameMove]: game ${game_id}`)
                game.makeMove(socket, move, callback, io)
            } else {
                callback({ success: false, message: 'Game not found.' })
            }
        })

        socket.on(SEND_MESSAGE, ({ game_id, message }) => {
            const game = this.games.get(game_id)
            if (game) {
                game.sendMessage(socket, message, io)
            }
        })

        socket.on(LEAVE_GAME, async (game_id) => {
            const game = this.games.get(game_id)

            let result
            if (game) {
                result = await game.exitGame(socket.user_id)
                this.removeGame(game_id)
            }
            console.log(`user left room: ${game_id}`)
            console.log(`result ${result}`)

            io.to(game_id).emit(GAME_OVER, result)
        })
    }

    // matching
    async matchPlayers(io) {
        for (let i = 0; i < this.playersQueue.length; i++) {
            const player1 = this.playersQueue[i]

            for (let j = i + 1; j < this.playersQueue.length; j++) {
                const player2 = this.playersQueue[j]

                if (player1.user_id !== player2.user_id) {
                    // found 2 different players, eliminate from queue
                    // eliminate player2 first so as not to affect player1's stats
                    this.playersQueue.splice(j, 1)
                    this.playersQueue.splice(i, 1)

                    // create game
                    const game_id = shortid.generate()
                    const game = new Game(player1.user_id, player2.user_id, game_id, player1.timeControl)
                    this.games.set(game_id, game)

                    await game.createGameInDb()

                    // add to socket room
                    player1.socket.join(game_id)
                    player2.socket.join(game_id)

                    // emit 
                    io.to(game_id).emit('paired', game_id)

                    io.to(game_id).emit(START_GAME, {
                        white: game.player1,
                        black: game.player2,
                    })

                    // after pairing, check to see if any other pairs are available
                    setImmediate(() => this.matchPlayers(io))

                    return
                }
            }
        }
    }


    // xoa game
    removeGame(game_id) {
        this.games.delete(game_id)
    }
}

module.exports = { GameManager }