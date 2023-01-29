import request from '@/common/utils/request'
import { AxiosResponse } from 'axios'
interface LoginData {
  userName: string
  password: string
  code: string
}

type RegisterData = {
  userName: string
  email: string
  password: string
  code: string
}

type CaptchaData = {
  userName: string
  email: string
}

type RoomData = { roomId: string }

const Auth = '/system/auth'

const api = {
  login: `${Auth}/login`,
  logout: `${Auth}/logout`,
  forgePassword: `${Auth}/forge-password`,
  register: `${Auth}/register`,
  sendEmail: `${Auth}/sendCodeEmail`,
  roomState: `${Auth}/room-exists`,
}

/**
 * @description 登录
 * @param params
 * @returns
 */
export function login(
  params: LoginData,
): Promise<AxiosResponse<Common.ResponseData>> {
  return request.post(api.login, params)
}

/**
 * @description 退出登录
 */
export function logout() {
  return request.get(api.logout)
}

/**
 * @description 注册
 */
export function register(
  params: RegisterData,
): Promise<AxiosResponse<Common.ResponseData>> {
  return request.post(api.register, params)
}

/**
 * @description 获取邮箱验证码
 */
export function getEmailCaptcha(
  params: CaptchaData,
): Promise<AxiosResponse<Common.ResponseData>> {
  return request.post(api.sendEmail, params)
}

/**
 * @description 查询房间状态
 * @param roomId
 * @returns
 */
export function getRoomState(params: RoomData): Promise<
  AxiosResponse<
    Common.ResponseData<{
      roomExists: boolean
      full: boolean
    }>
  >
> {
  return request.get(`${api.roomState}/${params.roomId}`)
}
