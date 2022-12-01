import Koa from 'koa'
import { createServer } from 'http'
import initCore from './core/Init'
import Config from './config/Config'
import { Server } from 'socket.io'
import { SIO } from './common/typings/socket'
// 创建koa实例
const app = new Koa()
// 创建服务器
const httpServer = createServer(app.callback())
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
// 执行初始化
initCore(app, httpServer, sio)
// 监听端口
httpServer.listen(Config.HTTP_PORT, () => {
  console.log(`ENV: ${process.env.NODE_ENV}, PORT: ${Config.HTTP_PORT}.`)
})
