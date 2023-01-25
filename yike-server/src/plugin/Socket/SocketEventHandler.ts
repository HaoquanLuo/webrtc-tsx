import { WebRTC } from '@/common/typings/webRTC'
import { v4 as uuidV4 } from 'uuid'
import { Server, Socket } from 'socket.io'
import logger from '@/server/logs/logger'
import { SocketException } from '../../core/HttpException'
import { SIO } from '@/common/typings/socket'

type TUser = 'user'
type TRoom = 'room'
type FindKey = TUser | TRoom
type FindOption = {
  user: string
  room: string
}
type FindMatch = {
  user: SIO.User
  room: SIO.Room
}

export class SocketEventHandler {
  /**
   * @description 服务器连接用户数
   */
  static connectedUsers: SIO.User[] = []

  /**
   * @description 服务器现存房间数
   */
  static rooms: SIO.Room[] = []

  static find<K extends FindKey>(
    keyword: K,
    option: K extends keyof FindOption ? { [P in K]: FindOption[P] } : never,
  ): K extends keyof FindMatch ? FindMatch[K] : void
  static find(keyword: FindKey[], option: FindOption): (SIO.User | SIO.Room)[]
  static find(
    keyword: FindKey | FindKey[],
    option: FindOption,
  ): SIO.User | SIO.Room | (SIO.User | SIO.Room)[] | undefined {
    function getResult(keyword: FindKey) {
      const constants = {
        user: 'user',
        room: 'room',
      } as const

      const { user: socketId, room: roomId } = option

      switch (constants[keyword]) {
        case constants.user: {
          const user = SocketEventHandler.connectedUsers.find(
            (user) => user.socketId === socketId,
          )

          if (user === undefined) {
            throw new Error(`User '${socketId}' not found in server.`)
          }
          return user
        }

        case constants.room: {
          const room = SocketEventHandler.rooms.find(
            (room) => room.id === roomId,
          )

          if (room === undefined) {
            throw new Error(`Room '${roomId}' not found in server.`)
          }

          return room
        }

        default:
          throw new Error(`Invalid key '${keyword}'`)
      }
    }

    if (keyword instanceof Array) {
      return keyword.map((key) => getResult(key))
    }

    if (typeof keyword === 'string') {
      return getResult(keyword)
    }
  }

  /**
   * @description 添加连接到 SocketServer 的用户
   * @param newUser
   */
  public static addSocketUser(socketId: string) {
    const newUser: SIO.User = {
      id: '',
      username: '',
      roomId: '',
      socketId,
      audioOnly: true,
    }

    SocketEventHandler.connectedUsers = [
      ...SocketEventHandler.connectedUsers,
      newUser,
    ]
  }

  /**
   * @description 删除连接到 SocketServer 的用户
   * @param newUser
   */
  public static removeSocketUser(socketId: string) {
    SocketEventHandler.connectedUsers =
      SocketEventHandler.connectedUsers.filter(
        (user) => user.socketId !== socketId,
      )
  }

  /**
   * @description 创建房间
   * @param data
   * @param socket
   * @returns
   */
  public static createRoomHandler(
    data: Pick<SIO.SocketData, 'username' | 'audioOnly'>,
    socket: Socket<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
  ) {
    try {
      const { username, audioOnly } = data

      // username 不存在
      if (username === undefined) {
        throw new Error("'username' is not provided.")
      }

      // audio 不存在
      if (audioOnly === undefined) {
        throw new Error("'audioOnly' is not provided.")
      }

      const selectUser = SocketEventHandler.find('user', {
        user: socket.id,
      })

      // 存在则开始创建房间
      logger.info(`[Socket Server] User '${socket.id}' is creating a new room.`)

      // 生成房间号、用户号和需要创建房间的用户的新状态
      const roomId = uuidV4()
      const uid = uuidV4()
      const newUser: SIO.User = {
        ...selectUser,
        username,
        roomId,
        id: uid,
        audioOnly,
      }

      // 若用户存在，则将其信息变更
      SocketEventHandler.connectedUsers = SocketEventHandler.connectedUsers.map(
        (user) => {
          if (user.socketId === socket.id) {
            return newUser
          }
          return user
        },
      )

      // 创建新的会议房间
      const newRoom: SIO.Room = {
        id: roomId,
        connectedUsers: [newUser],
      }

      logger.info(`[Socket Server] Room '${newRoom.id}' is created.`)

      // 新用户加入会议房间
      socket.join(roomId)
      SocketEventHandler.rooms = [...SocketEventHandler.rooms, newRoom]

      // 告知客户端房间已创建并将 roomId 发送给客户端
      socket.emit('room-id', {
        roomId,
        id: uid,
      })

      // 告知房间内所有用户有新用户加入并更新房间
      socket.emit('room-update', {
        connectedUsers: newRoom.connectedUsers,
      })
    } catch (error) {
      logger.error(`[Socket Server] ${error}`)
    }
  }

  /**
   * @description 加入房间
   * @param data
   * @param socket
   * @returns
   */
  public static joinRoomHandler(
    data: Pick<SIO.SocketData, 'roomId' | 'username' | 'audioOnly'>,
    socket: Socket<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
    sio: Server<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
  ) {
    try {
      const { roomId, username, audioOnly } = data

      // username 不存在
      if (username === undefined) {
        throw new Error("'username' is not provided.")
      }

      // roomId 不存在
      if (roomId === undefined) {
        throw new Error("'roomId' is not provided.")
      }

      // audio 不存在
      if (audioOnly === undefined) {
        throw new Error("'audioOnly' is not provided.")
      }

      // 开始加入房间操作
      logger.info(
        `[Socket Server] User '${socket.id}' is joining the room '${roomId}'.`,
      )

      const selectUser = SocketEventHandler.find('user', {
        user: socket.id,
      })

      // 生成用户号和需要创建房间的用户的新状态
      const uid = uuidV4()
      const newUser: SIO.User = {
        ...selectUser,
        username,
        id: uid,
        roomId,
        audioOnly,
      }

      // 若用户存在，则将其信息变更
      SocketEventHandler.connectedUsers = SocketEventHandler.connectedUsers.map(
        (user) => {
          if (user.socketId === socket.id) {
            return newUser
          }
          return user
        },
      )

      // 判断传递过来的 roomId 是否匹配存在
      const selectRoom = SocketEventHandler.find('room', { room: roomId })

      selectRoom.connectedUsers = [...selectRoom.connectedUsers, newUser]

      // 加入房间
      socket.join(roomId)

      logger.info(
        `[Socket Server] User '${selectUser.socketId}' has joined the room '${selectRoom.id}'.`,
      )

      // 告知房间内其他已连接用户准备 webRTC 对等连接
      selectRoom.connectedUsers.forEach((user) => {
        // 排除自身
        if (user.socketId !== socket.id) {
          // 存储发起对等连接方的 socketId 信息
          const data = {
            connUserSocketId: socket.id,
          }
          sio.to(user.socketId).emit('conn-prepare', data)
        }
      })

      // 借用 sio 发送通知告知有新用户加入并更新房间
      sio.to(roomId).emit('room-update', {
        connectedUsers: selectRoom.connectedUsers,
      })
    } catch (error) {
      logger.error(`[Socket Server] ${error}`)
    }
  }

  /**
   * @description 查询房间状态(存在、满员)
   * @param roomId
   * @returns
   */
  public static async roomCheckHandler(roomId: string) {
    try {
      const room = SocketEventHandler.rooms.find((room) => room.id === roomId)

      if (room === undefined) {
        throw new SocketException(`Room '${roomId}' not found in server.`)
      }

      // 房间存在，且暂时定为 4 人间
      if (room.connectedUsers.length > 3) {
        // 房间人数已满
        return {
          roomExists: true,
          full: true,
        }
      } else {
        // 房间可以加入
        return {
          roomExists: true,
          full: false,
        }
      }
    } catch (error) {
      logger.error(`[Socket Server] ${error}`)
      return {
        roomExists: false,
      }
    }
  }

  /**
   * @description 用户离开房间处理逻辑
   * @param socket
   * @param sio
   * @returns
   */
  public static leaveRoomHandler(
    socket: Socket<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
    sio: Server<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
  ) {
    try {
      // 查询要离开会议房间的用户
      const user = SocketEventHandler.find('user', {
        user: socket.id,
      })

      const room = SocketEventHandler.find('room', {
        room: user.roomId,
      })
      // 从会议房间进行删除
      room.connectedUsers = room.connectedUsers.filter(
        (user) => user.socketId !== socket.id,
      )

      // 离开房间
      socket.leave(user.roomId)

      logger.info(
        `[Socket Server] User '${user.username}' has left the room '${room.id}'.`,
      )

      // 当会议房间没有人员的时候要关闭整个会议室（从 rooms 数组中删除该房间的信息）
      if (room.connectedUsers.length > 0) {
        // 用户断开 WebRTC 连接
        sio.to(room.id).emit('conn-destroy', { socketId: socket.id })

        // 发送通知告知有用户离开并更新房间
        sio.to(room.id).emit('room-update', {
          connectedUsers: room.connectedUsers,
        })
      } else {
        logger.info(`[Socket Server] Room '${room.id}' has been destroyed.`)

        // 从rooms数组中删除该房间的信息
        SocketEventHandler.rooms = SocketEventHandler.rooms.filter(
          (r) => r.id !== room.id,
        )
      }
    } catch (error) {
      logger.error(`[Socket Server] ${error}`)
    }
  }

  /**
   * @description 发送信令数据
   * @param data
   * @param socket
   * @param sio
   */
  public static signalingDataHandler(
    data: WebRTC.DataSignal,
    socket: Socket<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
    sio: Server<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
  ) {
    const { connUserSocketId, signal } = data

    const signalingData = {
      signal,
      connUserSocketId: socket.id,
    }

    sio.to(connUserSocketId).emit('conn-signal', signalingData)
  }

  /**
   * @description 初始化对等连接
   * @param data
   * @param socket
   * @param sio
   */
  public static initPeerConnectionHandler(
    data: WebRTC.DataInit,
    socket: Socket<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
    sio: Server<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
  ) {
    const { connUserSocketId } = data

    const initData = {
      connUserSocketId: socket.id,
    }

    sio.to(connUserSocketId).emit('conn-init', initData)
  }

  /**
   * @description Socket 断开连接逻辑
   * @param socket
   */
  public static disconnectHandler(
    socket: Socket<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
    sio: Server<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
  ) {
    try {
      // 遍历查找断连的用户是否在某个房间内
      for (const room of SocketEventHandler.rooms) {
        const selectUser = room.connectedUsers.find(
          (u) => u.socketId === socket.id,
        )
        if (selectUser !== undefined) {
          SocketEventHandler.leaveRoomHandler(socket, sio)
        } else {
          console.log(`User '${socket.id}' didn't exist in any room`)
        }
      }

      SocketEventHandler.removeSocketUser(socket.id)
    } catch (error) {
      logger.error(`[Socket Server] ${error}`)
    }
  }

  /**
   * @description 转发私聊消息
   * @param data
   * @param socket
   */
  public static transportDirectMessageHandler(
    data: SIO.Message,
    socket: Socket<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
  ) {
    try {
      const { receiverSocketId, receiverName, messageContent } = data

      if (receiverSocketId === '' || receiverSocketId === undefined) {
        throw new Error(
          `[Socket Server] Value of 'receiverSocketId' is ${JSON.stringify(
            receiverSocketId,
          )}.`,
        )
      }

      const receiverUser = SocketEventHandler.connectedUsers.find(
        (user) => user.username === receiverName,
      )

      if (receiverUser === undefined) {
        throw new Error(
          `[Socket Server] User '${receiverName}' not found in connectedUsers.`,
        )
      }

      const senderUser = SocketEventHandler.find('user', {
        user: socket.id,
      })

      // 给接收方/发送方的消息
      const message: SIO.Message = {
        id: uuidV4(),
        receiverName: receiverUser.username,
        receiverSocketId: receiverUser.socketId,
        senderName: senderUser.username,
        senderSocketId: senderUser.socketId,
        messageContent,
      }

      // 给接收方发送消息
      socket.to(receiverUser.socketId).emit('direct-message', message)

      // 给发起方返回信息
      socket.emit('direct-message', message)

      logger.info(
        `[Socket Server] User '${socket.id}' sent a message to '${receiverSocketId}'.`,
      )
    } catch (error) {
      logger.error(`[Socket Server] ${error}`)
    }
  }
}
