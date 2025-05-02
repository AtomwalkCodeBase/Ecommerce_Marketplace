import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productList } from '../../services/productServices';

export const fetchProducts = createAsyncThunk('fetchProducts', async () => {
      const res = await productList();
      return res.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    isLoading: false,
    isError: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
		console.log('Error fetching products:', action.payload.message);
      });
  },
});

export default productSlice.reducer;
