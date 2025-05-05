import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { colors } from '../Styles/appStyle';
import AddressCard from '../components/AddressCard ';
import SectionTitle from '../components/SectionTitle';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses } from '../redux/slice/addressSlice';

const DeliveryAddressScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { addresses, loading, error } = useSelector((state) => state.address);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Set default selected address after addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((addr) => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr.id);
    }
  }, [addresses]);

  const handleContinue = () => {
    if (selectedAddress) {
      router.push({
        pathname: 'PaymentMethodScreen',
        params: { selectedAddress },
      });
    }
  };

  const handleEditAddress = (addressId) => {
    console.log('Edit address', addressId);
  };

  const handleAddAddress = () => {
    console.log('Add new address');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>Failed to load addresses.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <SectionTitle title="Delivery Address" />

        {addresses.map((address) => (
          <View key={address.id}>
            <AddressCard 
              address={address}
              isSelected={selectedAddress === address.id}
              onSelect={() => setSelectedAddress(address.id)}
            />
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleEditAddress(address.id)}
              >
                <Ionicons name="create-outline" size={20} color={colors.primary} />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Button 
          title="Add a Delivery Address"
          variant="outline"
          onPress={handleAddAddress}
          style={styles.addButton}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Deliver to this Address"
          onPress={handleContinue}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -4,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionButtonText: {
    color: colors.primary,
    marginLeft: 4,
  },
  addButton: {
    marginTop: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.muted,
    backgroundColor: colors.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeliveryAddressScreen;
