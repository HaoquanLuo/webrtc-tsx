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
  const { code } = ctx.request.body as any

  if (code === 'register') {
    console.log('-------register--------')

    await next()
  }

  if (ctx.session!.code !== code) {
    throw new ParameterException('验证码错误')
  } else {
    await next()
  }
}
