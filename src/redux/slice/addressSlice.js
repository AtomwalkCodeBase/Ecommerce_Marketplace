import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addAddress, fetchAddressList, updateAddress, deleteAddress, setDefaultAddress } from '../../services/productServices';

// Async thunk to fetch addresses
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAddressList('A');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch addresses');
    }
  }
);

// Async thunk to add an address
export const addNewAddress = createAsyncThunk(
	'address/addNewAddress',
	async (inputs, { rejectWithValue }) => {
	  try {
		// Exclude id and rename contact_name to name
		const { id, contact_name, ...rest } = inputs;
		const addressData = { id, name: contact_name, ...rest };
		const response = await addAddress(addressData);
		return response.data; // Return the added address data
	  } catch (error) {
		return rejectWithValue(error.response?.data?.detail || 'Failed to add address');
	  }
	}
  );

// Async thunk to update an address
export const updateExistingAddress = createAsyncThunk(
	'address/updateExistingAddress',
	async (inputs, { rejectWithValue }) => {
	  try {
		const { id, contact_name, ...rest } = inputs;
		const addressUpdateData = { id, name: contact_name, ...rest };
		const response = await updateAddress(addressUpdateData);
		return response.data; // Return the updated address data
	  } catch (error) {
		return rejectWithValue(error.response?.data?.detail || 'Failed to update address');
	  }
	}
  );

// Async thunk to delete an address
export const deleteExistingAddress = createAsyncThunk(
	'address/deleteExistingAddress',
	async (id, { rejectWithValue }) => {
	  try {
		const addressId = String(id);
		if (!addressId) throw new Error('Address ID is required for deletion');
		console.log('deleteExistingAddress Payload:', { id: addressId });
		await deleteAddress(addressId);
		return addressId; // Return the deleted ID for state update
	  } catch (error) {
		console.log('deleteExistingAddress Error:', {
		  message: error.message,
		  response: error.response?.data,
		  details: error.response?.data?.details,
		  status: error.response?.status
		});
		return rejectWithValue(error.response?.data?.details || error.response?.data?.detail || error.message || 'Failed to delete address');
	  }
	}
  );

  // Async thunk to set default address
export const DefaultAddress = createAsyncThunk(
	'address/setDefaultAddress',
	async (inputs, { rejectWithValue }) => {
	  try {
		// Convert all fields to strings
		// const addressData = {
		//   id: String(inputs.id),
		//   name: String(inputs.name),
		//   mobile_number: String(inputs.mobile_number),
		//   address_line_1: String(inputs.address_line_1),
		//   address_line_2: String(inputs.address_line_2),
		//   location: String(inputs.location),
		//   pin_code: String(inputs.pin_code),
		// };
		console.log('setDefaultAddress Payload:', inputs);
		const response = await setDefaultAddress(inputs);
		return response.data; // Return the updated address data
	  } catch (error) {
		console.log('setDefaultAddress Error:', {
		  message: error.message,
		  response: error.response?.data,
		  details: error.response?.data?.details,
		  status: error.response?.status
		});
		return rejectWithValue(error.response?.data?.details || error.response?.data?.detail || error.message || 'Failed to set default address');
	  }
	}
  );

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    selectedAddressId: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Clear error state
    resetError(state) {
      state.error = null;
    },
    // Set selected address ID and update isDefault flags
    setSelectedAddressId(state, action) {
      const id = action.payload;
      state.selectedAddressId = id;
      state.addresses = state.addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }));
    },
  },
  extraReducers: (builder) => {
    // Fetch Addresses
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.map((addr, index) => ({
          ...addr,
          isDefault: state.selectedAddressId ? addr.id === state.selectedAddressId : index === 0,
        }));
        if (action.payload.length > 0 && !state.selectedAddressId) {
          state.selectedAddressId = action.payload[0].id;
        } else if (action.payload.length === 0) {
          state.selectedAddressId = null;
        }
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Address
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.loading = false;
        // Fetch updated list to ensure consistency
        // Note: This assumes the API doesn't return the full list
        state.error = null;
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Address
	builder
    .addCase(updateExistingAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateExistingAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      console.log("Response fulfill====>", action.payload);
    })
    .addCase(updateExistingAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.log('Update Address Error:', { 
        error: action.error, 
        payload: action.payload, 
        details: action.error.response?.data?.details,
        statusCode: action.error.response?.status || 'Unknown'
      });
    });

    // Delete Address
    builder
    .addCase(deleteExistingAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteExistingAddress.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.payload;
      state.addresses = state.addresses.filter((addr) => addr.id !== deletedId);
      if (deletedId === state.selectedAddressId) {
        state.selectedAddressId = state.addresses.length > 0 ? state.addresses[0].id : null;
        state.addresses = state.addresses.map((addr, index) => ({
          ...addr,
          isDefault: index === 0,
        }));
      }
    })
    .addCase(deleteExistingAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.log('Delete Address Error:', { 
        error: action.error, 
        payload: action.payload, 
        details: action.error.response?.data?.details,
        statusCode: action.error.response?.status || 'Unknown'
      });
    });

	 // Add setDefaultAddress cases
	 builder
	 .addCase(DefaultAddress.pending, (state) => {
	   state.loading = true;
	   state.error = null;
	 })
	 .addCase(DefaultAddress.fulfilled, (state, action) => {
	   state.loading = false;
	   state.error = null;
	   const updatedAddress = action.payload;
	   state.addresses = state.addresses.map((addr) =>
		 addr.id === updatedAddress.id
		   ? { ...addr, isDefault: true }
		   : { ...addr, isDefault: false }
	   );
	   state.selectedAddressId = updatedAddress.id;
	   console.log('setDefaultAddress Response:', action.payload);
	 })
	 .addCase(DefaultAddress.rejected, (state, action) => {
	   state.loading = false;
	   state.error = action.payload;
	   console.log('setDefaultAddress Error:', {
		 error: action.error,
		 payload: action.payload,
		 details: action.error.response?.data?.details,
		 statusCode: action.error.response?.status || 'Unknown'
	   });
	 });
  },
});

export const { resetError, setSelectedAddressId } = addressSlice.actions;
export default addressSlice.reducer;