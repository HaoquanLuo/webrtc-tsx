import { AxiosResponse } from 'axios'
declare global {
  module System {
    type RoomStatus = 'unbuild' | 'existed' | 'created' | 'destroyed'

    type WebRTCStatus =
      | 'uninitialized'
      | 'signaling'
      | 'streaming'
      | 'connected'
      | 'disconnected'

    type Microphone = 'muted' | 'loud'
    type Camera = 'off' | 'on'
    type ScreenShare = 'screen' | 'camera'
  }

  module User {
    type UserInfo = {
      username: string
      password: string
    }
    type Message = {
      id: string
      author: string
      content: string
      createdByMe: boolean
    }
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
