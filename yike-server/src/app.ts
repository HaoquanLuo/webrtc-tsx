import Koa from 'koa'
import { createServer } from 'http'
import initCore from './core/Init'
import Config from './config/Config'
import { Server } from 'socket.io'
import { SIO } from '../../socket'
import { SocketServer } from './core/SocketServer'
import logger from './server/logs/logger'

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
    origin: '*',
  },
})

// 执行初始化
initCore(app, httpServer)

// 监听端口
httpServer.listen(Config.HTTP_PORT, () => {
  console.log(`ENV: ${process.env.NODE_ENV}, PORT: ${Config.HTTP_PORT}.`)
})

// 监听客户端 socket 连接
sio.on('connection', (socket) => {
  logger.info(`[Socket Server] User '${socket.id}' connected.`)
  SocketServer.addSocketUser(socket.id)

  socket.on('room-create', (data) => {
    SocketServer.createRoomHandler(data, socket)
  })

  socket.on('room-join', (data) => {
    SocketServer.joinRoomHandler(data, socket, sio)
  })

  socket.on('room-leave', () => {
    SocketServer.leaveRoomHandler(socket, sio)
  })

  socket.on('disconnect', () => {
    logger.info(`[Socket Server] User '${socket.id}' disconnected.`)

    SocketServer.disconnectHandler(socket, sio)
  })

  socket.on('conn-signal', (data) => {
    SocketServer.signalingDataHandler(data, socket, sio)
  })

  socket.on('conn-init', (data) => {
    SocketServer.initPeerConnectionHandler(data, socket, sio)
  })

  socket.on('direct-message', (data) => {
    SocketServer.transportDirectMessageHandler(data, socket)
  })
})
