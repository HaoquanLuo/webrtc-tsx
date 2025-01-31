import { Models } from '../common/typings/model'
import { ParameterException } from '../core/HttpException'
import { validate } from '../server/ajv'

// 请求参数类型
type RequestDataType = 'query' | 'body'

/**
 * @description 数据校验中间件
 * @param schema
 * @param type
 * @returns
 */
function validator(
  schema: string | boolean | object,
  type: RequestDataType = 'query',
) {
  return async function validator(ctx: Models.Ctx, next: Function) {
    const data = ctx.request[type] as any
    const errors = validate(schema, data) || null
    if (errors) {
      console.log('数据校验失败')
      //校验失败
      throw new ParameterException(errors)
    }
    await next()
  }
}
export default validator
