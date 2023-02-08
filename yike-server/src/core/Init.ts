import path from 'path'
import Koa from 'koa'
import http from 'http'
import koaCors from 'koa2-cors'
import koaBodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import session from 'koa-session'
import Config from '@/config/Config'
import catchError from '@/middlewares/catchError'
import { getAllFilesExport } from '@/common/utils/utils'
import { updateRedisRole } from '@/server/auth'
import { initPlugin } from '@/plugin'

class Init {
  public static app: Koa
  public static server: http.Server
  public static initCore(
    app: Koa<Koa.DefaultState, Koa.DefaultContext>,
    server: http.Server,
  ) {
    Init.app = app
    Init.server = server
    Init.loadCors()
    Init.loadBodyParser()
    Init.initCatchError()
    Init.loadSession()
    Init.initLoadRouters()
    Init.updateRedisRole()
    Init.initPlugin()
  }

  // 加载 cors 模块
  public static loadCors() {
    Init.app.use(
      koaCors({
        origin(ctx) {
          return ctx.headers.origin!
        },
        credentials: true,
      }),
    )
  }

  // 解析body参数
  public static loadBodyParser() {
    Init.app.use(koaBodyParser())
  }

  // http路由加载
  static async initLoadRouters() {
    const dirPath = path.join(`${process.cwd()}/${Config.BASE}/api/`)
    getAllFilesExport(dirPath, (file: Router) => {
      Init.app.use(file.routes())
    })
  }

  // 错误监听和日志处理
  public static initCatchError() {
    Init.app.use(catchError)
  }

  // 加载session
  public static loadSession() {
    Init.app.keys = ['yike server']
    Init.app.use(
      session(
        {
          key: 'yike:sess',
          maxAge: 86400000,
          overwrite: true,
          httpOnly: false,
          signed: true,
          renew: true,
          // 以下配置只有在自己的域名下才有效
          // domain: 'yike.ffxixslh.top',
          // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          // secure: process.env.NODE_ENV === 'production',
        },
        Init.app,
      ),
    )
  }

  // 更新redis里的角色数据
  public static updateRedisRole() {
    updateRedisRole()
  }

  public static initPlugin() {
    initPlugin({
      pluginNames: ['SocketServer'],
      app: Init.app,
      server: Init.server,
    })
  }
}

export default Init.initCore
