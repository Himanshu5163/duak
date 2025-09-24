import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Strings } from '../theme/Strings';

// Async thunk for fetching doctors
export const fetchSidebars = createAsyncThunk(
  'sidebars/fetchSidebars',
  async ({ API_URL, user_id, role_id }) => {

    const response = await fetch(`${API_URL}/sidebarPermission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id, role_id }), // ✅ Send as JSON string
    });

    const data = await response.json(); // ✅ Parse the JSON
    return data.data || []; // ✅ Fallback to empty array if data is null
  }
);

const sidebarsSlice = createSlice({
  name: 'sidebars',
  initialState: {
    sidebars: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSidebars.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSidebars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sidebars = action.payload;
      })
      .addCase(fetchSidebars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default sidebarsSlice.reducer;
