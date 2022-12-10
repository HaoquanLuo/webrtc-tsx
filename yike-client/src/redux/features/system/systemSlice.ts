import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { StoreProps } from '@/common/typings/store'
import { getToken } from '@/common/utils/helpers/getTools'
import { SIO } from '../../../../../socket'

export interface SystemState {
  logState: boolean
  currentPath: string
  roomHost: boolean
  roomId: string
  roomParticipants: SIO.User[]
}

const initialSystemState: SystemState = {
  logState: getToken() !== null ? true : false,
  currentPath: '/',
  roomHost: false,
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
    removeLogState: (state) => {
      state.logState = false
    },
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload
    },
    setRoomHost: (state, action: PayloadAction<boolean>) => {
      state.roomHost = action.payload
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
  removeLogState,
  setCurrentPath,
  setRoomHost,
  setRoomId,
  setRoomParticipants,
} = systemSlice.actions

export const selectLogState = (state: StoreProps) => state.system.logState
export const selectCurrentPath = (state: StoreProps) => state.system.currentPath
export const selectRoomHost = (state: StoreProps) => state.system.roomHost
export const selectRoomId = (state: StoreProps) => state.system.roomId

export default systemSlice.reducer
