import globalSlice from './globalSlice'

import { configureStore } from '@reduxjs/toolkit'
const store = configureStore({
  reducer: {
    globalStates: globalSlice,
  },
})
export default store // import store
// 如果是 export const 就需要 import {store}
