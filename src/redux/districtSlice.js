import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDistricts = createAsyncThunk(
  'district/fetchDistricts',
  async ({ API_URL, token, state_id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/get-districts?state_id=${state_id}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch districts');
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const districtSlice = createSlice({
  name: 'district',
  initialState: { districts: [], status: 'idle', error: null },
  reducers: { clearDistricts: (state) => { state.districts = []; state.status = 'idle'; state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistricts.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchDistricts.fulfilled, (state, action) => { state.status = 'succeeded'; state.districts = action.payload; })
      .addCase(fetchDistricts.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || action.error.message; });
  },
});

export const { clearDistricts } = districtSlice.actions;
export default districtSlice.reducer;
