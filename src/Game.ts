import { WebSocket } from "ws"
import { Chess } from "chess.js"
import { GAME_ENDED, GAME_OVER, INIT_GAME, MOVE } from "./messages"
import { randomUUID } from "crypto"

const { Game: DbGame } = require('../db/models')

type GAME_STATUS = 'IN PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'TIME_UP' | 'PLAYER_EXIT'
type GAME_RESULT = 'WHITE_WINS' | 'DRAW' | 'BLACK_WINS'

export class Game {
    public game_id: string
    public player1: WebSocket
    public player2: WebSocket
    public board: Chess
    public result: GAME_RESULT | null = null
    private moveCount = 0
    private startTime = new Date(Date.now())
    private lastMoveTime = new Date(Date.now())
    private player1TimeConsumed = 0
    private player2TimeConsumed = 0

    constructor(player1: WebSocket, player2: WebSocket, game_id?: string, startTime?: Date) {
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()
        this.startTime = new Date()
        this.game_id = game_id ?? randomUUID()
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'white'
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'black'
            }
        }))
    }

    makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }) {
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

        const moveTimestamp = new Date(Date.now())

        try {
            const result = this.board.move(move)
            if (!result) {
                throw new Error("Invalid move")
            }
        } catch (error) {
            console.log(`Error while making move: ${error}`)
            return
        }

        // flipped 
        if (this.board.turn() === 'b') {
            this.player1TimeConsumed = this.player1TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime())
        }
        if (this.board.turn() === 'w') {
            this.player2TimeConsumed = this.player2TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime())
        }

        // add move to db 
        /*
         

        */

        if (this.board.isGameOver()) {
            const result = this.board.isDraw()
                ? 'DRAW'
                : this.board.turn() === 'b'
                    ? 'WHITE_WINS'
                    : 'BLACK_WINS'

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
        const opponent = this.board.history().length % 2 === 1 ? this.player2 : this.player1
        opponent.send(JSON.stringify({
            type: MOVE,
            payload: move
        }))

        // increase move count
        this.moveCount++
    }

    // update db
    async createGameInDb() {

    }
    async addMoveToDb() {

    }

    // get player time consumed 
    getPlayer1TimeConsumed() {
        if (this.board.turn() === 'w') {
            return this.player1TimeConsumed
        }
    }
    getPlayer2TimeConsumed() {

    }

    // end game
    async endGame(status: GAME_STATUS, result: GAME_RESULT) {
        this.player1.send(JSON.stringify({
            type: GAME_ENDED,
            payload: {
                result,
                status
            }
        }))
        this.player2.send(JSON.stringify({
            type: GAME_ENDED,
            payload: {
                result,
                status
            }
        }))

        // update game result in db
    }
}