import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProductCategoryList } from '../../services/productServices';

export const fetchCategories = createAsyncThunk('fetchCategories', async () => {
      const res = await getProductCategoryList();
      return res.data;
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    categoryLoading: false,
    categoryError: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = true;
		console.log('Error fetching categories:', action.payload.message);
      });
  },
});

export default categorySlice.reducer;
