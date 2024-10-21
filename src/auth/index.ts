import jwt from 'jsonwebtoken'
import { User } from '../SocketManager'
import { WebSocket } from 'ws'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string

export interface userJwtClaims {
    user_id: string
}

export const extractAuthUser = (token: string, ws: WebSocket): User => {
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as userJwtClaims
        console.log('Decoded token:', decoded)
        return new User(ws, decoded)
    } catch (error) {
        console.error('Token verification failed:', error)
        throw new Error('Invalid token')
    }
}
