import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { StoreProps } from '@/common/typings/store'
import { getToken } from '@/common/utils/helpers/getToken'

export interface SystemState {
  logState: boolean
}

const initialSystemState: SystemState = {
  logState: getToken() !== null ? true : false,
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
  },
})

export const { setLogState, removeLogState } = systemSlice.actions

export const selectLogState = (state: StoreProps) => state.system.logState

export default systemSlice.reducer
