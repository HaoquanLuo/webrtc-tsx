import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getItem, removeItem } from '@/utils/storage'

export interface UserState {
  token: string
}

const initialState: UserState = {
  token: getItem('token') ?? '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    deleteToken: (state) => {
      state.token = ''
      removeItem('token')
    },
  },
})

export const { setToken, deleteToken } = userSlice.actions
export default userSlice
