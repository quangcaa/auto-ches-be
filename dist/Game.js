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
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
const crypto_1 = require("crypto");
const { Game: DbGame } = require('../db/models');
class Game {
    constructor(player1, player2, game_id, startTime) {
        this.result = null;
        this.moveCount = 0;
        this.startTime = new Date(Date.now());
        this.lastMoveTime = new Date(Date.now());
        this.player1TimeConsumed = 0;
        this.player2TimeConsumed = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.game_id = game_id !== null && game_id !== void 0 ? game_id : (0, crypto_1.randomUUID)();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: 'white'
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: 'black'
            }
        }));
    }
    makeMove(socket, move) {
        const currentTurn = this.board.turn();
        const isPlayer1 = socket === this.player1;
        const isPlayer2 = socket === this.player2;
        // Check if the move is made by the correct player
        if ((currentTurn === 'w' && !isPlayer1) || (currentTurn === 'b' && !isPlayer2)) {
            socket.send(JSON.stringify({ error: 'It is not your turn' }));
            return;
        }
        if (this.result) {
            console.error(`User ${this.board.turn()} is making a move post game completion`);
            return;
        }
        const moveTimestamp = new Date(Date.now());
        try {
            const result = this.board.move(move);
            if (!result) {
                throw new Error("Invalid move");
            }
        }
        catch (error) {
            console.log(`Error while making move: ${error}`);
            return;
        }
        // flipped 
        if (this.board.turn() === 'b') {
            this.player1TimeConsumed = this.player1TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime());
        }
        if (this.board.turn() === 'w') {
            this.player2TimeConsumed = this.player2TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime());
        }
        // add move to db 
        /*
         

        */
        if (this.board.isGameOver()) {
            const result = this.board.isDraw()
                ? 'DRAW'
                : this.board.turn() === 'b'
                    ? 'WHITE_WINS'
                    : 'BLACK_WINS';
            // this.player1.send(JSON.stringify({
            //     type: GAME_OVER,
            //     payload: {
            //         winner
            //     }
            // }))
            // this.player2.send(JSON.stringify({
            //     type: GAME_OVER,
            //     payload: {
            //         winner
            //     }
            // }))
            this.endGame("COMPLETED", result);
        }
        // notify move
        const opponent = this.board.history().length % 2 === 1 ? this.player2 : this.player1;
        opponent.send(JSON.stringify({
            type: messages_1.MOVE,
            payload: move
        }));
        // increase move count
        this.moveCount++;
    }
    // update db
    createGameInDb() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    addMoveToDb() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    // get player time consumed 
    getPlayer1TimeConsumed() {
        if (this.board.turn() === 'w') {
            return this.player1TimeConsumed;
        }
    }
    getPlayer2TimeConsumed() {
    }
    // end game
    endGame(status, result) {
        return __awaiter(this, void 0, void 0, function* () {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_ENDED,
                payload: {
                    result,
                    status
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_ENDED,
                payload: {
                    result,
                    status
                }
            }));
            // update game result in db
        });
    }
}
exports.Game = Game;
