import { getRoomState } from '@/api/system/auth'
import { WebRTC } from '@/common/typings/webRTC'
import {
  setRoomId,
  setRoomParticipants,
  setRoomStatus,
  setErrorMessage,
} from '@/redux/features/system/systemSlice'
import {
  setChatSectionStore,
  setUserSocketId,
} from '@/redux/features/user/userSlice'
import { store } from '@/redux/store'
import { Socket, io } from 'socket.io-client'
import { WebRTCHandler } from './webRTCHandler'
import { stopBothVideoAndAudio } from '@/common/utils/helpers/stopBothVideoAndAudio'
import { getStore } from '@/common/utils/getStore'
import { SIO } from '@/common/typings/socket'
import { SERVER } from '@/common/constants/socket'

const dispatch = store.dispatch

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

      if (roomId === undefined || id === undefined) {
        throw new Error(`'initSocketAndConnect' error.`)
      }

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

    SocketClient.socket.on('direct-message', (data) => {
      SocketClient.handleSaveDirectMessage(data)
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
        dispatch(
          setErrorMessage({
            key: `error_${Date.now()}`,
            content: `房间不存在`,
          }),
        )
        dispatch(setRoomId(''))
      } else if (full === true) {
        dispatch(
          setErrorMessage({
            key: `error_${Date.now()}`,
            content: `房间人数已满`,
          }),
        )
      } else {
        SocketClient.socket.emit('room-join', emitData)
        dispatch(setRoomStatus('existed'))
        dispatch(setRoomId(roomId))
      }
    }
  }

  public static handleLeaveRoom() {
    // 关闭本地媒体流连接
    const localStream = WebRTCHandler.getLocalStream()
    if (localStream === null) {
      throw new Error(`'WebRTCHandler.localStream' is not exist.`)
    }
    stopBothVideoAndAudio(localStream)

    // 通知 SocketServer 进行退出房间操作
    SocketClient.socket.emit('room-leave')

    // 将 WebRTCHandler 内的静态属性重置为初始状态
    WebRTCHandler.setLocalStream(null)
    WebRTCHandler.streamWithIds = []
  }

  /**
   * @description 发送信令数据到服务器
   * @param data
   */
  public static handleSendSignalData(data: WebRTC.DataSignal) {
    SocketClient.socket.emit('conn-signal', data)
  }

  /**
   * @description 发送私信
   * @param data
   */
  public static handleSendDirectMessage(data: SIO.Message) {
    SocketClient.socket.emit('direct-message', data)
  }

  public static handleSaveDirectMessage(data: SIO.Message) {
    const { senderSocketId, senderName, receiverSocketId } = data

    const userSocketId = getStore().user.userSocketId
    const chatSectionStore = getStore().user.chatSectionStore

    // 己方作为接收方时初始化与对方的消息记录
    if (
      userSocketId === receiverSocketId &&
      chatSectionStore[senderName] === undefined
    ) {
      dispatch(
        setChatSectionStore({
          ...chatSectionStore,
          [senderName]: {
            chatId: senderSocketId,
            chatTitle: senderName,
            chatMessages: [],
          },
        }),
      )
    }

    // 己方作为发送方
    if (senderSocketId === SocketClient.socket.id) {
      SocketClient.saveNewDirectMessage(true, data)
      return
    }

    // 对方作为发送方
    if (receiverSocketId === SocketClient.socket.id) {
      SocketClient.saveNewDirectMessage(false, data)
      return
    }
  }

  static async saveNewDirectMessage(
    createdByMe: boolean,
    directMessage: SIO.Message,
  ) {
    const { senderName, senderSocketId, receiverName, receiverSocketId } =
      directMessage

    if (receiverName === undefined || receiverSocketId === undefined) {
      throw new Error(`'saveNewDirectMessage' error.`)
    }

    const chatSectionStore = getStore().user.chatSectionStore

    let newMessage: SIO.Message = {
      ...directMessage,
    }

    const dispatchSaveChatMessageAction = (id: string, username: string) => {
      dispatch(
        setChatSectionStore({
          ...chatSectionStore,
          [username]: {
            chatId: id,
            chatTitle: username,
            chatMessages: [
              ...chatSectionStore[username]?.chatMessages,
              newMessage,
            ],
          },
        }),
      )
    }

    if (createdByMe) {
      // 己方是消息发送者
      dispatchSaveChatMessageAction(receiverSocketId, receiverName)
    } else {
      // 对方是消息发送者
      dispatchSaveChatMessageAction(senderSocketId, senderName)
    }
  }
}
