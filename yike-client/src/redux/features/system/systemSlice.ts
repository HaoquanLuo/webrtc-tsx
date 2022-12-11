import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { StoreProps } from '@/common/typings/store'
import { getToken } from '@/common/utils/helpers/getTools'
import { SIO } from '../../../../../socket'

type RoomStatus = 'loading' | 'created' | 'destroyed'

export interface SystemState {
  logState: boolean
  currentPath: string
  connectOnlyWithAudio: boolean
  roomHost: boolean
  roomStatus: RoomStatus
  roomId: string
  roomParticipants: SIO.User[]
}

const initialSystemState: SystemState = {
  logState: getToken() !== null ? true : false,
  currentPath: '/',
  connectOnlyWithAudio: true,
  roomHost: false,
  roomStatus: 'loading',
  roomId: '',
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
    setConnectOnlyWithAudio: (state, action: PayloadAction<boolean>) => {
      state.connectOnlyWithAudio = action.payload
    },
    setRoomHost: (state, action: PayloadAction<boolean>) => {
      state.roomHost = action.payload
    },
    setRoomStatus: (state, action: PayloadAction<RoomStatus>) => {
      state.roomStatus = action.payload
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload
    },
    setRoomParticipants: (state, action: PayloadAction<SIO.User[]>) => {
      state.roomParticipants = action.payload
    },
  },
})

export const {
  setLogState,
  setCurrentPath,
  setConnectOnlyWithAudio,
  setRoomHost,
  setRoomStatus,
  setRoomId,
  setRoomParticipants,
} = systemSlice.actions

export const selectLogState = (state: StoreProps) => state.system.logState
export const selectCurrentPath = (state: StoreProps) => state.system.currentPath
export const selectConnectOnlyWithAudio = (state: StoreProps) =>
  state.system.connectOnlyWithAudio
export const selectRoomHost = (state: StoreProps) => state.system.roomHost
export const selectRoomStatus = (state: StoreProps) => state.system.roomStatus
export const selectRoomId = (state: StoreProps) => state.system.roomId
export const selectRoomParticipants = (state: StoreProps) =>
  state.system.roomParticipants

export default systemSlice.reducer
