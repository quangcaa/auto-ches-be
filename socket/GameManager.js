const { Game } = require('./Game');

class GameManager {
    constructor() {
        this.games = new Map();
    }

    async createGame(socket) {
        const { nanoid } = await import('nanoid')
        const game_id = nanoid();

        const game = new Game(socket.user_id, null, game_id);
        this.games.set(game_id, game);

        socket.join(game_id);
        socket.emit('room_created', game_id);

        return game_id;
    }

    joinGame(socket, game_id, io) {
        if (this.games.has(game_id)) {
            this.games.get(game_id).player2 = socket.user_id
            socket.join(game_id)
            io.to(game_id).emit('start_game', { players: this.games.get(game_id).players })
            console.log(`User joined room ${game_id}`)
            console.log(`User joined room ${this.games.get(game_id).player1}`)
            console.log(`User joined room ${this.games.get(game_id).player2}`)
        } else {
            socket.emit('error', 'Room not found')
        }
    }

    gameMove(game_id, move, socket) {
        const game = this.games.get(game_id)
        console.log(`[gameMove]: game ${game}`)

        game.makeMove(socket, move)
    }

    deleteGame(game_id) {
        this.games.delete(game_id);
    }
}

module.exports = { GameManager };