import request from '@/utils/request'

const Common = '/system/common'
const api = {
  sendCode: `${Common}/code`,
}

/**
 * 获取图形验证码
 * @returns svg
 */
export function sendCodeCaptcha() {
  return request.get(api.sendCode)
}
