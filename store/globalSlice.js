import { createSlice } from '@reduxjs/toolkit'
import { globalActions as GlobalActions } from './actions/globalActions'
import { globalStates as GlobalStates } from './states/globalStates'
const globalSlice = createSlice({
  name: 'global',
  initialState: GlobalStates,
  reducers: GlobalActions,
})
export const globalActions = globalSlice.actions
export default globalSlice.reducer
