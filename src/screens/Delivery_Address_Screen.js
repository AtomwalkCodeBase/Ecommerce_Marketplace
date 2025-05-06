import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../Styles/appStyle';
import AddressCard from '../components/AddressCard';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, setSelectedAddress } from '../redux/slice/addressSlice';
import Header from '../components/Header';

const DeliveryAddressScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { returnTo, selectedAddress: paramSelectedAddress } = useLocalSearchParams();
  const { addresses, selectedAddress, loading, error } = useSelector((state) => state.address);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (addresses.length === 0) return;

    if (paramSelectedAddress && !selectedAddress) {
      try {
        const parsedAddress = JSON.parse(paramSelectedAddress);
        const validAddress = addresses.find(addr => addr.id === parsedAddress.id);
        if (validAddress) {
          dispatch(setSelectedAddress(validAddress));
          setSelectedAddressId(validAddress.id);
          return;
        }
      } catch (e) {
        console.warn('Failed to parse selectedAddress:', e);
      }
    }

    if (selectedAddress && addresses.some(addr => addr.id === selectedAddress.id)) {
      setSelectedAddressId(selectedAddress.id);
    } else {
      const defaultAddr = addresses.find((addr) => addr.default) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
      dispatch(setSelectedAddress(defaultAddr));
    }
  }, [addresses, selectedAddress, paramSelectedAddress, dispatch]);

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id);
    dispatch(setSelectedAddress(address));
    const targetScreen = returnTo || 'PaymentMethodScreen';
    router.replace({
      pathname: targetScreen,
      params: { selectedAddress: JSON.stringify(address) },
    });
  };

  const handleAddAddress = () => {
    router.push({
      pathname: '/AddEditAddress',
      params: { returnTo },
    });
  };

  const renderActionButtons = (address) => (
    <View style={styles.actionContainer}>
      {address.default && <Text style={styles.defaultText}>Default</Text>}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => router.push({ pathname: '/AddEditAddress', params: { address: JSON.stringify(address), returnTo } })}
      >
        <Ionicons name="pencil" size={16} color={colors.primary} />
        <Text style={styles.actionButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAddress = ({ item }) => (
    <AddressCard
      address={item}
      isSelected={selectedAddressId === item.id}
      onSelect={() => handleSelectAddress(item)}
      showRadio={true}
      actionButtons={renderActionButtons(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header isHomePage={false} title="Delivery Address" />

      {/* Loading or Error */}
      {(loading || error) && (
        <View style={styles.statusContainer}>
          {loading && <ActivityIndicator size="large" color={colors.primary} />}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}

      {/* Add Button (always visible) */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddAddress}
        >
          <Ionicons name="add" size={20} color={colors.textOnPrimary} />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>
      </View>

      {/* Address List */}
      {!loading && !error && addresses.length > 0 && (
        <FlatList
          data={addresses}
          renderItem={renderAddress}
          keyExtractor={(item) => item.id}
          style={styles.addressList}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* No Addresses */}
      {!loading && !error && addresses.length === 0 && (
        <View style={styles.noAddressContainer}>
          <Ionicons name="location-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.noAddressText}>No Address available....</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  addButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addressList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  defaultText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 12,
  },
  statusContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    marginTop: 10,
    textAlign: 'center',
  },
  noAddressContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAddressText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  }
});

export default DeliveryAddressScreen;
