const { Game } = require('./Game')
const {
    CREATE_GAME,
    GAME_CREATED,
    START_GAME,
    MOVE,
    JOIN_GAME,
    LEAVE_GAME,
    GAME_OVER
} = require('./message')

class GameManager {
    constructor() {
        this.games = new Map()
    }

    handleEvent(socket, io) {
        console.log("ran into GameManager/handleEvent")

        socket.on(CREATE_GAME, async (callback) => {
            try {
                const { nanoid } = await import('nanoid')
                const game_id = nanoid()

                const game = new Game(socket.user_id, null, game_id)
                this.games.set(game_id, game)

                console.log(this.games)

                socket.join(game_id)
                socket.emit(GAME_CREATED, game_id)

                callback(game_id)
            } catch (error) {
                console.error('Error creating room:', error)
            }
        })

        socket.on(JOIN_GAME, (game_id) => {
            const game = this.games.get(game_id)
            if (game) {
                game.addPlayer(socket.user_id)

                socket.join(game_id)
                io.to(game_id).emit(START_GAME, { white: game.player1, black: game.player2 })

                console.log(`user joined room ${game_id}`)
                console.log(`user joined room ${this.games.get(game_id).player1}`)
                console.log(`user joined room ${this.games.get(game_id).player2}`)
            } else {
                socket.emit('error', 'Room not found')
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