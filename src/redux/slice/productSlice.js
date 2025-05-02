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
    productLoading: false,
    productError: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = true;
		console.log('Error fetching products:', action.payload.message);
      });
  },
});

export default productSlice.reducer;
