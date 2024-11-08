const { Chess } = require('chess.js');
const { Game: DbGame, Move: DbMove } = require('../db/models')

class Game {
    constructor(player1, player2 = null, game_id, socket) {
        this.game_id = game_id;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.io = socket // Get the socket instance
    }

    addPlayer(player2) {
        this.player2 = player2;
        this.io.to(this.game_id).emit('start_game', {
            players: { white: this.player1, black: this.player2 },
            fen: this.board.fen(),
        });
    }

    makeMove(socket, move) {
        if ((this.board.turn() === 'w' && socket.user_id !== this.player1) ||
            (this.board.turn() === 'b' && socket.user_id !== this.player2)) {
            console.log(`error move`)
            return false;
        }

        const result = this.board.move(move);
        if (!result) {
            return false;
        }

        socket.to(this.game_id).emit('move', move);
        return true;
    }

    async createGameInDb() {
        this.startTime = new Date(Date.now())
        this.lastMoveTime = this.startTime

        const game = await DbGame.create({
            game_id: this.game_id,
            variant_id: 'standard',
            time_control_id: 'Ra1',
            rated: 0,
            white_player_id: this.player1,
            black_player_id: this.player2 ?? null,
            start_time: this.startTime,
            status: 'IN_PROGRESS',
            starting_fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            current_fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        })
    }

    async addMoveToDb(move, moveTimestamp) {
        const transaction = await sequelize.transaction()

        try {
            await DbMove.create({
                game_id: this.game_id,
                from: move.from,
                to: move.to,
                before: move.before,
                after: move.after,
                move_number: this.moveCount + 1,
                san: move.san,
                time_taken: moveTimestamp.getTime() - this.lastMoveTime.getTime(),
                created_at: moveTimestamp,
            }, { transaction })

            await DbGame.update(
                { current_fen: move.after },
                { where: { game_id: this.game_id }, transaction }
            )

            await transaction.commit()
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}

module.exports = { Game };