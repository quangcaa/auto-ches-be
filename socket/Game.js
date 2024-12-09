const { Chess } = require('chess.js')
const { sequelize, Game: DbGame, Move: DbMove, User: DbUser, TimeControl } = require('../db/models')
const { PLAYER_EXIT, BLACK_WINS, WHITE_WINS, COMPLETED, CHECKMATE, GAME_OVER, MOVE, DRAW, RECEIVE_MESSAGE } = require('./message')

class Game {
    constructor(player1, player2, game_id, timeControl) {
        this.game_id = game_id
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()
        this.result = null
        this.moveCount = 0
        this.timer = null // dong ho tong
        this.moveTimer = null // dong ho move
        this.startTime = new Date(Date.now()) // thoi gian bat dau
        this.lastMoveTime = new Date(Date.now())
        this.timeControlName = timeControl.name
        this.baseTime = timeControl.base_time * 60 * 1000;
        this.increment = timeControl.increment_by_turn * 1000;
        this.playerTimes = {
            w: this.baseTime, // milliseconds
            b: this.baseTime,
        };
        this.activePlayer = 'w';
        this.status = 'PENDING'
    }

    async addPlayer(player2) {
        this.player2 = player2

        try {
            await this.createGameInDb()
        } catch (error) {
            console.log(error)
            return
        }
    }

    async makeMove(socket, move, callback, io) {
        if ((this.board.turn() === 'w' && socket.user_id !== this.player1) ||
            (this.board.turn() === 'b' && socket.user_id !== this.player2)) {
            console.log(`error move`)
            callback({ success: false, message: 'Not your turn' })
            return
        }

        let result
        try {
            result = this.board.move(move)
        } catch (error) {
            callback({ success: false, message: 'Invalid move' })
            return
        }

        if (!result) {
            callback({ success: false, message: 'Invalid move' })
            return
        }

        // Change status to IN_PROGRESS on the first move
    if (this.status === 'PENDING' && this.board.turn() === 'b') {
        this.status = 'IN_PROGRESS';
        await DbGame.update(
          { status: 'IN_PROGRESS' },
          { where: { game_id: this.game_id } }
        );
      }

        // calculate time spent
        const currentTime = Date.now();
        const timeSpent = currentTime - this.lastMoveTime;

        // update active player's time
        this.playerTimes[this.activePlayer] -= timeSpent;
        if (this.playerTimes[this.activePlayer] <= 0) {
            return;
        }

        // add increment after move
        this.playerTimes[this.activePlayer] += this.increment;

        // // Update last move time and switch player
        this.lastMoveTime = currentTime;
        this.activePlayer = this.board.turn();

        // // Emit time update to clients
        const timeData = {
            whiteTime: this.playerTimes['w'],
            blackTime: this.playerTimes['b'],
        };
        
        // Emit time update to both players
        io.to(this.game_id).emit('time_update', timeData);

        const moveTimestamp = new Date(Date.now())
        await this.addMoveToDb(result, moveTimestamp)

        socket.to(this.game_id).emit(MOVE, result)
        callback({ success: true })

        // Check if the game is over after the move
        if (this.board.isGameOver()) {
            let result

            if (this.board.isCheckmate()) {
                result = this.board.turn() === 'w' ? BLACK_WINS : WHITE_WINS;
            }
            else if (
                this.board.isDraw() ||
                this.board.ply() >= 1000
            ) {
                result = DRAW;
            }

            await this.endGame(io, "FINISHED", 'Checkmate', result)

            io.to(this.game_id).emit(GAME_OVER, `${reason} • ${result}`)
        }
    }

    sendMessage(socket, message, io) {
        io.to(this.game_id).emit(RECEIVE_MESSAGE, message)
    }

    async createGameInDb() {
        this.startTime = new Date(Date.now())
        this.lastMoveTime = this.startTime

        const game = await DbGame.create({
            game_id: this.game_id,
            white_player_id: this.player1,
            black_player_id: this.player2 ?? null,
            start_time: this.startTime, 
            status: this.status,
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        })

        const gameTime = await TimeControl.create({
            game_id: this.game_id,
            time_control_name: this.timeControlName,
            base_time: this.baseTime,
            increment_by_turn: this.increment
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
                move_number: this.moveCount += 1,
                san: move.san,
                time_taken: moveTimestamp - this.lastMoveTime,
                created_at: moveTimestamp,
            }, { transaction })

            const pgn = this.board.pgn();

            await DbGame.update(
                { fen: move.after, pgn: pgn },
                { where: { game_id: this.game_id }, transaction }
            )

            await transaction.commit()
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    async exitGame(io, user_id) {
        this.endGame(io, 'ABANDONED', user_id === this.player1 ? "White exit" : "Black exit", user_id === this.player1 ? BLACK_WINS : WHITE_WINS)

        return user_id === this.player1 ? BLACK_WINS : WHITE_WINS
    }

    async endGame(io, status, reason, result) {
        const updatedGame = await DbGame.update(
            { status, reason, result },
            { where: { game_id: this.game_id } }
        )

        io.to(this.game_id).emit(GAME_OVER, `${reason} • ${result}`);
    }

    getGameState() {
        return {
            fen: this.board.fen(),
            pgn: this.board.pgn(),
            moveHistory: this.board.history(),
            playerTimes: this.playerTimes,
            lastMoveTime: this.lastMoveTime,
            activePlayer: this.activePlayer,
            result: this.result,
        };
    }
}

module.exports = { Game }