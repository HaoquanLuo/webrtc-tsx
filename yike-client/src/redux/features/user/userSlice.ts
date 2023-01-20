import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getToken, getUserInfo } from '@/common/utils/helpers/getTools'
import { StoreProps } from '@/common/typings/store'

export interface UserState {
  token: string
  userInfo: User.UserInfo
  userId: string
  userSocketId: string
  messages: User.Message[]
}

const initialUserState: UserState = {
  token: getToken() ?? '',
  userInfo: getUserInfo() ?? {
    username: '',
    password: '',
  },
  userId: '',
  userSocketId: '',
  messages: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setUserInfo: (state, action: PayloadAction<User.UserInfo>) => {
      state.userInfo = action.payload
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setUserSocketId: (state, action: PayloadAction<string>) => {
      state.userSocketId = action.payload
    },
    setMessages: (state, action: PayloadAction<User.Message[]>) => {
      state.messages = action.payload
    },
  },
})

export const {
  setToken,
  setUserInfo,
  setUserId,
  setUserSocketId,
  setMessages,
} = userSlice.actions

export const selectToken = (state: StoreProps) => state.user.token
export const selectUserInfo = (state: StoreProps) => state.user.userInfo
export const selectUserId = (state: StoreProps) => state.user.userId
export const selectUserSocketId = (state: StoreProps) => state.user.userSocketId
export const selectMessages = (state: StoreProps) => state.user.messages

export default userSlice.reducer
