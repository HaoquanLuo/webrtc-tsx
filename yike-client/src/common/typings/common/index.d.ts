import { AxiosResponse } from 'axios'
declare global {
  module System {
    type Microphone = 'muted' | 'loud'
    type Camera = 'off' | 'on'
    type ScreenShare = 'screen' | 'camera'
  }
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
