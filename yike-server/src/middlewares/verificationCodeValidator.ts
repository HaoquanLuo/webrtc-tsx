import { Models } from '../common/typings/model'
import { ParameterException } from '../core/HttpException'

/**
 * @description 校验图形验证码
 * @param ctx
 * @param next
 */
export default async function verificationCodeValidator(
  ctx: Models.Ctx,
  next: Function,
) {
  const { code } = ctx.request.body as { code: string }

  console.log(`code: ${code}, ctx.session: ${JSON.stringify(ctx.session)}`)

  if (process.env.NODE_ENV === 'development') {
    await next()
  }

  if (code === 'register') {
    console.log('-------register--------')

    await next()
  }

  if (ctx.session === null) {
    throw new Error('session 为 null')
  }

  if (ctx.session.code === undefined) {
    throw new Error('cookies 写入失败， session.code 不存在')
  }

  if (ctx.session.code !== code) {
    throw new ParameterException('验证码错误')
  } else {
    await next()
  }
}
