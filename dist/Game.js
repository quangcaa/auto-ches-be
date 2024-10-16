"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
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
        // validate the type of move
        if (this.board.history().length % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.board.history().length % 2 === 1 && socket !== this.player2) {
            return;
        }
        try {
            const result = this.board.move(move);
            if (!result) {
                throw new Error("Invalid move");
            }
        }
        catch (error) {
            console.log(error);
            return;
        }
        if (this.board.isGameOver()) {
            // sent the game over message to both players
            const winner = this.board.turn() === 'w' ? 'black' : 'white';
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner
                }
            }));
            return;
        }
        // notify move
        const opponent = this.board.history().length % 2 === 1 ? this.player2 : this.player1;
        opponent.send(JSON.stringify({
            type: messages_1.MOVE,
            payload: move
        }));
        console.log(this.board.history());
        console.log(this.board.history().length);
    }
}
exports.Game = Game;
