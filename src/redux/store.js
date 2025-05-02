import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice/CartSlice"
import ProductCategoryReducer from "./slice/product_category_Slice"


export const store = configureStore({
	reducer: {
		cart: cartReducer,
		Product_Category: ProductCategoryReducer,
		// Add other slices here if needed
		// Example: user: userReducer,
		// Example: products: productsReducer,
		// Example: orders: ordersReducer,
		// Example: reviews: reviewsReducer,
		// Example: categories: categoriesReducer,
		// Example: auth: authReducer,
	}
})