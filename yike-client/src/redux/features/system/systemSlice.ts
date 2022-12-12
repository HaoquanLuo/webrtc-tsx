import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { StoreProps } from '@/common/typings/store'
import { getToken } from '@/common/utils/helpers/getTools'
import { SIO } from '../../../../../socket'

type RoomStatus = 'loading' | 'created' | 'destroyed'

export interface SystemState {
  logState: boolean
  currentPath: string
  connectWithAudioOnly: boolean
  errorMessage: string
  roomHost: boolean
  roomCreated: RoomStatus
  roomId: string
  roomExists: boolean
  roomParticipants: SIO.User[]
}

const initialSystemState: SystemState = {
  logState: getToken() !== null ? true : false,
  currentPath: '/',
  connectWithAudioOnly: true,
  errorMessage: '',
  roomHost: false,
  roomCreated: 'loading',
  roomId: '',
  roomExists: false,
  roomParticipants: [],
}

export const systemSlice = createSlice({
  name: 'system',
  initialState: initialSystemState,
  reducers: {
    setLogState: (state, action: PayloadAction<boolean>) => {
      state.logState = action.payload
    },
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload
    },
    setConnectWithAudioOnly: (state, action: PayloadAction<boolean>) => {
      state.connectWithAudioOnly = action.payload
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload
    },
    setRoomHost: (state, action: PayloadAction<boolean>) => {
      state.roomHost = action.payload
    },
    setRoomCreated: (state, action: PayloadAction<RoomStatus>) => {
      state.roomCreated = action.payload
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload
    },
    setRoomExists: (state, action: PayloadAction<boolean>) => {
      state.roomExists = action.payload
    },
    setRoomParticipants: (state, action: PayloadAction<SIO.User[]>) => {
      state.roomParticipants = action.payload
    },
  },
})

export const {
  setLogState,
  setCurrentPath,
  setConnectWithAudioOnly,
  setErrorMessage,
  setRoomHost,
  setRoomCreated,
  setRoomId,
  setRoomExists,
  setRoomParticipants,
} = systemSlice.actions

export const selectLogState = (state: StoreProps) => state.system.logState
export const selectCurrentPath = (state: StoreProps) => state.system.currentPath
export const selectConnectWithAudioOnly = (state: StoreProps) =>
  state.system.connectWithAudioOnly
export const selectErrorMessage = (state: StoreProps) =>
  state.system.errorMessage
export const selectRoomHost = (state: StoreProps) => state.system.roomHost
export const selectRoomCreated = (state: StoreProps) => state.system.roomCreated
export const selectRoomId = (state: StoreProps) => state.system.roomId
export const selectRoomExists = (state: StoreProps) => state.system.roomExists
export const selectRoomParticipants = (state: StoreProps) =>
  state.system.roomParticipants

export default systemSlice.reducer
