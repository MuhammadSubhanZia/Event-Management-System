import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import eventsReducer from './eventsSlice';
import registrationsReducer from './registrationsSlice';
import { saveSession } from '../utils/authStorage';
import { saveRegistrations } from '../utils/registrationStorage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
  },
});

let previousUser = store.getState().auth.currentUser;
let previousRegistrations = store.getState().registrations.byUser;

store.subscribe(() => {
  const state = store.getState();

  if (state.auth.currentUser !== previousUser) {
    previousUser = state.auth.currentUser;
    saveSession(previousUser);
  }

  if (state.registrations.byUser !== previousRegistrations) {
    previousRegistrations = state.registrations.byUser;
    saveRegistrations(previousRegistrations);
  }
});