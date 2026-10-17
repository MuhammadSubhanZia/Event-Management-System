import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { saveSession } from '../utils/authStorage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

let previousUser = store.getState().auth.currentUser;

store.subscribe(() => {
  const currentUser = store.getState().auth.currentUser;

  if (currentUser !== previousUser) {
    previousUser = currentUser;
    saveSession(currentUser);
  }
});