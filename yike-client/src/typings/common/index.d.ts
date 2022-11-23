import { AxiosResponse } from 'axios'
declare global {
  module System {}
  module Common {
    type Params = string
    interface Response extends AxiosResponse {
      data?: unknown
      msg?: string
      code?: number
      errorCode?: number
    }
  }
}

export default global
