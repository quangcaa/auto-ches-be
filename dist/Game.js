"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
exports.isPromoting = isPromoting;
const chess_js_1 = require("chess.js");
const crypto_1 = require("crypto");
const SocketManager_1 = require("./SocketManager");
const messages_1 = require("./messages");
const { sequelize, Game: DbGame, Move: DbMove, User: DbUser } = require('../db/models');
const { Op } = require('sequelize');
const GAME_TIME_MS = 10 * 60 * 60 * 1000;
// promoting
function isPromoting(chess, from, to) {
    if (!from) {
        return false;
    }
    const piece = chess.get(from);
    if ((piece === null || piece === void 0 ? void 0 : piece.type) !== 'p') {
        return false;
    }
    if (piece.color !== chess.turn()) {
        return false;
    }
    if (!['1', '8'].some((it) => to.endsWith(it))) {
        return false;
    }
    return chess
        .moves({ square: from, verbose: true })
        .map((it) => it.to)
        .includes(to);
}
// game class
class Game {
    constructor(player1, player2, game_id, startTime) {
        this.result = null;
        this.moveCount = 0;
        this.timer = null;
        this.moveTimer = null;
        this.startTime = new Date(Date.now());
        this.lastMoveTime = new Date(Date.now());
        this.player1TimeConsumed = 0;
        this.player2TimeConsumed = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.game_id = game_id !== null && game_id !== void 0 ? game_id : (0, crypto_1.randomUUID)();
        if (startTime) {
            this.startTime = startTime;
            this.lastMoveTime = startTime;
        }
    }
    seedMoves(moves) {
    }
    updateSecondPlayer(player2) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.player2 = player2;
            const users = yield DbUser.findAll({
                where: {
                    [Op.in]: [
                        this.player1,
                        (_a = this.player2) !== null && _a !== void 0 ? _a : ''
                    ]
                }
            });
            try {
                yield this.createGameInDb();
            }
            catch (e) {
                console.error(e);
                return;
            }
            const WhitePlayer = users.find((user) => user.user_id === this.player1);
            const BlackPlayer = users.find((user) => user.user_id === this.player2);
            SocketManager_1.socketManager.broadcast(this.game_id, JSON.stringify({
                type: messages_1.INIT_GAME,
                payload: {
                    gameId: this.game_id,
                    whitePlayer: {
                        name: WhitePlayer === null || WhitePlayer === void 0 ? void 0 : WhitePlayer.username,
                        user_id: this.player1
                    },
                    blackPlayer: {
                        name: BlackPlayer === null || BlackPlayer === void 0 ? void 0 : BlackPlayer.username,
                        user_id: this.player2,
                    },
                    fen: this.board.fen(),
                    moves: [],
                },
            }));
        });
    }
    // create game in db
    createGameInDb() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.startTime = new Date(Date.now());
            this.lastMoveTime = this.startTime;
            const game = yield DbGame.create({
                game_id: this.game_id,
                variant_id: 'standard',
                time_control_id: 'Ra1',
                rated: 0,
                white_player_id: this.player1,
                black_player_id: (_a = this.player2) !== null && _a !== void 0 ? _a : null,
                start_time: this.startTime,
                status: 'IN_PROGRESS',
                starting_fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                current_fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            });
            this.game_id = game.game_id;
        });
    }
    // save move to db
    addMoveToDb(move, moveTimestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield sequelize.transaction();
            try {
                yield DbMove.create({
                    game_id: this.game_id,
                    from: move.from,
                    to: move.to,
                    before: move.before,
                    after: move.after,
                    move_number: this.moveCount + 1,
                    san: move.san,
                    time_taken: moveTimestamp.getTime() - this.lastMoveTime.getTime(),
                    created_at: moveTimestamp,
                }, { transaction });
                yield DbGame.update({ current_fen: move.after }, { where: { game_id: this.game_id }, transaction });
                yield transaction.commit();
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    makeMove(user, move) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the move is made by the correct player
            if (this.board.turn() === 'w' && user.user_id !== this.player1) {
                return;
            }
            if (this.board.turn() === 'b' && user.user_id !== this.player2) {
                return;
            }
            if (this.result) {
                console.error(`User ${user.user_id} is making a move post game completion`);
                return;
            }
            const moveTimestamp = new Date(Date.now());
            try {
                if (isPromoting(this.board, move.from, move.to)) {
                    this.board.move({
                        from: move.from,
                        to: move.to,
                        promotion: 'q',
                    });
                }
                else {
                    this.board.move({
                        from: move.from,
                        to: move.to,
                    });
                }
            }
            catch (error) {
                console.log(`Error while making move: ${error}`);
                return;
            }
            // flipped because move has already happened
            if (this.board.turn() === 'b') {
                this.player1TimeConsumed = this.player1TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime());
            }
            if (this.board.turn() === 'w') {
                this.player2TimeConsumed = this.player2TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime());
            }
            // add move to db 
            yield this.addMoveToDb(move, moveTimestamp);
            this.resetAbandonTimer();
            this.resetMoveTimer();
            this.lastMoveTime = moveTimestamp;
            SocketManager_1.socketManager.broadcast(this.game_id, JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move,
                    player1TimeConsumed: this.player1TimeConsumed,
                    player2TimeConsumed: this.player2TimeConsumed,
                }
            }));
            if (this.board.isGameOver()) {
                const result = this.board.isDraw()
                    ? 'DRAW'
                    : this.board.turn() === 'b'
                        ? 'WHITE_WINS'
                        : 'BLACK_WINS';
                this.endGame("COMPLETED", result);
            }
            // increase move count
            this.moveCount++;
        });
    }
    // get player time consumed 
    getPlayer1TimeConsumed() {
        if (this.board.turn() === 'w') {
            return this.player1TimeConsumed + (new Date(Date.now()).getTime() - this.lastMoveTime.getTime());
        }
        return this.player1TimeConsumed;
    }
    getPlayer2TimeConsumed() {
        if (this.board.turn() === 'b') {
            return this.player2TimeConsumed + (new Date(Date.now()).getTime() - this.lastMoveTime.getTime());
        }
        return this.player2TimeConsumed;
    }
    resetAbandonTimer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.endGame("ABANDONED", this.board.turn() === 'b' ? 'WHITE_WINS' : 'BLACK_WINS');
            }, 60 * 1000);
        });
    }
    resetMoveTimer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.moveTimer) {
                clearTimeout(this.moveTimer);
            }
            const turn = this.board.turn();
            const timeLeft = GAME_TIME_MS - (turn === 'w' ? this.player1TimeConsumed : this.player2TimeConsumed);
            this.moveTimer = setTimeout(() => {
                this.endGame("TIME_UP", turn === 'b' ? 'WHITE_WINS' : 'BLACK_WINS');
            }, timeLeft);
        });
    }
    exitGame(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.endGame('PLAYER_EXIT', user.user_id === this.player2 ? 'WHITE_WINS' : 'BLACK_WINS');
        });
    }
    // end game
    endGame(status, result) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedGame = yield DbGame.update({
                status,
                result
            }, { where: { game_id: this.game_id } });
            const gameWithDetails = yield DbGame.findOne({
                where: { game_id: this.game_id },
                include: [
                    {
                        model: DbMove,
                        order: [['move_number', 'ASC']]
                    },
                    { model: DbUser, as: 'blackPlayer' },
                    { model: DbUser, as: 'whitePlayer' }
                ]
            });
            SocketManager_1.socketManager.broadcast(this.game_id, JSON.stringify({
                type: messages_1.GAME_ENDED,
                payload: {
                    result,
                    status,
                    moves: gameWithDetails.moves,
                    blackPlayer: {
                        user_id: gameWithDetails.blackPlayer.id,
                    },
                    whitePlayer: {
                        id: gameWithDetails.whitePlayer.id,
                    },
                },
            }));
            this.clearTimer();
            this.clearMoveTimer();
        });
    }
    clearMoveTimer() {
        if (this.moveTimer)
            clearTimeout(this.moveTimer);
    }
    setTimer(timer) {
        this.timer = timer;
    }
    clearTimer() {
        if (this.timer)
            clearTimeout(this.timer);
    }
}
exports.Game = Game;
