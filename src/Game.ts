import { WebSocket } from "ws"
import { Chess } from "chess.js"
import { GAME_OVER, INIT_GAME, MOVE } from "./messages"

export class Game {
    public player1: WebSocket
    public player2: WebSocket
    private board: Chess
    private startTime: Date

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()
        this.startTime = new Date()
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
        // validate the type of move
        if (this.board.history().length % 2 === 0 && socket !== this.player1) {
            return
        }
        if (this.board.history().length % 2 === 1 && socket !== this.player2) {
            return
        }

        try {
            const result = this.board.move(move)
            if (!result) {
                throw new Error("Invalid move")
            }
        } catch (error) {
            console.log(error)
            return
        }

        if (this.board.isGameOver()) {
            // sent the game over message to both players
            const winner = this.board.turn() === 'w' ? 'black' : 'white'
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner
                }
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner
                }
            }))
            return
        }

        // notify move
        const opponent = this.board.history().length % 2 === 1 ? this.player2 : this.player1
        opponent.send(JSON.stringify({
            type: MOVE,
            payload: move
        }))

        console.log(this.board.history())
        console.log(this.board.history().length)

    }
}