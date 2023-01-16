import { WebRTC } from './yike-client/src/common/typings/webRTC'
import SimplePeer from './yike-client/node_modules/@types/simple-peer'
export namespace SIO {
  interface ServerToClientEvents {
    // 房间相关
    'room-id': (data: Pick<SIO.SocketData, 'roomId' | 'id'>) => void
    'room-update': (data: Pick<SIO.SocketData, 'connectedUsers'>) => void
    // webRTC 对象相关
    'conn-signal': (data: WebRTC.DataSignal) => void
    'conn-prepare': (data: WebRTC.DataPrepare) => void
    'conn-init': (data: WebRTC.DataInit) => void
    'conn-destroy': (data: WebRTC.DataDestroy) => void
  }

  interface ClientToServerEvents {
    // 房间相关
    'room-create': (
      data: Pick<SIO.SocketData, 'username' | 'audioOnly'>
    ) => void
    'room-join': (
      data: Pick<SIO.SocketData, 'roomId' | 'username' | 'audioOnly'>
    ) => void
    'room-leave': () => void
    // webRTC 对象相关
    'conn-signal': (data: WebRTC.DataSignal) => void
    'conn-init': (data: WebRTC.DataInit) => void
  }

  interface InterServiceEvents {
    ping: () => void
  }

  interface SocketData {
    id: string
    roomId: string
    userId: string
    username: string
    audioOnly: boolean
    connectedUsers: User[]
    toConnectSocketId: string
    socketId: string
    signal: SimplePeer.SignalData
  }

  // Types
  type User = {
    username: string
    id: string
    roomId: string
    socketId: string
    audioOnly: boolean
  }

  type Room = {
    id: string
    connectedUsers: User[]
  }
}
