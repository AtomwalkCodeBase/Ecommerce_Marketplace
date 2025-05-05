import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchAddresses, 
  addNewAddress, 
  updateExistingAddress, 
  deleteExistingAddress,
  DefaultAddress, 
  setSelectedAddressId, 
  resetError 
} from '../redux/slice/addressSlice'; // Adjust path as needed
import InputField from '../components/InputField'; // Adjust path as needed
import { ErrorModal, SuccessModal } from '../components/Modal'; // Adjust path as needed
import { colors } from '../Styles/appStyle';
// import ErrorModal from './Modals'; // Adjust path as needed


const AddressManagementComponent = () => {
  // Local state for form and UI
  const [inputs, setInputs] = useState({
    contact_name: '',
    mobile_number: '',
    address_line_1: '',
    address_line_2: '',
    location: '',
    pin_code: '',
  });
  const [locationPermission, setLocationPermission] = useState(null);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // Track address being deleted
  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redux state and dispatch
  const { addresses, selectedAddressId, loading, error } = useSelector((state) => state.address);
  const dispatch = useDispatch();

  // Fetch addresses on component mount and handle location permission
  useEffect(() => {
    dispatch(fetchAddresses());

    // Request location permission
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();
  }, [dispatch]);

  // Handle errors from Redux state
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setErrorVisible(true);
    }
  }, [error]);

  const getLocationAsync = async () => {
    try {
      if (!locationPermission) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMessage('Please grant location permissions to use this feature.');
          setErrorVisible(true);
          return;
        }
        setLocationPermission(true);
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = location.coords;
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (geocode.length > 0) {
        const locationData = geocode[0];
        const formattedAddress = [
          locationData.name,
          locationData.street,
          locationData.city,
          locationData.region,
          // locationData.postalCode
        ].filter(Boolean).join(', ');

        setInputs(prevState => ({
          ...prevState,
          address_line_1: formattedAddress || '',
          location: locationData.street || locationData.name || '',
          pin_code: locationData.postalCode || '',
        }));
      }
    } catch (error) {
      setErrorMessage('Could not fetch location: ' + error.message);
      setErrorVisible(true);
    }
  };

  const saveAddress = async () => {
    if (!inputs.contact_name || !inputs.mobile_number || !inputs.address_line_1 || !inputs.pin_code) {
      setErrorMessage('Please fill in all required fields.');
      setErrorVisible(true);
      return;
    }
  
    try {
      if (editingAddressId) {
        await dispatch(updateExistingAddress({  id: editingAddressId, ...inputs })).unwrap(); //Used .unwrap() to handle success alerts and trigger fetchAddresses to refresh the list.
        setSuccessMessage('Address Updated Successfully');
      } else {
        await dispatch(addNewAddress(inputs)).unwrap();
        setSuccessMessage('Address Added Successfully');
      }
      setSuccessVisible(true);
      dispatch(fetchAddresses()); // Refresh address list
      resetForm();
      setEditingAddressId(null);
    } catch (error) {
      // Error is handled by Redux state and useEffect
    }
  };

  const resetForm = () => {
    setInputs({
      contact_name: '',
      mobile_number: '',
      address_line_1: '',
      address_line_2: '',
      location: '',
      pin_code: '',
    });
  };

  const handleDeleteAddress = (id) => {
    if (deletingId) return; // Prevent multiple deletions
    setDeletingId(id);

    dispatch(deleteExistingAddress(id))
      .unwrap()
      .then(() => {
        dispatch(fetchAddresses()); // Refresh address list
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  const setDefaultAddress = async (id) => {
    try {
      const address = addresses.find((addr) => addr.id === id);
      if (!address) throw new Error('Address not found');
      const addressData = {
        // id,
        name: address.contact_name,
        mobile_number: address.mobile_number,
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2,
        location: address.location,
        pin_code: address.pin_code,
      };
      console.log("sshdcahd",addressData);
      
      await dispatch(DefaultAddress(addressData)).unwrap();
      setSuccessMessage('Address Successfully updated as Default Address');
      setSuccessVisible(true);
      dispatch(fetchAddresses()); // Refresh address list
    } catch (error) {
      // Error is handled by Redux state and useEffect
    }
  };

  const editAddress = (address) => {
    setInputs({
      id: address.id,
      contact_name: address.contact_name || '',
      mobile_number: address.mobile_number || '',
      address_line_1: address.address_line_1 || '',
      address_line_2: address.address_line_2 || '',
      location: address.location || '',
      pin_code: address.pin_code || '',
    });
    setEditingAddressId(address.id);
  };

  const renderAddress = ({ item }) => (
    <View style={styles.savedAddressCard}>
      <View style={styles.addressHeader}>
        <TouchableOpacity 
          style={styles.radioButton}
          onPress={() => setDefaultAddress(item.id)}
        >
          <View style={[
            styles.radioCircle, 
            selectedAddressId === item.id && styles.radioCircleSelected
          ]}>
            {selectedAddressId === item.id && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.radioText}>{item.isDefault ? 'Default Address' : 'Use This Address'}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.addressContent}>
        <View style={styles.addressNameRow}>
          <Text style={styles.addressName}>{item.contact_name}</Text>
          <Text style={styles.addressPhone}>{item.mobile_number}</Text>
        </View>
        
        <Text style={styles.addressLine}>
          {item.address_line_1}
          {item.address_line_2 ? `, ${item.address_line_2}` : ''},
          {item.location ? ` ${item.location},` : ''} {item.pin_code}
        </Text>
      </View>
      
      <View style={styles.addressActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => editAddress(item)}>
          <Ionicons name="pencil" size={16} color={colors.primary} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDeleteAddress(item.id)}
          disabled={deletingId === item.id}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SuccessModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        message={successMessage}
      />
      <ErrorModal
        visible={errorVisible}
        onClose={() => {
          setErrorVisible(false);
          dispatch(resetError());
        }}
        message={errorMessage}
      />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {editingAddressId ? 'Edit Address' : 'Add New Address'}
        </Text>
      </View>
      
      <View style={styles.form}>
        <View style={styles.inputRow}>
          <InputField
            label="Full Name"
            value={inputs.contact_name}
            onChangeText={text => setInputs(prev => ({ ...prev, contact_name: text }))}
            placeholder="Enter your full name"
            placeholderTextColor={colors.textSecondary}
            containerStyle={{ flex: 1, marginRight: 10 }}
          />
          
          <InputField
            label="Mobile Number"
            value={inputs.mobile_number}
            onChangeText={text => setInputs(prev => ({ ...prev, mobile_number: text }))}
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            placeholderTextColor={colors.textSecondary}
            containerStyle={{ flex: 1 }}
          />
        </View>

        <InputField
          label="Address Line 1"
          value={inputs.address_line_1}
          onChangeText={text => setInputs(prev => ({ ...prev, address_line_1: text }))}
          placeholder="Enter your address line 1"
          placeholderTextColor={colors.textSecondary}
        />

        <InputField
          label="Address Line 2"
          value={inputs.address_line_2}
          onChangeText={text => setInputs(prev => ({ ...prev, address_line_2: text }))}
          placeholder="Enter your address line 2"
          placeholderTextColor={colors.textSecondary}
        />

        <InputField
          label="Location"
          value={inputs.location}
          onChangeText={text => setInputs(prev => ({ ...prev, location: text }))}
          placeholder="Enter your location (street)"
          placeholderTextColor={colors.textSecondary}
        />

        <InputField
          label="Pin Code"
          value={inputs.pin_code}
          onChangeText={text => setInputs(prev => ({ ...prev, pin_code: text }))}
          placeholder="Pin Code"
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />

        <TouchableOpacity 
          style={styles.locationButton} 
          onPress={getLocationAsync}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <>
              <Ionicons name="location" size={20} color={colors.textOnPrimary} />
              <Text style={styles.locationButtonText}>
                Use Current Location
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
          onPress={saveAddress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color={colors.textOnPrimary} />
              <Text style={styles.saveButtonText}>
                {editingAddressId ? 'Update Address' : 'Save Address'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.savedAddressesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
        </View>
        
        {addresses.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={addresses}
            renderItem={renderAddress}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={styles.addressList}
          />
        ) : (
          <View style={styles.noAddressContainer}>
            <Ionicons name="location-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.noAddressText}>No saved addresses yet</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionHeader: {
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  form: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  locationButton: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.primaryTransparent,
  },
  saveButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  savedAddressesSection: {
    flex: 1,
  },
  addressList: {
    paddingHorizontal: 20,
  },
  savedAddressCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addressHeader: {
    marginBottom: 12,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  radioText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  addressContent: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  addressNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  addressPhone: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  addressLine: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 16,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  noAddressContainer: {
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAddressText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  }
});

export default AddressManagementComponent;