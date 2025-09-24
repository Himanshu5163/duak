import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Alert } from 'react-native';

// Async thunk for fetching doctors
export const fetchTicketList = createAsyncThunk(
  'ticketList/fetchTicketList',
  async ({ API_URL, user_id, token }) => {
    const response = await fetch(`${API_URL}/client-tickets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id }), 
    });

    const data = await response.json(); 
    console.log('ticket data',data);
    return data.tickets || []; 
  }
);

const ticketListSlice = createSlice({
  name: 'ticketList',
  initialState: {
    ticketList: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTicketList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ticketList = action.payload;
      })
      .addCase(fetchTicketList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default ticketListSlice.reducer;
