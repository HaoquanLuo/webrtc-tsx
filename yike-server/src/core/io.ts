import { httpServer } from '@/app'
import { SIO } from '@/common/typings/socket'
import { Server } from 'socket.io'

// 创建io实例
export const sio = new Server<
  SIO.ClientToServerEvents,
  SIO.ServerToClientEvents,
  SIO.InterServiceEvents,
  SIO.SocketData
>(httpServer, {
  cors: {
    origin: '*',
  },
})

sio.on('connection', (socket) => {
  console.log(`client connection: ${socket.id}`)
  socket.on('hello', (...args) => {
    console.log(`hello args:${args}`)
  })
})
