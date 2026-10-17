import { createSlice } from '@reduxjs/toolkit';
import { readSession } from '../utils/authStorage';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: readSession(),
  },
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    clearCurrentUser(state) {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = authSlice.actions;
export default authSlice.reducer;