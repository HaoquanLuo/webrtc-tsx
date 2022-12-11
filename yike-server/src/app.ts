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
try {
  // 监听客户端 socket 连接
  sio.on('connection', (socket) => {
    console.log(`[Socket Server] client connect: ${socket.id}`)

    socket.on('room-create', (data) => {
      SocketIO.createRoom(data, socket)
    })

    socket.on('room-join', (data) => {
      SocketIO.joinRoom(data, socket)
    })
  })
} catch (error) {
  console.error(`[Socket Server] SocketException: ${error}`)
}
