import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getToken, getUserInfo } from '@/common/utils/helpers/getTools'
import { StoreProps } from '@/common/typings/store'
import { SIO } from '@/common/typings/socket'

export interface UserState {
  logState: boolean
  token: string
  userInfo: User.Info
  userSocketId: string
  publicMessages: SIO.Message[]
  currChatTargetTitle: string
  chatSectionStore: User.ChatSectionStore
}

const initialUserState: UserState = {
  logState: getToken() !== null ? true : false,
  token: getToken() ?? '',
  userInfo: getUserInfo() ?? {
    username: '',
    password: '',
  },
  userSocketId: '',
  publicMessages: [],
  currChatTargetTitle: '',
  chatSectionStore: {},
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setLogState: (state, action: PayloadAction<boolean>) => {
      state.logState = action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setUserInfo: (state, action: PayloadAction<User.Info>) => {
      state.userInfo = action.payload
    },
    setUserSocketId: (state, action: PayloadAction<string>) => {
      state.userSocketId = action.payload
    },
    setPublicMessages: (state, action: PayloadAction<SIO.Message[]>) => {
      state.publicMessages = action.payload
    },
    setChatSectionStore: (
      state,
      action: PayloadAction<User.ChatSectionStore>,
    ) => {
      state.chatSectionStore = action.payload
    },
    setCurrChatTargetTitle: (state, action: PayloadAction<string>) => {
      state.currChatTargetTitle = action.payload
    },
  },
})

export const {
  setLogState,
  setToken,
  setUserInfo,
  setUserSocketId,
  setPublicMessages,
  setChatSectionStore,
  setCurrChatTargetTitle,
} = userSlice.actions

export const selectLogState = (state: StoreProps) => state.user.logState
export const selectToken = (state: StoreProps) => state.user.token
export const selectUserInfo = (state: StoreProps) => state.user.userInfo
export const selectUserSocketId = (state: StoreProps) => state.user.userSocketId
export const selectPublicMessages = (state: StoreProps) =>
  state.user.publicMessages
export const selectChatSectionStore = (state: StoreProps) =>
  state.user.chatSectionStore
export const selectCurrChatTargetTitle = (state: StoreProps) =>
  state.user.currChatTargetTitle

export default userSlice.reducer
