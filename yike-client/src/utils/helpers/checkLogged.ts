import { getItem } from '../storage'

export function checkLogged() {
  const token = getItem('token', false)
  console.log('111', token)
  return token ? true : false
}
