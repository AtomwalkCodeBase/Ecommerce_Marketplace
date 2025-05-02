import { createSlice } from "@reduxjs/toolkit";


const initialState = {
	cartItems: [],
  };

const CartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
	  addToCart: (state, action) => {
		const item = action.payload;
		const existing = state.cartItems.find((p) => p.id === item.id);
  
		if (existing) {
		  existing.quantity += 1;
		} else {
		  state.cartItems.push({ ...item, quantity: 1 });
		}
	  },
  
	  removeFromCart: (state, action) => {
		const id = action.payload;
		state.cartItems = state.cartItems.filter((item) => item.id !== id);
	  },
  
	  incrementQuantity: (state, action) => {
		const item = state.cartItems.find((p) => p.id === action.payload);
		if (item) {
		  item.quantity += 1;
		}
	  },
  
	  decrementQuantity: (state, action) => {
		const item = state.cartItems.find((p) => p.id === action.payload);
		if (item && item.quantity > 1) {
		  item.quantity -= 1;
		}
	  },
  
	  clearCart: (state) => {
		state.cartItems = [];
	  },
	},
  });
  
  export const {
	addToCart,
	removeFromCart,
	incrementQuantity,
	decrementQuantity,
	clearCart,
  } = CartSlice.actions;

export default CartSlice.reducer;