import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productList } from '../../services/productServices';

export const fetchProducts = createAsyncThunk('fetchProducts', async () => {
  const res = await productList();
  return res.data;
});

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
        state.productError = action.error.message || 'Failed to fetch products';
        // console.log('Error fetching products:', action.error.message);
      });
  },
});

// Selectors
export const selectProductsByCategory = (state, categoryName) =>
  categoryName
    ? state.product.products.filter((product) => product.category === categoryName)
    : state.product.products;
    
export const selectProductLoading = (state) => state.product.productLoading;
export const selectProductError = (state) => state.product.productError;

export default productSlice.reducer;