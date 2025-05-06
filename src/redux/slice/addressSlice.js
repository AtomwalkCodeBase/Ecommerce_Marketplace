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
  'address/DefaultAddress',
  async (inputs, { rejectWithValue }) => {
    try {
      const { id, ...addressData } = inputs;
      const response = await setDefaultAddress({ id, ...addressData });
      console.log('DefaultAddress Response:', response.data);
      return response.data;
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
    selectedAddress: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetError(state) {
      state.error = null;
    },
    setSelectedAddress(state, action) {
      state.selectedAddress = action.payload;
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
        state.addresses = action.payload;
        if (action.payload.length > 0 && !state.selectedAddress) {
          state.selectedAddress = action.payload.find((addr) => addr.default) || action.payload[0];
        } else if (action.payload.length === 0) {
          state.selectedAddress = null;
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
        state.error = null;
        // Note: Instead of adding directly, we rely on fetchAddresses to update the list
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
        // Note: Instead of updating directly, we rely on fetchAddresses to update the list
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
        if (state.selectedAddress && state.selectedAddress.id === deletedId) {
          state.selectedAddress = state.addresses.length > 0 ? (state.addresses.find((addr) => addr.default) || state.addresses[0]) : null;
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

    // Set Default Address
    builder
      .addCase(DefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updatedAddress = action.payload;
        console.log('setDefaultAddress Payload:', updatedAddress);
        state.addresses = state.addresses.map((addr) =>
          addr.id === updatedAddress.id
            ? { ...updatedAddress, default: true }
            : { ...addr, default: false }
        );
        state.selectedAddress = updatedAddress;
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

export const { resetError, setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;