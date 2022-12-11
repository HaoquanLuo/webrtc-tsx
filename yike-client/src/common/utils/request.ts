import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { notification } from 'antd'
import { loginRoutePath } from '@/common/constants/routes'
import { ACCESS_TOKEN } from '@/common/constants/user'
import { setToken } from '@/redux/features/user/userSlice'
import { getStore } from './getStore'
import { store } from '@/redux/store'
import { removeItem } from './storage'

// redux
const userState = getStore().user
const dispatch = store.dispatch

// axios 基础配置
axios.defaults.baseURL = import.meta.env.VITE_APP_API_BASE_URL
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 请求拦截器
axios.interceptors.request.use(
  (config): AxiosRequestConfig<unknown> => {
    const token = userState.token
    if (token) {
      config.headers![ACCESS_TOKEN] = token
    }
    return config
  },
  (error) => {
    return error
  },
)

// 异常拦截处理器
const errorHandler = (error: AxiosError) => {
  if (error.response) {
    const data = error.response.data as any
    const token = userState.token
    if (error.response.status === 403) {
      notification.error({
        message: '权限不足',
        description: data.msg,
      })
    }
    if (error.response.status === 401 && !data.data) {
      notification.error({
        message: '登录失效',
        description: data.msg,
      })
      const reload = () => {
        setTimeout(() => {
          window.location.replace(loginRoutePath)
        }, 1500)
      }
      if (token) {
        dispatch(setToken(''))
        removeItem('token')
      }
      reload()
    }
  }
  return Promise.reject(error)
}

// 响应拦截
axios.interceptors.response.use((response) => {
  // console.log('--------------------------------')
  // console.log('response: ', response)
  // console.log('--------------------------------')
  if (response?.status === 200) {
    return Promise.resolve(response)
  }
  if (response.data?.errorCode !== 10000) {
    notification.error({
      message: '请求失败',
      description: response.data.msg,
    })
    return Promise.reject(response)
  }
  return response.data.data
}, errorHandler)

export default axios
