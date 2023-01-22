import { AxiosResponse } from 'axios'
import { SIO } from '../../../../../socket'
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
    type PublicChatMessage = {
      id: string
      senderName: string
      senderSocketId: string
      receiverName?: string
      receiverSocketId?: string
      messageContent: string
    }
    type ChatSectionStructure = {
      chatId: string
      chatTitle: string
      chatMessages: SIO.TDirectMessage[]
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
