import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { searchEvents } from '../services/ticketmaster';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (query, { signal }) => searchEvents(query, signal)
);

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    filters: {
      keyword: '',
      city: '',
      category: 'All',
    },
    page: 0,
    totalPages: 0,
    totalElements: 0,
    currentRequestId: null,
  },
  reducers: {
    updateFilters(state, action) {
      state.filters = action.payload;
      state.page = 0;
    },
    changePage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.items = action.payload.items;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.status = 'succeeded';
        state.currentRequestId = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.currentRequestId = null;

        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }

        state.status = 'failed';
        state.error = action.error.message || 'Could not load events.';
      });
  },
});

export const { updateFilters, changePage } = eventsSlice.actions;
export default eventsSlice.reducer;