import { getRoomState } from '@/api/system/auth'
import {
  setRoomExists,
  setRoomId,
  setRoomParticipants,
  setRoomCreated,
  setErrorMessage,
} from '@/redux/features/system/systemSlice'
import { store } from '@/redux/store'
import { Socket, io } from 'socket.io-client'
import { SIO } from '../../../socket'

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
  socket = io(SERVER, {
    autoConnect: false,
  })

  // 建立 socket 连接
  socket.connect()
  socket.on('connect', () => {
    console.log('connected to server', socket.id)
  })

  // 监听 room 相关事件
  socket.on('room-id', (data) => {
    const { roomId } = data
    if (roomId) {
      console.log('room-id', data.roomId)
      dispatch(setRoomId(roomId))
      dispatch(setRoomCreated('created'))
    }
  })
  socket.on('room-update', (data) => {
    const { connectedUsers } = data
    if (connectedUsers) {
      console.log('room-participants', connectedUsers)
      dispatch(setRoomParticipants(connectedUsers))
    }
  })
  /**
   * @todo 完成 peer 对象连接
   */
  // 监听 webRTC 相关事件
  socket.on('conn-prepare', (data) => {
    console.log('conn-prepare', data)
    const { toConnectSocketId } = data
  })
}

/**
 * @description 创建新的会议房间
 */
export const createRoom = (username: string) => {
  const data = {
    username,
  }
  socket.emit('room-create', data)
}

/**
 * @description 加入会议房间
 */
export const joinRoom = async (roomId: string, username: string) => {
  const emitData = {
    roomId,
    username,
  }
  const { data } = await getRoomState({
    roomId,
  })

  if (data.data) {
    const { roomExists, full } = data.data

    if (!roomExists) {
      debugger
      dispatch(setErrorMessage(`房间不存在`))
      dispatch(setRoomId(''))
    } else if (full) {
      dispatch(setErrorMessage(`房间人数已满`))
    } else {
      socket.emit('room-join', emitData)
      dispatch(setRoomExists(true))
    }
  }
}
