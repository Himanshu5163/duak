import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching lead sources
export const fetchLeadSources = createAsyncThunk(
  'leadSource/fetchLeadSources',
  async ({ API_URL, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/get-lead-sources`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch lead sources');
      }

      const data = await response.json();
      console.log('Lead sources data:', data);

      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const leadSourceSlice = createSlice({
  name: 'leadSource',
  initialState: {
    leadSources: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearLeadSources: (state) => {
      state.leadSources = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadSources.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLeadSources.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leadSources = action.payload;
      })
      .addCase(fetchLeadSources.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearLeadSources } = leadSourceSlice.actions;
export default leadSourceSlice.reducer;
