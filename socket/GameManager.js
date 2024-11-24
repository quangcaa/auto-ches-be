const { Game } = require('./Game')
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
    }

    handleEvent(socket, io, connected_users) {
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

                // new
                io.emit('update_lobby', Array.from(this.games.values()));

                callback(game_id)
            } catch (error) {
                console.error('Error creating room:', error)
            }
        })

        socket.on(JOIN_QUICK_PAIRING, async (callback) => {
            try {
                // Add player to the waiting queue if not already in it
                if (!this.waitingPlayers.includes(socket.user_id)) {
                    this.waitingPlayers.push(socket.user_id);
                }

                console.log(`Player ${socket.user_id} joined quick pairing`);
                // If there are at least two players waiting, create a game
                if (this.waitingPlayers.length >= 2) {
                    const player1Id = this.waitingPlayers.shift();
                    const player2Id = this.waitingPlayers.shift();

                    const { nanoid } = await import('nanoid');
                    const game_id = nanoid();

                    const game = new Game(player1Id, player2Id, game_id);
                    this.games.set(game_id, game);

                    // Create game in the database
                    await game.createGameInDb();

                    // Join game room
                    const player1SocketId = connected_users.get(player1Id)
                    const player2SocketId = connected_users.get(player1Id)

                    const player1Socket = io.sockets.sockets.get(player1SocketId);
                    const player2Socket = io.sockets.sockets.get(player2SocketId);

                    player1Socket.join(game_id);
                    player2Socket.join(game_id);

                    // Notify players
                    player1Socket.emit(GAME_CREATED, game_id);
                    player2Socket.emit(GAME_CREATED, game_id);

                    io.to(game_id).emit(START_GAME, { white: player1Id, black: player2Id });

                    console.log(`Quick pairing game created: ${game_id}`);

                    callback({ success: true, game_id });
                } else {
                    callback({ success: true, message: 'Waiting for an opponent...' });
                }
            } catch (error) {
                console.error('Error in quick pairing:', error);
                callback({ success: false, message: 'Error in quick pairing.' });
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

        // socket.on("move", (move) => {
        //     const { game_id } = move;
        //     io.to(game_id).emit("move", move); // Gửi nước đi cho tất cả người chơi trong phòng
        // });


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