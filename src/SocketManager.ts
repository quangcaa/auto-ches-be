import { randomUUID } from 'crypto';
import { WebSocket } from 'ws';
import { userJwtClaims } from './auth';

export class User {
  public socket: WebSocket;
  public id: string;
  public user_id: number;
  public username: string;

  constructor(socket: WebSocket, userJwtClaims: userJwtClaims) {
    this.socket = socket;
    this.user_id = userJwtClaims.user_id;
    this.id = randomUUID();
    this.username = userJwtClaims.username;
  }
}

class SocketManager {
  private static instance: SocketManager;
  private interestedSockets: Map<string, User[]>;
  private userRoomMappping: Map<number, string>;

  private constructor() {
    this.interestedSockets = new Map<string, User[]>();
    this.userRoomMappping = new Map<number, string>();
  }

  static getInstance() {
    if (SocketManager.instance) {
      return SocketManager.instance;
    }

    SocketManager.instance = new SocketManager();
    return SocketManager.instance;
  }

  addUser(user: User, room_id: string) {
    this.interestedSockets.set(room_id, [
      ...(this.interestedSockets.get(room_id) || []),
      user,
    ]);
    this.userRoomMappping.set(user.user_id, room_id);
  }

  broadcast(room_id: string, message: string) {
    const users = this.interestedSockets.get(room_id);
    if (!users) {
      console.error('No users in room?');
      return;
    }

    users.forEach((user) => {
      user.socket.send(message);
    });
  }

  removeUser(user: User) {
    const room_id = this.userRoomMappping.get(user.user_id);
    if (!room_id) {
      console.error('User was not interested in any room?');
      return;
    }
    const room = this.interestedSockets.get(room_id) || []
    const remainingUsers = room.filter(u =>
      u.user_id !== user.user_id
    )
    this.interestedSockets.set(
      room_id,
      remainingUsers
    );
    if (this.interestedSockets.get(room_id)?.length === 0) {
      this.interestedSockets.delete(room_id);
    }
    this.userRoomMappping.delete(user.user_id);
  }
}

export const socketManager = SocketManager.getInstance()