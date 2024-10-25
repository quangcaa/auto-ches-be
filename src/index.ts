import { WebSocketServer } from "ws"
import { GameManager } from "./GameManager"
import * as url from 'url'
import { extractAuthUser } from "./auth"

const wss = new WebSocketServer({ port: 8080 })

const gameManager = new GameManager()

wss.on("connection", function connection(ws, req) {
    console.log('Client connected')

    //@ts-ignore
    const token: string = url.parse(req.url, true).query.token

    console.log(token)

    const user = extractAuthUser(token, ws)

    gameManager.addUser(user)

    ws.on('close', () => gameManager.removeUser(ws))
})

console.log("WebSocket server is running on ws://localhost:8080")