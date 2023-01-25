import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { StoreProps } from '@/common/typings/store'
import { SIO } from '@/common/typings/socket'

export interface SystemState {
  currentPath: string
  connectWithAudioOnly: boolean
  errorMessage: System.ErrorMessage
  roomHost: boolean
  roomStatus: System.RoomStatus
  roomId: string
  roomParticipants: SIO.User[]
  webRTCStatus: System.WebRTCStatus
}

const initialSystemState: SystemState = {
  currentPath: '/',
  connectWithAudioOnly: true,
  errorMessage: {
    key: '',
    content: '',
  },
  roomHost: false,
  roomStatus: 'unbuild',
  roomId: '',
  roomParticipants: [],
  webRTCStatus: 'uninitialized',
}

export const systemSlice = createSlice({
  name: 'system',
  initialState: initialSystemState,
  reducers: {
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload
    },
    setConnectWithAudioOnly: (state, action: PayloadAction<boolean>) => {
      state.connectWithAudioOnly = action.payload
    },
    setErrorMessage: (state, action: PayloadAction<System.ErrorMessage>) => {
      state.errorMessage = action.payload
    },
    setRoomHost: (state, action: PayloadAction<boolean>) => {
      state.roomHost = action.payload
    },
    setRoomStatus: (state, action: PayloadAction<System.RoomStatus>) => {
      state.roomStatus = action.payload
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload
    },
    setRoomParticipants: (state, action: PayloadAction<SIO.User[]>) => {
      state.roomParticipants = action.payload
    },
    setWebRTCStatus: (state, action: PayloadAction<System.WebRTCStatus>) => {
      state.webRTCStatus = action.payload
    },
  },
})

export const {
  setCurrentPath,
  setConnectWithAudioOnly,
  setErrorMessage,
  setRoomHost,
  setRoomStatus,
  setRoomId,
  setRoomParticipants,
  setWebRTCStatus,
} = systemSlice.actions

export const selectCurrentPath = (state: StoreProps) => state.system.currentPath
export const selectConnectWithAudioOnly = (state: StoreProps) =>
  state.system.connectWithAudioOnly
export const selectErrorMessage = (state: StoreProps) =>
  state.system.errorMessage
export const selectRoomHost = (state: StoreProps) => state.system.roomHost
export const selectRoomStatus = (state: StoreProps) => state.system.roomStatus
export const selectRoomId = (state: StoreProps) => state.system.roomId
export const selectRoomParticipants = (state: StoreProps) =>
  state.system.roomParticipants
export const selectWebRTCStatus = (state: StoreProps) =>
  state.system.webRTCStatus

export default systemSlice.reducer
