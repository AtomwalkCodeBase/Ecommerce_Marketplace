import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import OrderSummaryItem from '../components/OrderSummaryItem';
import SectionTitle from '../components/SectionTitle';
import { colors } from '../Styles/appStyle';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { setDefaultAddress, fetchAddresses, resetError } from '../redux/slice/addressSlice';
import { SuccessModal, ErrorModal } from '../components/Modal';

const OrderSummaryScreen = () => {
  const { selectedAddress, selectedPayment } = useLocalSearchParams();
  console.log("gibli", selectedAddress,"cwe", selectedPayment)
  const router = useRouter();
  const dispatch = useDispatch();
  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { addresses } = useSelector((state) => state.address);
  const address = addresses.find(addr => addr.isDefault) || (addresses.length > 0 ? addresses[0] : null);

  const cartItems = useSelector((state) => state.cart.cartItems);
  
  // Calculate cart totals
  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.selling_price * item.quantity,
    0
  );
  const vat = 0;
  const shippingFee = 80;
  const total = subTotal + vat + shippingFee;

  const handlePlaceOrder = () => {
    Alert.alert('Order placed successfully!');
    // router.push('/OrderConfirmation');
  };

  const handleChangeAddress = () => {
    router.push('/DeliveryAddress');
  };

  const handleChangePayment = () => {
    console.log("press change method")
  }

  const handleSetDefaultAddress = async () => {
    if (!address) {
      setErrorMessage('No address selected');
      setErrorVisible(true);
      return;
    }
    try {
      await dispatch(setDefaultAddress(address.id)).unwrap();
      setSuccessMessage('Address Successfully updated as Default Address');
      setSuccessVisible(true);
      dispatch(fetchAddresses()); // Refresh address list
    } catch (error) {
      setErrorMessage(error || 'Failed to set default address');
      setErrorVisible(true);
    }
  };

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
      <ScrollView style={styles.scrollView}>
        <SectionTitle title="Order Summary" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.itemName}>
                  {item.product_name} {item.quantity > 1 ? `(${item.quantity})` : ''}
                </Text>
                <Text style={styles.itemPrice}>
                  $ {(item.selling_price * item.quantity).toLocaleString()}
                </Text>
              </View>
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
          {/* <View style={styles.paymentInfo}>
            <Ionicons 
              name={paymentMethod.type === 'cashOnDelivery' ? 'cash-outline' : 'card-outline'} 
              size={24} 
              color={colors.primary} 
              style={styles.icon}
            />
            <Text style={styles.paymentText}>{paymentMethod.name}</Text>
          </View> */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <OrderSummaryItem label="Item Total" value={`$ ${subTotal.toLocaleString()}`} />
          <OrderSummaryItem label="VAT" value={`$ ${vat.toFixed(2)}`} />
          <OrderSummaryItem label="Delivery Charges" value={`$ ${shippingFee.toLocaleString()}`} />
          <OrderSummaryItem label="Total" value={`$ ${total.toLocaleString()}`} isTotal />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleChangeAddress}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
              {address && !address.isDefault && (
                <TouchableOpacity onPress={handleSetDefaultAddress} style={styles.defaultButton}>
                  <Text style={styles.defaultText}>Set as Default</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {address ? (
            <View style={styles.addressInfo}>
              <Text style={styles.addressName}>{address.contact_name}</Text>
              <Text style={styles.addressDetail}>{address.address_line_1}</Text>
              {address.address_line_2 && <Text style={styles.addressDetail}>{address.address_line_2}</Text>}
              <Text style={styles.addressDetail}>{address.pin_code}</Text>
              {address.place && <Text style={styles.addressDetail}>{address.place}</Text>}
              {address.country && <Text style={styles.addressDetail}>{address.country}</Text>}
              <Text style={styles.addressPhone}>{address.mobile_number}</Text>
            </View>
          ) : (
            <Text style={styles.noAddressText}>No address available</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Place Your Order" onPress={handlePlaceOrder} />
      </View>
    </View>
  );
};

export default OrderSummaryScreen;

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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  itemName: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  itemPrice: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  noItemsText: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingVertical: 8,
  },
  changeText: {
    color: colors.primary,
    fontWeight: '500',
    marginRight: 16,
  },
  defaultButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  defaultText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
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