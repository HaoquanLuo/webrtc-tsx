import Koa from 'koa'
import { createServer } from 'http'
import initCore from './core/Init'
import Config from './config/Config'

// 创建 koa 实例
const app = new Koa()

// 创建服务器
const httpServer = createServer(app.callback())

// 执行初始化
initCore(app, httpServer)

// 监听端口
httpServer.listen(Config.HTTP_PORT, () => {
  console.log(`ENV: ${process.env.NODE_ENV}, PORT: ${Config.HTTP_PORT}.`)
})
