import { configureStore } from '@reduxjs/toolkit'
import wapReducer from './wap/wapEdit.reducer'


export const store = configureStore({
  reducer: {
    wapEdit: wapReducer
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch