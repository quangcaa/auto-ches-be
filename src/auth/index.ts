import jwt from 'jsonwebtoken'
import { User } from '../SocketManager'
import { WebSocket } from 'ws'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string

export interface userJwtClaims {
    user_id: number
    username: string
}

export const extractAuthUser = (token: string, ws: WebSocket): User => {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as unknown as userJwtClaims
    return new User(ws, decoded)
}
