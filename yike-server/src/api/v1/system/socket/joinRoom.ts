import Config from '@/config/Config'
import { Success } from '@/core/HttpException'
import { SocketServer } from '@/core/SocketServer'
import KoaRouter from 'koa-router'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/auth`,
})

router.get('/room-exists/:roomId', (ctx) => {
  const { roomId } = ctx.params
  const roomState = SocketServer.roomCheckHandler(roomId)

  throw new Success(roomState)
})

export default router
