import { createSlice } from '@reduxjs/toolkit';
import { readRegistrations } from '../utils/registrationStorage';

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: {
    byUser: readRegistrations(),
  },
  reducers: {
    registerEvent(state, action) {
      const { userId, registration } = action.payload;
      if (!userId || !registration?.eventId) return;

      if (!state.byUser[userId]) {
        state.byUser[userId] = [];
      }

      const alreadyRegistered = state.byUser[userId].some(
        (item) => item.eventId === registration.eventId
      );

      if (!alreadyRegistered) {
        state.byUser[userId].push(registration);
      }
    },

    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload;
      if (!state.byUser[userId]) return;

      state.byUser[userId] = state.byUser[userId].filter(
        (item) => item.eventId !== eventId
      );
    },
  },
});

export const { registerEvent, cancelRegistration } =
  registrationsSlice.actions;

export default registrationsSlice.reducer;