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

const dispatch = store.dispatch

// 服务器地址
const SERVER = 'http://127.0.0.1:9000'
// socket 实例对象
let socket: Socket<SIO.ServerToClientEvents, SIO.ClientToServerEvents>

/**
 * @description 创建 Socket 实例对象
 */
export const initSocketAndConnect = () => {
  // 生成 socket 实例
  socket = io(
    SERVER,
    // {
    //   autoConnect: false,
    // }
  )

  // 建立 socket 连接
  // socket.connect()
  socket.on('connect', () => {
    console.log('connected to server', socket.id)
    dispatch(setUserSocketId(socket.id))
  })

  // 监听 room 相关事件
  socket.on('room-id', (data) => {
    const { roomId, id } = data
    if (roomId === undefined) {
      throw new Error(`Server Error: "roomId" does not exist`)
    }
    if (id === undefined) {
      throw new Error(`Server Error: "id" does not exist`)
    }
    console.log('room-id', data.roomId)
    dispatch(setUserId(id))
    dispatch(setRoomId(roomId))
    dispatch(setRoomStatus('created'))
  })
  socket.on('room-update', (data) => {
    const { connectedUsers } = data
    if (connectedUsers !== undefined) {
      dispatch(setRoomParticipants(connectedUsers))
    }
  })

  // 监听 webRTC 相关事件
  socket.on('conn-prepare', (data) => {
    const { connUserSocketId: toConnectSocketId } = data

    // 准备 webRTC 对等连接，应答方 false
    WebRTCHandler.handlePeerConnection(toConnectSocketId, false)

    // 我方已准备完毕，通知对方进行 webRTC 对等连接
    socket.emit('conn-init', data)
  })

  socket.on('conn-signal', (data) => {
    WebRTCHandler.handleSignalingData(data)
  })

  socket.on('conn-init', (data) => {
    const { connUserSocketId: toConnectSocketId } = data

    // 准备 webRTC 对等连接，发起方 true
    WebRTCHandler.handlePeerConnection(toConnectSocketId, true)
  })
}

/**
 * @description 创建新的会议房间
 * @param username
 */
export const createRoom = (username: string, audioOnly: boolean) => {
  const data = {
    username,
    audioOnly,
  }

  socket.emit('room-create', data)
}

/**
 * @description 加入会议房间
 * @param roomId
 * @param username
 */
export const joinRoom = async (
  roomId: string,
  username: string,
  audioOnly: boolean,
) => {
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
      socket.emit('room-join', emitData)
      dispatch(setRoomStatus('existed'))
    }
  }
}

/**
 * @description 发送信令数据到服务器
 * @param data
 */
export const sendSignalData = (data: WebRTC.DataSignal) => {
  socket.emit('conn-signal', data)
}
