import { SIO } from '../../../socket'
import { v4 as uuidV4 } from 'uuid'
import { Server, Socket } from 'socket.io'

export class SocketIO {
  static connectedUsers: SIO.User[] = []
  static rooms: SIO.Room[] = []

  /**
   * 创建房间
   * @param data
   * @param socket
   * @returns
   */
  public static createRoom(
    data: SIO.SocketData,
    socket: Socket<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >,
  ) {
    const { username } = data
    // 用户不存在
    if (!username) {
      return new Error('用户不存在')
    }
    console.log(`主持人${username}正在创建会议房间`, data)
    // 创建房间
    const roomId = uuidV4()
    // 创建进入会议的用户
    const newUser: SIO.User = {
      username,
      id: uuidV4(),
      roomId,
      socketId: socket.id,
    }
    SocketIO.connectedUsers = [...SocketIO.connectedUsers, newUser]
    // 创建新的会议房间
    const newRoom: SIO.Room = {
      id: roomId,
      connectedUsers: [newUser],
    }
    // 新用户加入会议房间
    socket.join(roomId)
    SocketIO.rooms = [...SocketIO.rooms, newRoom]
    // 告知客户端房间已创建并将 roomId 发送给客户端
    socket.emit('room-id', {
      roomId,
    })
    // 告知房间内所有用户有新用户加入并更新房间
    socket.emit('room-update', {
      connectedUsers: newRoom.connectedUsers,
    })
  }

  /**
   * 加入房间
   * @param data
   * @param socket
   * @returns
   */
  public static joinRoom(
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
    const { roomId, username } = data
    if (!username) {
      return new Error('用户名不存在')
    }
    if (!roomId) {
      return new Error('房间 id 不存在')
    }
    const newUser: SIO.User = {
      username,
      id: uuidV4(),
      roomId,
      socketId: socket.id,
    }
    // 判断传递过来的 roomId 是否匹配存在
    const room = SocketIO.rooms.find((room) => room.id === roomId)
    if (!room) {
      return new Error('房间不存在')
    }
    room.connectedUsers = [...room.connectedUsers, newUser]
    // 加入房间
    socket.join(roomId)
    // 将新用户添加到已连接用户数组中
    SocketIO.connectedUsers = [...SocketIO.connectedUsers, newUser]
    // 告知房间内其他已连接用户准备 webRTC 对等连接
    room.connectedUsers.forEach((user) => {
      // 排除自身
      if (user.socketId !== socket.id) {
        // 存储发起对等连接方的 socketId 信息
        const data = {
          toConnectSocketId: socket.id,
        }
        sio.to(user.socketId).emit('conn-prepare', data)
      }
    })
    // 借用 sio 发送通知告知有新用户加入并更新房间
    sio.to(roomId).emit('room-update', {
      connectedUsers: room.connectedUsers,
    })
  }

  /**
   * 查询房间状态(存在、满员)
   * @param roomId
   * @returns
   */
  public static async roomExistsAndFull(roomId: string) {
    const room = SocketIO.rooms.find((room) => room.id === roomId)

    // 房间存在
    if (room) {
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
}
