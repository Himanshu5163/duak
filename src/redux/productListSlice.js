import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching products
export const fetchProductList = createAsyncThunk(
  'productList/fetchProductList',
  async ({ API_URL, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // handle error response
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch products');
      }

      const data = await response.json();
      console.log('product data', data);

      return data.products || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productListSlice = createSlice({
  name: 'productList',
  initialState: {
    productList: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductList.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProductList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productList = action.payload;
      })
      .addCase(fetchProductList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default productListSlice.reducer;
