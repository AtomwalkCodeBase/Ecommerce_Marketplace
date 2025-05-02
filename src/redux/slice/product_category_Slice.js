import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProductCategoryList, productList } from '../../services/productServices';


export const fetch_Product_Category = createAsyncThunk('fetch_Product/Category',async () => {
      const [productsRes, categoriesRes] = await Promise.all([
        productList(),
        getProductCategoryList(),
      ]);
      return {
        products: productsRes.data,
        categories: categoriesRes.data,
      };
  }
);

const Product_Category_Slice = createSlice({
  name: 'Product_Category',
  initialState: {
    products: [],
    categories: [],
    isLoading: false,
    isError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetch_Product_Category.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetch_Product_Category.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.categories = action.payload.categories;
      })
      .addCase(fetch_Product_Category.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
		    console.log('Error fetching fetchCategoryList:', action.payload.message);

      });
  },
});

export default Product_Category_Slice.reducer;
