import Config from '@/config/Config'
import { Success } from '@/core/HttpException'
import { SocketEventHandler } from '@/plugin/SocketServer/SocketServerEventHandler'
import KoaRouter from 'koa-router'

const router = new KoaRouter({
  prefix: `${Config.API_PREFIX}v1/system/auth`,
})

router.get('/room-exists/:roomId', async (ctx) => {
  const { roomId } = ctx.params
  const roomState = await SocketEventHandler.roomCheckHandler(roomId)

  throw new Success(roomState)
})

export default router
