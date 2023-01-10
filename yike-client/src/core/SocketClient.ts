import { getRoomState } from '@/api/system/auth'
import { WebRTC } from '@/common/typings/webRTC'
import {
  setRoomId,
  setRoomParticipants,
  setRoomStatus,
  setErrorMessage,
} from '@/redux/features/system/systemSlice'
import { setUserId, setUserSocketId } from '@/redux/features/user/userSlice'
import { store } from '@/redux/store'
import { Socket, io } from 'socket.io-client'
import { SIO } from '../../../socket'
import { WebRTCHandler } from './webRTCHandler'
import { stopBothVideoAndAudio } from '@/common/utils/helpers/stopBothVideoAndAudio'

const dispatch = store.dispatch

// 服务器地址
const SERVER = 'http://127.0.0.1:9000'

export class SocketClient {
  // socket 实例对象
  static socket: Socket<SIO.ServerToClientEvents, SIO.ClientToServerEvents>

  /**
   * @description 创建 Socket 实例对象
   */
  public static initSocketAndConnect() {
    // 生成 socket 实例
    SocketClient.socket = io(SERVER)

    // 建立 socket 连接
    SocketClient.socket.on('connect', () => {
      console.log('connected to server', SocketClient.socket.id)

      dispatch(setUserSocketId(SocketClient.socket.id))
    })

    // 监听 room 相关事件
    SocketClient.socket.on('room-id', (data) => {
      const { roomId, id } = data

      if (roomId === undefined) {
        throw new Error(`Server Error: "roomId" does not exist`)
      }

      if (id === undefined) {
        throw new Error(`Server Error: "id" does not exist`)
      }

      dispatch(setUserId(id))
      dispatch(setRoomId(roomId))
      dispatch(setRoomStatus('created'))
    })

    SocketClient.socket.on('room-update', (data) => {
      const { connectedUsers } = data

      if (connectedUsers === undefined) {
        throw new Error(`Server Error: "connectedUsers" does not exist`)
      }
      dispatch(setRoomParticipants(connectedUsers))
    })

    // 监听 webRTC 相关事件
    SocketClient.socket.on('conn-prepare', (data) => {
      const { connUserSocketId } = data

      // 准备 webRTC 对等连接，应答方 false
      WebRTCHandler.handlePeerConnection(connUserSocketId, false)

      // 我方已准备完毕，通知对方进行 webRTC 对等连接
      SocketClient.socket.emit('conn-init', data)
    })

    SocketClient.socket.on('conn-signal', (data) => {
      WebRTCHandler.handleSignalingData(data)
    })

    SocketClient.socket.on('conn-init', (data) => {
      const { connUserSocketId } = data

      // 准备 webRTC 对等连接，发起方 true
      WebRTCHandler.handlePeerConnection(connUserSocketId, true)
    })

    SocketClient.socket.on('conn-destroy', (data) => {
      WebRTCHandler.handleRemovePeerConnection(data)
    })
  }

  /**
   * @description 创建新的会议房间
   * @param username
   */
  public static handleCreateRoom(username: string, audioOnly: boolean) {
    const data = {
      username,
      audioOnly,
    }

    SocketClient.socket.emit('room-create', data)
  }

  /**
   * @description 加入会议房间
   * @param roomId
   * @param username
   */
  public static async handleJoinRoom(
    roomId: string,
    username: string,
    audioOnly: boolean,
  ) {
    const emitData = {
      roomId,
      username,
      audioOnly,
    }

    const { data } = await getRoomState({
      roomId,
    })

    const result = data.data

    if (result !== undefined) {
      const { roomExists, full } = result

      if (roomExists === false) {
        dispatch(setErrorMessage(`房间不存在`))
        dispatch(setRoomId(''))
      } else if (full === true) {
        dispatch(setErrorMessage(`房间人数已满`))
      } else {
        SocketClient.socket.emit('room-join', emitData)
        dispatch(setRoomStatus('existed'))
      }
    }
  }

  public static handleLeaveRoom() {
    if (WebRTCHandler.localStream === null) {
      throw new Error(`'WebRTCHandler.localStream' is not exist.`)
    }

    stopBothVideoAndAudio(WebRTCHandler.localStream)
    SocketClient.socket.emit('room-leave')
  }

  /**
   * @description 发送信令数据到服务器
   * @param data
   */
  public static sendSignalData(data: WebRTC.DataSignal) {
    SocketClient.socket.emit('conn-signal', data)
  }
}
