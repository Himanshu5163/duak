import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching states
export const fetchStates = createAsyncThunk(
  'state/fetchStates',
  async ({ API_URL, token }, { rejectWithValue }) => {
    try {

     
      const response = await fetch(`${API_URL}/get-states`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch states');
      }

      const data = await response.json();
      console.log('States data:', data);

      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const stateSlice = createSlice({
  name: 'state',
  initialState: {
    states: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearStates: (state) => {
      state.states = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.states = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearStates } = stateSlice.actions;
export default stateSlice.reducer;
