import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/features/user/userSlice'
import systemReducer from '@/features/system/systemSlice'

export const store = configureStore({
  reducer: {
    system: systemReducer,
    user: userReducer,
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
