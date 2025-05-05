import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Button from '../components/Button';
import { colors } from '../Styles/appStyle';
import SectionTitle from '../components/SectionTitle';
import PaymentMethodCard from '../components/PaymentMethodCard ';
import { useLocalSearchParams, useRouter } from 'expo-router';

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
    // lastFourDigits: '4567',
  },
  {
    id: '3',
    type: 'cashOnDelivery',
    name: 'Cash on Delivery',
  },
];

const PaymentMethodScreen = () => {
  const { selectedAddress } = useLocalSearchParams();
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);

  const handleContinue = () => {
	router.push({
		pathname: 'OrderSummaryScreen',
		params: { selectedAddress, selectedPayment },
	  });
  };

  const handleAddPayment = () => {
    // Handle add payment functionality
    console.log('Add new payment method');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <SectionTitle 
          title="Payment Method" 
          actionText="Add New"
          onAction={handleAddPayment}
        />
        
        {paymentMethods.map((method) => (
          <PaymentMethodCard 
            key={method.id}
            method={method}
            isSelected={selectedPayment === method.id}
            onSelect={() => setSelectedPayment(method.name)}
          />
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          title="Continue"
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.muted,
    backgroundColor: colors.white,
  },
});

export default PaymentMethodScreen;