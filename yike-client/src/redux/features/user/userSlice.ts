import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getToken, getUserInfo } from '@/common/utils/helpers/getTools'
import { StoreProps } from '@/common/typings/store'

export interface UserState {
  token: string
  userInfo: User.Info
  userId: string
  userSocketId: string
  publicMessages: User.PublicMessage[]
  directMessages: User.DirectMessages
}

const initialUserState: UserState = {
  token: getToken() ?? '',
  userInfo: getUserInfo() ?? {
    username: '',
    password: '',
  },
  userId: '',
  userSocketId: '',
  publicMessages: [],
  directMessages: {},
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setUserInfo: (state, action: PayloadAction<User.Info>) => {
      state.userInfo = action.payload
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setUserSocketId: (state, action: PayloadAction<string>) => {
      state.userSocketId = action.payload
    },
    setPublicMessages: (state, action: PayloadAction<User.PublicMessage[]>) => {
      state.publicMessages = action.payload
    },
    setDirectMessages: (state, action: PayloadAction<User.DirectMessages>) => {
      state.directMessages = action.payload
    },
  },
})

export const {
  setToken,
  setUserInfo,
  setUserId,
  setUserSocketId,
  setPublicMessages,
  setDirectMessages,
} = userSlice.actions

export const selectToken = (state: StoreProps) => state.user.token
export const selectUserInfo = (state: StoreProps) => state.user.userInfo
export const selectUserId = (state: StoreProps) => state.user.userId
export const selectUserSocketId = (state: StoreProps) => state.user.userSocketId
export const selectPublicMessages = (state: StoreProps) =>
  state.user.publicMessages
export const selectDirectMessage = (state: StoreProps) =>
  state.user.directMessages

export default userSlice.reducer
