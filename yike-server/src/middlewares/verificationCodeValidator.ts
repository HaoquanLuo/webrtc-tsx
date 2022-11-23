import { Models } from '../common/typings/model'
import { ParameterException } from '../core/HttpException'

/**
 * 校验验证码
 * @param ctx
 * @param next
 */
export default async function verificationCodeValidator(
  ctx: Models.Ctx,
  next: Function,
) {
  const { code } = ctx.request.body as any
  console.log('code:', code, typeof code)
  console.log('compare code:', ctx.session!.code, typeof ctx.session!.code)
  console.log('session:', ctx.session)
  if (ctx.session!.code !== code) {
    throw new ParameterException('验证码错误')
  } else {
    await next()
  }
}
