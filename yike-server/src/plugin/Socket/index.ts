import { SIO } from '@/common/typings/socket'
import { Server } from 'socket.io'
import { PluginOptions } from '..'
import logger from '@/server/logs/logger'
import { SocketEventHandler } from '@/plugin/Socket/SocketEventHandler'

export class SocketServer {
  constructor(options: PluginOptions) {
    const { pluginNames, app, server } = options
    const sio = new Server<
      SIO.ClientToServerEvents,
      SIO.ServerToClientEvents,
      SIO.InterServiceEvents,
      SIO.SocketData
    >(server, {
      cors: {
        origin: '*',
      },
    })

    // 监听客户端 socket 连接
    sio.on('connection', (socket) => {
      logger.info(`[Socket Server] User '${socket.id}' connected.`)
      SocketEventHandler.addSocketUser(socket.id)

      socket.on('room-create', (data) => {
        SocketEventHandler.createRoomHandler(data, socket)
      })

      socket.on('room-join', (data) => {
        SocketEventHandler.joinRoomHandler(data, socket, sio)
      })

      socket.on('room-leave', () => {
        SocketEventHandler.leaveRoomHandler(socket, sio)
      })

      socket.on('disconnect', () => {
        logger.info(`[Socket Server] User '${socket.id}' disconnected.`)

        SocketEventHandler.disconnectHandler(socket, sio)
      })

      socket.on('conn-signal', (data) => {
        SocketEventHandler.signalingDataHandler(data, socket, sio)
      })

      socket.on('conn-init', (data) => {
        SocketEventHandler.initPeerConnectionHandler(data, socket, sio)
      })

      socket.on('direct-message', (data) => {
        SocketEventHandler.transportDirectMessageHandler(data, socket)
      })
    })
  }
}
