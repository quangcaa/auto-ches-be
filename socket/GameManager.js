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
        this.waitingPlayers = []
        this.pendingInvites = new Map()

        // test
        this.queue = []
        this.playersQueue = []
    }

    handleEvent(socket, io, connected_users) {
        console.log("ran into GameManager/handleEvent")

        socket.on(CREATE_GAME, async (callback) => {
            try {
                const game_id = shortid.generate()

                const game = new Game(socket.user_id, null, game_id)
                this.games.set(game_id, game)

                console.log(this.games)

                socket.join(game_id)
                socket.emit(GAME_CREATED, game_id)

                // new
                io.emit('update_lobby', Array.from(this.games.values()))

                callback({ success: true, game_id })
            } catch (error) {
                console.error('Error creating room:', error)
            }
        })

        socket.on('create_game_with_time_control', async (timeControl, callback) => {
            try {
                const game_id = shortid.generate()

                console.log(timeControl)

                const newGame = new Game(socket.user_id, null, game_id, timeControl)
                this.games.set(game_id, newGame)

                await newGame.createGameInDb()

                callback({ success: true, game_id: game_id });
            } catch (error) {
                callback({ success: false, message: error.message });
            }
          });

        socket.on(JOIN_QUICK_PAIRING, async (timeControl) => {
            this.playersQueue.push(socket)

            if (this.playersQueue.length >= 2) {
                const player1 = this.playersQueue.shift()
                const player2 = this.playersQueue.shift()

                const game_id = shortid.generate()

                const game = new Game(player1.user_id, player2.user_id, game_id, timeControl)
                this.games.set(game_id, game)

                await game.createGameInDb()

                console.log(`player1_id: ${game.player1} | player2_id: ${game.player2}`)
                console.log(this.games)

                player1.join(game_id)
                player2.join(game_id)

                player1.emit("paired", game_id)
                player2.emit("paired", game_id)

                io.to(game_id).emit(START_GAME, { white: game.player1, black: game.player2 })
            }
        })

        socket.on(JOIN_GAME, (game_id, callback) => {
            const game = this.games.get(game_id)
            if (game) {
                game.addPlayer(socket.user_id)

                socket.join(game_id)

                const timeData = {
                    whiteTime: game.playerTimes['w'],
                    blackTime: game.playerTimes['b'],
                };

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

    // xoa game
    removeGame(game_id) {
        this.games.delete(game_id)
    }
}

module.exports = { GameManager }