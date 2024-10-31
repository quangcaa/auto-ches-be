const { Chess } = require('chess.js');
const { getIO } = require('./socket.be');

class Game {
    constructor(player1, player2 = null, game_id, socket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.game_id = game_id;
        this.io = socket // Get the socket instance
    }

    addPlayer(player2) {
        this.player2 = player2;
        this.io.to(this.game_id).emit('start_game', {
            players: { white: this.player1, black: this.player2 },
            fen: this.board.fen(),
        });
    }

    makeMove(user_id, move) {
        if ((this.board.turn() === 'w' && user_id !== this.player1) ||
            (this.board.turn() === 'b' && user_id !== this.player2)) {
            return false;
        }

        const result = this.board.move(move);
        if (!result) {
            return false;
        }

        this.io.to(this.game_id).emit('move', { move, fen: this.board.fen() });
        return true;
    }
}

module.exports = { Game };