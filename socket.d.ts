import { Socket } from './yike-server/node_modules/socket.io'

export namespace SIO {
  interface ServerToClientEvents {
    // 房间相关
    'room-id': (data: SocketData) => void
    'room-update': (data: SocketData) => void
    // webRTC 对象相关
    'conn-prepare': (data: SocketData) => void
  }

  interface ClientToServerEvents {
    // 房间相关
    'room-create': (data: SocketData) => void
    'room-join': (data: SocketData) => void
  }

  interface InterServiceEvents {
    ping: () => void
  }

  interface SocketData {
    roomId?: string
    userId?: string
    username?: string
    connectedUsers?: User[]
    toConnectSocketId?: string
  }

  interface SocketType
    extends Socket<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    > {}

  // Types
  type User = {
    username: string
    id: string
    roomId: string
    socketId: string
  }
  type Room = {
    id: string
    connectedUsers: User[]
  }
}
