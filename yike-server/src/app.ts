import Koa from 'koa'
import { createServer } from 'http'
import initCore from './core/Init'
import Config from './config/Config'
import { Server } from 'socket.io'
import { SIO } from '../../socket'
import { SocketIO } from './core/SocketServer'
// 创建 koa 实例
const app = new Koa()
// 创建服务器
const httpServer = createServer(app.callback())
// 创建 io 实例
const sio = new Server<
  SIO.ClientToServerEvents,
  SIO.ServerToClientEvents,
  SIO.InterServiceEvents,
  SIO.SocketData
>(httpServer, {
  cors: {
    origin: 'http://127.0.0.1:3000',
  },
})
// 执行初始化
initCore(app, httpServer, sio)
// 监听端口
httpServer.listen(Config.HTTP_PORT, () => {
  console.log(`ENV: ${process.env.NODE_ENV}, PORT: ${Config.HTTP_PORT}.`)
})
// 监听客户端 socket 连接
sio.on('connection', (socket) => {
  try {
    console.log(`[Socket Server] User ${socket.id} connected`)

    socket.on('room-create', (data) => {
      SocketIO.createRoomHandler(data, socket)
    })

    socket.on('room-join', (data) => {
      SocketIO.joinRoomHandler(data, socket, sio)
    })

    socket.on('room-leave', () => {
      SocketIO.leaveRoomHandler(socket, sio)
    })

    socket.on('disconnect', () => {
      console.log(`[Socket Server] User ${socket.id} disconnected.`)
      SocketIO.leaveRoomHandler(socket, sio)
    })

    socket.on('conn-signal', (data) => {
      SocketIO.signalingHandler(data, socket, sio)
    })

    socket.on('conn-init', (data) => {
      SocketIO.initConnectionHandler(data, socket, sio)
    })

    socket.on('conn-destroy', (data) => {})
  } catch (error) {
    console.error(`[Socket Server] SocketException: ${error}`)
  }
})
