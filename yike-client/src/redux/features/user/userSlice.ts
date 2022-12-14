import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getToken, getUserInfo } from '@/common/utils/helpers/getTools'
import { StoreProps } from '@/common/typings/store'

export interface UserState {
  token: string
  userInfo: {
    username: string
    password: string
  }
  userSocketId: string
}

const initialUserState: UserState = {
  token: getToken() ?? '',
  userInfo: getUserInfo() ?? {
    username: 'default-username',
    password: 'default-password',
  },
  userSocketId: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setUserInfo: (state, action: PayloadAction<UserState['userInfo']>) => {
      state.userInfo = action.payload
    },
    setUserSocketId: (state, action: PayloadAction<string>) => {
      state.userSocketId = action.payload
    },
  },
})

export const { setToken, setUserInfo, setUserSocketId } = userSlice.actions

export const selectToken = (state: StoreProps) => state.user.token
export const selectUserInfo = (state: StoreProps) => state.user.userInfo
export const selectUserSocketId = (state: StoreProps) => state.user.userSocketId

export default userSlice.reducer
