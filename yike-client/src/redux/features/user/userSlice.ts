import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getToken } from '@/common/utils/helpers/getToken'
import { StoreProps } from '@/common/typings/store'
import { removeItem } from '@/common/utils/storage'

export interface UserState {
  token: string
}

const initialUserState: UserState = {
  token: getToken() ?? '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    removeToken: (state) => {
      state.token = ''
      removeItem('token')
    },
  },
})

export const { setToken, removeToken } = userSlice.actions

export const selectToken = (state: StoreProps) => state.user.token

export default userSlice.reducer
