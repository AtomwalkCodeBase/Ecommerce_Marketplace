import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import Header from "../components/Header";
import { useSelector, useDispatch } from "react-redux";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  clearCart,
} from "../redux/slice/CartSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native";

// Import color theme
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

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  // Calculate cart totals
  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.selling_price * item.quantity,
    0
  );
  const vat = 0;
  const shippingFee = 80;
  const total = subTotal + vat + shippingFee;

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const renderCartItem = (item) => (
    <View key={item.id} style={styles.cartItemContainer}>
      <View style={styles.itemLeft}>
        <Image
          style={styles.itemImage}
          source={{ uri: item.image }}
          // defaultSource={require('../assets/placeholder.png')} // Add a placeholder image
        />
      </View>

      <View style={styles.itemRight}>
        <View style={styles.itemRightUp}>
          <View style={styles.itemDetails}>
            <View>
              <Text style={styles.itemName}>{item.product_name}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => dispatch(removeFromCart(item.id))}
          >
            <Feather name="trash-2" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.itemRightDown}>
          <Text style={styles.itemPrice}>$ {item.selling_price.toLocaleString()}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => dispatch(decrementQuantity(item.id))}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>

            <View style={styles.quantityValueContainer}>
              <Text style={styles.quantityValue}>{item.quantity}</Text>
            </View>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => dispatch(incrementQuantity(item.id))}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header isHomePage={false} title="Cart"  />

      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <View style={styles.iconContainer}>
            <Feather name="shopping-cart" size={64} color={colors.primary} />
          </View>
          <Text style={styles.emptyCartTitle}>Your Cart Is Empty!</Text>
          <Text style={styles.emptyCartSubtitle}>
            When you add products, they'll appear here.
          </Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            // onPress={onBackPress}
          >
            <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Cart Items */}
            <View style={styles.cartItemsContainer}>
              {cartItems.map(renderCartItem)}
            </View>

            {/* Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sub-total</Text>
                <Text style={styles.summaryValue}>$ {subTotal.toLocaleString()}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>VAT (%)</Text>
                <Text style={styles.summaryValue}>$ {vat.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping fee</Text>
                <Text style={styles.summaryValue}>$ {shippingFee}</Text>
              </View>

              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>$ {total.toLocaleString()}</Text>
              </View>
            </View>
            
            {/* Add a little padding at the bottom to avoid being covered by the checkout button */}
            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={handleClearCart}
            >
              <Feather name="trash" size={18} color={colors.textOnPrimary} />
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.checkoutButton} 
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
              <Feather name="arrow-right" size={18} color={colors.textOnPrimary} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // cartItemsContainer: {
  //   paddingTop: 12,
  // },
  cartItemContainer: {
    flexDirection: "row",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderColor: colors.muted,
    borderWidth: 1,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemLeft: {
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: 100,
    height: 130,
    resizeMode: 'cover',
    borderRadius: 8,
    backgroundColor: colors.muted,
  },
  itemRight: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemRightUp: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemRightDown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  itemDetails: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  deleteButton: {
    padding: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  quantityValueContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  summaryContainer: {
    borderRadius: 12,
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderColor: colors.border,
    borderWidth: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  actionButtonsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clearButton: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  clearButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  checkoutButton: {
    flex: 3,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  checkoutButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 6,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 50,
    backgroundColor: colors.primaryTransparent,
  },
  emptyCartTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  continueShoppingButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  continueShoppingButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Cart;