import { SIO } from '../../../socket'
import { WebRTC } from '@/common/typings/webRTC'
import { v4 as uuidV4 } from 'uuid'
import { Server, Socket } from 'socket.io'
import logger from '@/server/logs/logger'

export class SocketServer {
  /**
   * @description 服务器连接用户数
   */
  static connectedUsers: SIO.User[] = []

  /**
   * @description 服务器现存房间数
   */
  static rooms: SIO.Room[] = []

  /**
   * @description 创建房间
   * @param data
   * @param socket
   * @returns
   */
  public static createRoomHandler(
    data: SIO.SocketData,
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
        throw new Error(`'username' is not provided.`)
      }

      // audio 不存在
      if (audioOnly === undefined) {
        throw new Error(`'audioOnly' is not provided.`)
      }

      logger.info(`[Socket Server] Host '${username}' is creating a new room.`)

      // 创建房间
      const roomId = uuidV4()
      const id = uuidV4()

      // 创建进入会议的用户
      const newUser: SIO.User = {
        username,
        id,
        roomId,
        socketId: socket.id,
        audioOnly,
      }

      SocketServer.connectedUsers = [...SocketServer.connectedUsers, newUser]

      // 创建新的会议房间
      const newRoom: SIO.Room = {
        id: roomId,
        connectedUsers: [newUser],
      }

      // 新用户加入会议房间
      socket.join(roomId)
      SocketServer.rooms = [...SocketServer.rooms, newRoom]

      // 告知客户端房间已创建并将 roomId 发送给客户端
      socket.emit('room-id', {
        roomId,
        id,
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
    data: SIO.SocketData,
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
        throw new Error(`'username' is not provided.`)
      }

      // roomId 不存在
      if (roomId === undefined) {
        throw new Error(`'roomId' is not provided.`)
      }

      // audio 不存在
      if (audioOnly === undefined) {
        throw new Error(`'audioOnly' is not provided.`)
      }

      const id = uuidV4()

      const newUser: SIO.User = {
        username,
        id,
        roomId,
        socketId: socket.id,
        audioOnly,
      }

      // 判断传递过来的 roomId 是否匹配存在
      const room = SocketServer.rooms.find((room) => room.id === roomId)

      if (room === undefined) {
        throw new Error(`Room '${roomId}' is not found.`)
      }

      room.connectedUsers = [...room.connectedUsers, newUser]

      // 加入房间
      socket.join(roomId)

      logger.info(
        `[Socket Server] User '${username}' has joined the room '${room.id}'.`,
      )

      // 将新用户添加到已连接用户数组中
      SocketServer.connectedUsers = [...SocketServer.connectedUsers, newUser]

      // 告知房间内其他已连接用户准备 webRTC 对等连接
      room.connectedUsers.forEach((user) => {
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
        connectedUsers: room.connectedUsers,
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
    const room = SocketServer.rooms.find((room) => room.id === roomId)

    // 房间存在
    if (room !== undefined) {
      // 房间暂时定为 4 人间
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
    } else {
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
      //查询要离开会议房间的用户
      const user = SocketServer.connectedUsers.find(
        (user) => user.socketId === socket.id,
      )

      if (user === undefined) {
        throw new Error(`User '${socket.id}' is not found.`)
      }

      //从会议房间进行删除
      const room = SocketServer.rooms.find((room) => room.id === user.roomId)

      if (room === undefined) {
        throw new Error(`Room '${room}' is not found.`)
      }

      room.connectedUsers = room.connectedUsers.filter(
        (user) => user.socketId !== socket.id,
      )

      //离开房间
      socket.leave(user.roomId)

      logger.info(
        `[Socket Server] User '${user.username}' has left the room '${room.id}'.`,
      )

      //当会议房间没有人员的时候要关闭整个会议室（从 rooms 数组中删除该房间的信息）
      if (room.connectedUsers.length > 0) {
        //用户断开 WebRTC 连接
        sio.to(room.id).emit('conn-destroy', { socketId: socket.id })

        //发送通知告知有用户离开并更新房间
        sio.to(room.id).emit('room-update', {
          connectedUsers: room.connectedUsers,
        })
      } else {
        logger.info(`[Socket Server] Room '${room.id}' has been destroyed.`)

        //从rooms数组中删除该房间的信息
        SocketServer.rooms = SocketServer.rooms.filter((r) => r.id !== room.id)
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

  public static disconnectHandler(
    socket: Socket<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
  ) {
    try {
      SocketServer.connectedUsers = SocketServer.connectedUsers.filter(
        (user) => user.socketId !== socket.id,
      )
    } catch (error) {
      logger.error(`[Socket Server] ${error}`)
    }
  }
}
