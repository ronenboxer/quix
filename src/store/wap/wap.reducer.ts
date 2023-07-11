import { Draft, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../'

interface WapState {
    shit:number
}

const initialState: WapState = {
    shit: 0
}

export const wapSlice = createSlice({
  name: 'wap',
  initialState,
  reducers: {
    incrementByAmount: (state, action: PayloadAction<number>) => {

    },
  },
})

export const {  incrementByAmount } = wapSlice.actions

export default wapSlice.reducer