import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCities = createAsyncThunk(
  'city/fetchCities',
  async ({ API_URL, token, district_id }, { rejectWithValue }) => {
    try {
        console.log(`${API_URL}/get-cities?district_id=${district_id}`);
      const response = await fetch(`${API_URL}/get-cities?district_id=${district_id}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch cities');
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const citySlice = createSlice({
  name: 'city',
  initialState: { cities: [], status: 'idle', error: null },
  reducers: { clearCities: (state) => { state.cities = []; state.status = 'idle'; state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchCities.fulfilled, (state, action) => { state.status = 'succeeded'; state.cities = action.payload; })
      .addCase(fetchCities.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || action.error.message; });
  },
});

export const { clearCities } = citySlice.actions;
export default citySlice.reducer;
