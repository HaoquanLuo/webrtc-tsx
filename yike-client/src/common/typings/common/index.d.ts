import { AxiosResponse } from 'axios'
declare global {
  module System {}
  module Common {
    type Params = string
    interface ResponseData<T> {
      data?: T
      msg?: string
      code?: number
      errorCode?: number
    }
  }
}

export default global
