import { Draft, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { OperationStatus, Wap } from '@/model/wap'
import { objectRecursiveUpdate } from '@/services/util.service'

interface WapState {
  undoLogs: any[]
  redoLogs: any[]
  actionResults: OperationStatus<string> | null
}


const initialState: WapState = {
  undoLogs: [],
  redoLogs: [],
  actionResults: null,
}

export const wapSlice = createSlice({
  name: 'wapStore',
  initialState,
  reducers: {
    addBreakpoint: (state, action: PayloadAction<{ breakpoint: number, pageId: string }>) => {

    },
    undo: (state, action:PayloadAction<Wap>) => {
      if (state.undoLogs.length) {
        const undo = state.undoLogs.slice(-1)[0]
        objectRecursiveUpdate(action.payload, undo)
        return { ...state, undoLogs: [...state.undoLogs.slice(0, -1)], redoLogs: [...state.redoLogs, undo] }
      }
      return { ...state }
    },
    redo: (state) => {
      if (state.redoLogs.length) {
        const action = state.redoLogs.pop()
        state.undoLogs.push(action)
        return action
      }
      return null
    },
    addActionToUndoLogs: (state, action: PayloadAction<any>) => {
      state.redoLogs = []
      state.undoLogs = [...state.undoLogs, action.payload]
    }
  },
})

export const { undo, redo, addActionToUndoLogs, addBreakpoint } = wapSlice.actions
export const { undoLogs: undos } = wapSlice.getInitialState()

export default wapSlice.reducer