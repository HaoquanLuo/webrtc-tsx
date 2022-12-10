import { getItem } from '../storage'

export function getToken() {
  const token = getItem('token', false) as string
  return token ? token : null
}

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
