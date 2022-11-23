import request from '@/utils/request'
import { AxiosResponse } from 'axios'

const Auth = '/system/auth'
const api = {
  login: `${Auth}/login`,
  logout: `${Auth}/logout`,
  forgePassword: `${Auth}/forge-password`,
  register: `${Auth}/register`,
  sendEmail: `${Auth}/sendCodeEmail`,
}

interface Login {
  userName: string
  password: string
  code: string
}

/**
 * 登录
 * @param params
 * @returns
 */
export function login(params: Login) {
  return request.post(api.login, params)
}

/**
 * 获取邮箱验证码
 */
export function getEmailCaptcha(params: { userName: string; email: string }) {
  return request.post(api.sendEmail, params)
}

/**
 * 退出登录
 */
export function logout() {
  return request.get(api.logout)
}

/**
 * 注册
 */
export function register(params: {
  userName: string
  email: string
  password: string
  code?: string
}) {
  return request.post(api.register, params)
}
