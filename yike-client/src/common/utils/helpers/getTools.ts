import { getItem } from '../storage'

/**
 * @description 从 LocalStorage 获取 Token
 * @returns
 */
export function getToken() {
  const token = getItem('token', false) as string
  return token ? token : null
}

/**
 * @description 从 LocalStorage 获取用户信息
 * @returns
 */
export function getUserInfo() {
  const data = getItem('userInfo', true)

  if (!data) {
    return null
  }
  const { username, password } = data as {
    username: string
    password: string
  }
  return { username, password }
}
