import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  ScrollView,
  FlatList
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

// Import your color theme
const colors = {
  // Brand & Primary
  primary: '#FF5500',
  primaryTransparent: '#ff550033',
  
  // Text
  textPrimary: '#000000',
  textSecondary: '#777E90',
  textOnPrimary: '#FFFFFF',
  
  // Backgrounds
  background: '#FFFFFF',
  backgroundDark: '#353945',
  backgroundDarker: '#1E1E1E',
  
  // Borders & Divider
  border: '#9B9B9A',
  
  // Status
  error: '#ED1010',
  success: 'green',
  warning: '#FFC300',
  muted: '#eee',
  
  // Utility
  black: '#000000',
  white: '#FFFFFF',
};

// A unique ID generator for addresses
const generateId = () => Math.random().toString(36).substring(2, 15);

const AddressManagementComponent = () => {
  // Form fields
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();

    // For demo: Add some sample addresses
    setSavedAddresses([
      {
        id: '1',
        name: 'John Doe',
        phoneNumber: '555-123-4567',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true
      },
      {
        id: '2',
        name: 'Jane Smith',
        phoneNumber: '555-987-6543',
        address: '456 Park Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
        isDefault: false
      }
    ]);
    
    // Set the default address as selected
    setSelectedAddressId('1');
  }, []);

  const getLocationAsync = async () => {
    setLoading(true);
    try {
      if (!locationPermission) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            "Permission Denied",
            "Please grant location permissions to use this feature.",
            [{ text: "OK" }]
          );
          setLoading(false);
          return;
        }
        setLocationPermission(true);
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      // Reverse geocode to get address
      const { latitude, longitude } = location.coords;
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (geocode.length > 0) {
        const locationData = geocode[0];
        setAddress(locationData.street || '');
        setCity(locationData.city || '');
        setState(locationData.region || '');
        setZipCode(locationData.postalCode || '');
        setCountry(locationData.country || '');
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch location: " + error.message);
      console.error("Error fetching location:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = () => {
    // Basic validation
    if (!name || !phoneNumber || !address || !city || !state || !zipCode) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    // Create a new address object
    const newAddress = {
      id: generateId(),
      name,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      country,
      isDefault: savedAddresses.length === 0, // First address is default
    };

    // Add to saved addresses
    setSavedAddresses([...savedAddresses, newAddress]);
    setSelectedAddressId(newAddress.id);
    
    // Clear form
    resetForm();
    
    Alert.alert("Success", "Address has been saved successfully!");
  };

  const resetForm = () => {
    setName('');
    setPhoneNumber('');
    setAddress('');
    setCity('');
    setState('');
    setZipCode('');
    setCountry('');
  };

  const deleteAddress = (id) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            const updatedAddresses = savedAddresses.filter(address => address.id !== id);
            setSavedAddresses(updatedAddresses);
            
            // If we deleted the selected address, select another one if available
            if (id === selectedAddressId && updatedAddresses.length > 0) {
              setSelectedAddressId(updatedAddresses[0].id);
            } else if (updatedAddresses.length === 0) {
              setSelectedAddressId(null);
            }
          }
        }
      ]
    );
  };

  const setDefaultAddress = (id) => {
    const updatedAddresses = savedAddresses.map(address => ({
      ...address,
      isDefault: address.id === id
    }));
    
    setSavedAddresses(updatedAddresses);
    setSelectedAddressId(id);
  };

  const editAddress = (address) => {
    // Fill the form with the address details for editing
    setName(address.name);
    setPhoneNumber(address.phoneNumber);
    setAddress(address.address);
    setCity(address.city);
    setState(address.state);
    setZipCode(address.zipCode);
    setCountry(address.country);
    
    // Delete the old address
    const updatedAddresses = savedAddresses.filter(addr => addr.id !== address.id);
    setSavedAddresses(updatedAddresses);
  };

  const renderSavedAddress = ({ item }) => (
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
          <Text style={styles.addressName}>{item.name}</Text>
          <Text style={styles.addressPhone}>{item.phoneNumber}</Text>
        </View>
        
        <Text style={styles.addressLine}>
          {item.address}, {item.city}, {item.state} {item.zipCode}
        </Text>
        <Text style={styles.addressLine}>{item.country}</Text>
      </View>
      
      <View style={styles.addressActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => editAddress(item)}>
          <Ionicons name="pencil" size={16} color={colors.primary} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => deleteAddress(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Add New Address</Text>
      </View>
      
      {/* Personal Details Form */}
      <View style={styles.form}>
        {/* <View style={styles.row}> */}
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        {/* </View> */}

        {/* Address Form */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Street Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your street address"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 2, marginRight: 10 }]}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={state}
              onChangeText={setState}
              placeholder="State"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Zip Code</Text>
            <TextInput
              style={styles.input}
              value={zipCode}
              onChangeText={setZipCode}
              placeholder="Zip Code"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={[styles.inputContainer, { flex: 2 }]}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="Country"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

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

        <TouchableOpacity style={styles.saveButton} onPress={saveAddress}>
          <Ionicons name="save-outline" size={20} color={colors.textOnPrimary} />
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
      </View>

      {/* Saved Addresses Section */}
      <View style={styles.savedAddressesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
        </View>
        
        {savedAddresses.length > 0 ? (
          <FlatList
		  scrollEnabled={false}
            data={savedAddresses}
            renderItem={renderSavedAddress}
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
  row: {
    flexDirection: 'row',
    marginBottom: 16,
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