const { Game } = require('./Game')
const shortid = require('shortid')
const {
    CREATE_GAME,
    JOIN_GAME,
    START_NOW,
    MOVE,
    LEAVE_GAME,
    GAME_OVER,
    SEND_MESSAGE,
    JOIN_QUICK_PAIRING,
    CANCEL_QUICK_PAIRING,
    PAIRED,
    CANCEL_PAIRED
} = require('./message')

class GameManager {
    constructor() {
        this.games = new Map()
        this.playersQueue = []
    }

    handleEvent(socket, io, connected_users) {
        socket.on(CREATE_GAME, async (timeControl, callback) => {
            try {
                const game_id = shortid.generate()

                const newGame = new Game(null, null, game_id, timeControl)
                if (timeControl.side === "white") {
                    newGame.player1 = socket.user_id
                  } else if (timeControl.side === "black") {
                    newGame.player2 = socket.user_id
                  } else {
                    newGame.player1 = socket.user_id
                  }

                this.games.set(game_id, newGame)

                socket.join(game_id)

                io.emit('update_lobby', Array.from(this.games.values()))

                callback({ success: true, game_id: game_id })
            } catch (error) {
                callback({ success: false, message: error.message })
            }
        })

        socket.on(JOIN_GAME, async (game_id, callback) => {
            const game = this.games.get(game_id)
            if (game) {
                if (socket.user_id === game.player1 || socket.user_id === game.player2) {
                    // prevent the creator from joining their own game
                    callback({ success: false, message: 'You cannot join your own game' })
                    return
                }

                // Check if the game already has two players
                if (game.player1 && game.player2) {
                    callback({ success: false, message: 'Game is already full' })
                    return
                }

                if (game.player1) {
                    game.player2 = socket.user_id
                } else {
                    game.player1 = socket.user_id
                }

                // game.addPlayer(socket.user_id)
                await game.createGameInDb()

                socket.join(game_id)

                io.to(game_id).emit(START_NOW, game_id)

                io.emit('update_lobby', Array.from(this.games.values()))

                callback({ success: true })
            } else {
                callback({ success: false, message: 'Game not found' })
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

        socket.on(CANCEL_QUICK_PAIRING, () => {
            // remove player from queue
            this.playersQueue = this.playersQueue.filter(
                (player) => player.socket.id !== socket.id
            )

            socket.emit(CANCEL_PAIRED)
        })

        socket.on(MOVE, async ({ game_id, move }, callback) => {
            const game = this.games.get(game_id)
            if (game) {
                game.makeMove(socket, move, callback, io)

                // broadcast for all spectator
                io.to(game_id).emit('game_state_update', game.getGameState());
            } else {
                callback({ success: false, message: 'Game not found' })
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
                result = await game.exitGame(io, socket.user_id)
                this.removeGame(game_id)
            }
        })

        socket.on(GAME_OVER, async ({game_id, reason, result}) => {
            const game = this.games.get(game_id)

            if (game) {
                result = await game.endGame(io, 'FINISHED', reason, result)
                this.removeGame(game_id)
            }
        })

        socket.on('join_spectator', (game_id, callback) => {
            const game = this.games.get(game_id);

            if (!game) {
                return callback({ success: false, message: 'Game not found' });
            }

            socket.join(game_id);
        
            // send the current game state to the spectator
            socket.emit('game_state', game.getGameState());
            callback({ success: true });
        });

        socket.on("request_lobby", () => {
            io.emit("update_lobby", Array.from(this.games.values()));
        });
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
                    io.to(game_id).emit(PAIRED, game_id)

                    // after pairing, check to see if any other pairs are available
                    setImmediate(() => this.matchPlayers(io))

                    io.emit("update_lobby", Array.from(this.games.values()));

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