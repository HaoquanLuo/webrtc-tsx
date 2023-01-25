import Koa from 'koa'
import http from 'http'
import { SocketServer } from './SocketServer'

type PluginName = 'SocketServer'

const allPlugin = {
  SocketServer,
}

export interface PluginOptions {
  pluginNames: PluginName[]
  app: Koa<Koa.DefaultState, Koa.DefaultContext>
  server: http.Server
}

export function initPlugin(options: PluginOptions) {
  options.pluginNames.forEach((pluginName) => {
    new allPlugin[pluginName](options)
  })
}
