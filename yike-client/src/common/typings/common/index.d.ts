import { SIO } from '../socket'
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

    type StreamStatus = 'loading' | 'completed'

    type Microphone = 'muted' | 'loud'
    type Camera = 'off' | 'on'
    type ScreenShare = 'screen' | 'camera'
  }

  module User {
    type Info = {
      username: string
      password: string
    }
    type ChatSectionStructure = {
      chatId: string
      chatTitle: string
      chatMessages: SIO.Message[]
    }
    type ChatSectionStore = {
      [userName: string]: ChatSectionStructure
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
