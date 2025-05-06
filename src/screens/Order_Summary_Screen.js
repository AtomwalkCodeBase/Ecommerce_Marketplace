import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import OrderSummaryItem from '../components/OrderSummaryItem';
import SectionTitle from '../components/SectionTitle';
import OrderConfirm from '../components/OrderConfirm';
import { colors } from '../Styles/appStyle';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/slice/CartSlice';
import { placeOrder } from '../services/productServices';
import Header from '../components/Header';

// Mapping of payment method IDs to display names and API values
const paymentMethods = {
  '1': { display: 'Net Banking', api: 'net_banking' },
  '2': { display: 'Credit/Debit Card', api: 'card' },
  '3': { display: 'Cash on Delivery', api: 'cash' },
};

const OrderSummaryScreen = () => {
  const { selectedPayment } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedAddress } = useSelector((state) => state.address);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);

  // Calculate cart totals
  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.selling_price * item.quantity,
    0
  );
  const vat = 0;
  const shippingFee = 80;
  const total = subTotal + vat + shippingFee;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      console.log('Error: Cart is empty');
      return;
    }
    if (!selectedAddress) {
      console.log('Error: Please select a shipping address');
      return;
    }
    if (!selectedPayment || !paymentMethods[selectedPayment]) {
      console.log('Error: Please select a payment method');
      return;
    }

    const orderData = {
      cart: cartItems,
      total_price: total,
      shipping_address: selectedAddress,
      payment_method: paymentMethods[selectedPayment].api,
    };

    try {
      console.log('Placing order with data:', orderData);
      const response = await placeOrder(orderData);
      dispatch(clearCart());
      setShowOrderConfirm(true);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to place order';
      console.log('Place Order Error:', { error, message: errorMessage });
    }
  };

  const handleChangeAddress = () => {
    router.push({
      pathname: '/DeliveryAddressScreen',
      params: { returnTo: 'OrderSummaryScreen' },
    });
  };

  const handleChangePayment = () => {
    router.push({
      pathname: '/PaymentMethodScreen',
      params: {
        returnTo: 'OrderSummaryScreen',
        selectedAddress: JSON.stringify(selectedAddress),
      },
    });
  };

  if (showOrderConfirm) {
    return <OrderConfirm />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header isHomePage={false} title="Order Summary" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <OrderSummaryItem
                key={item.id}
                label={`${item.product_name} ${item.quantity > 1 ? `(${item.quantity})` : ''}`}
                value={`₹ ${(item.selling_price * item.quantity).toLocaleString()}`}
              />
            ))
          ) : (
            <Text style={styles.noItemsText}>No items in cart</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity onPress={handleChangePayment}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.paymentMethodText}>
            {paymentMethods[selectedPayment]?.display || 'Not selected'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <OrderSummaryItem label="Item Total" value={`₹ ${subTotal.toLocaleString()}`} />
          <OrderSummaryItem label="VAT" value={`₹ ${vat.toFixed(2)}`} />
          <OrderSummaryItem label="Delivery Charges" value={`₹ ${shippingFee.toLocaleString()}`} />
          <OrderSummaryItem label="Total" value={`₹ ${total.toLocaleString()}`} isTotal />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleChangeAddress}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
          {selectedAddress ? (
            <View style={styles.addressInfo}>
              <Text style={styles.addressName}>{selectedAddress.contact_name}</Text>
              <Text style={styles.addressDetail}>{selectedAddress.address_line_1}</Text>
              {selectedAddress.address_line_2 && (
                <Text style={styles.addressDetail}>{selectedAddress.address_line_2}</Text>
              )}
              <Text style={styles.addressDetail}>{selectedAddress.pin_code}</Text>
              {selectedAddress.place && (
                <Text style={styles.addressDetail}>{selectedAddress.place}</Text>
              )}
              {selectedAddress.country && (
                <Text style={styles.addressDetail}>{selectedAddress.country}</Text>
              )}
              <Text style={styles.addressPhone}>{selectedAddress.mobile_number}</Text>
            </View>
          ) : (
            <Text style={styles.noAddressText}>No address available</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Place Your Order" onPress={handlePlaceOrder} />
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
  section: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.muted,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  noItemsText: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingVertical: 8,
  },
  paymentMethodText: {
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 8,
  },
  changeText: {
    color: colors.primary,
    fontWeight: '500',
    marginRight: 16,
  },
  addressInfo: {
    paddingVertical: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  noAddressText: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingVertical: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.muted,
    backgroundColor: colors.white,
  },
});

export default OrderSummaryScreen;