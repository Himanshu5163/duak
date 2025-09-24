import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Strings } from '../theme/Strings';

// Async thunk for fetching doctors
export const fetchSetting = createAsyncThunk(
  'settings/fetchSetting',
  async ({ API_URL}) => {

    const response = await fetch(`${API_URL}/appData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json(); // ✅ Parse the JSON
    return data.data || []; // ✅ Fallback to empty array if data is null
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    settings: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSetting.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSetting.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(fetchSetting.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default settingsSlice.reducer;
