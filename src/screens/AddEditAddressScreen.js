import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text,
  View, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addNewAddress, 
  updateExistingAddress, 
  fetchAddresses, 
  resetError 
} from '../redux/slice/addressSlice';
import InputField from '../components/InputField';
import { ErrorModal, SuccessModal } from '../components/Modal';
import { colors } from '../Styles/appStyle';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../components/Header';

const AddEditAddressScreen = () => {
  const { address } = useLocalSearchParams();
  const addressToEdit = address ? JSON.parse(address) : null;
  const [inputs, setInputs] = useState({
    contact_name: addressToEdit?.contact_name || '',
    mobile_number: addressToEdit?.mobile_number || '',
    address_line_1: addressToEdit?.address_line_1 || '',
    address_line_2: addressToEdit?.address_line_2 || '',
    location: addressToEdit?.place || '',
    pin_code: addressToEdit?.pin_code || '',
  });
  const [locationPermission, setLocationPermission] = useState(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { loading, error } = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();

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
        ].filter(Boolean).join(', ');

        setInputs(prevState => ({
          ...prevState,
          address_line_1: formattedAddress || '',
          location: locationData.street || locationData.place || '',
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
      if (addressToEdit) {
        await dispatch(updateExistingAddress({ id: addressToEdit.id, ...inputs })).unwrap();
        setSuccessMessage('Address Updated Successfully');
      } else {
        await dispatch(addNewAddress(inputs)).unwrap();
        setSuccessMessage('Address Added Successfully');
      }
      dispatch(fetchAddresses());
      setSuccessVisible(true);
      setTimeout(() => router.back(), 3000);
    } catch (error) {
      // Error handled by Redux state
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        isHomePage={false} 
        onBackPress={() => router.back()} 
        title={addressToEdit ? 'Update Address' : 'Add New Address'} 
      />
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
      
      <ScrollView contentContainerStyle={styles.form}>
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
                {addressToEdit ? 'Update Address' : 'Save Address'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
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
});

export default AddEditAddressScreen;