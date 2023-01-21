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
    type Info = {
      username: string
      password: string
    }
    type PublicMessage = {
      id: string
      author: string
      authorId: string
      content: string
    }
    type DirectMessages = {
      [key: string]: Omit<User.PublicMessage, 'author'>[]
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
