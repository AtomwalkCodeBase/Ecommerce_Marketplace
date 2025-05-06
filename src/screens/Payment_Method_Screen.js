import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { colors } from '../Styles/appStyle';
import SectionTitle from '../components/SectionTitle';
import PaymentMethodCard from '../components/PaymentMethodCard';
import AddressCard from '../components/AddressCard';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAddresses, setSelectedAddress } from '../redux/slice/addressSlice';
import Header from '../components/Header';

// Mock data for demonstration
const paymentMethods = [
  {
    id: '1',
    type: 'netBanking',
    name: 'Net Banking',
  },
  {
    id: '2',
    type: 'creditCard',
    name: 'Add Credit Card or Debit Card',
  },
  {
    id: '3',
    type: 'cashOnDelivery',
    name: 'Cash on Delivery',
  },
];

const PaymentMethodScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const { addresses, selectedAddress, loading, error } = useSelector((state) => state.address);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (addresses.length > 0 && params.selectedAddress) {
      try {
        const parsedAddress = JSON.parse(params.selectedAddress);
        dispatch(setSelectedAddress(parsedAddress));
      } catch (e) {
        console.warn('Failed to parse selectedAddress:', e);
      }
    }
  }, [addresses, params.selectedAddress, dispatch]);

  const handleContinue = () => {
    router.push({
      pathname: 'OrderSummaryScreen',
      params: { selectedAddress: selectedAddress?.id, selectedPayment },
    });
  };

  const handleChangeAddress = () => {
    router.replace('DeliveryAddressScreen');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading addresses...</Text>
      </View>
    );
  }

  if (error || !selectedAddress) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {error || 'No address available. Please add an address.'}
        </Text>
        <Button
          title="Add Delivery Address"
          onPress={handleChangeAddress}
          style={styles.errorButton}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header isHomePage={false} title="Payment Method" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Delivering to Section */}
        <View style={styles.deliveringToContainer}>
          <SectionTitle title="Delivering to:" />
          <AddressCard
            address={selectedAddress}
            isSelected={true}
            onSelect={() => {}}
            showRadio={false}
          />
          <Button
            title="Change Delivery Address"
            variant="outline"
            onPress={handleChangeAddress}
            style={styles.changeAddressButton}
          />
        </View>

        {/* Choose Payment Method Section */}
        <View style={styles.paymentMethodsContainer}>
          <SectionTitle title="Choose Payment Method" />
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              isSelected={selectedPayment === method.id}
              onSelect={() => setSelectedPayment(method.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleContinue} />
      </View>
    </SafeAreaView>
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
  scrollContent: {
    paddingBottom: 32,
  },
  deliveringToContainer: {
    marginBottom: 20,
  },
  paymentMethodsContainer: {
    marginBottom: 24,
  },
  changeAddressButton: {
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
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: colors.textPrimary,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorButton: {
    marginTop: 8,
  },
});

export default PaymentMethodScreen;