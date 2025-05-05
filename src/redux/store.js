import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice/CartSlice"
import ProductReducer from "./slice/productSlice"
import CategoryReducer from "./slice/categorySlice"
import addressReducer from "./slice/addressSlice"


export const store = configureStore({
	reducer: {
		cart: cartReducer,
		product: ProductReducer,
		category: CategoryReducer,
		address: addressReducer,
		// Add other slices here if needed
		// Example: user: userReducer,
		// Example: products: productsReducer,
		// Example: orders: ordersReducer,
		// Example: reviews: reviewsReducer,
		// Example: categories: categoriesReducer,
		// Example: auth: authReducer,
	}
})