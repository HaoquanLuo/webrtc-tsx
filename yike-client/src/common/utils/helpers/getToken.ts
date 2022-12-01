import { getItem } from '../storage'

export function getToken() {
  const token = getItem('token', false)
  return token ? token : null
}
