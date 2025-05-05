import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../Styles/appStyle';

const PaymentMethodCard = ({ method, isSelected, onSelect }) => {
  const getIcon = () => {
    switch (method.type) {
      case 'netBanking':
        return 'business-outline';
      case 'creditCard':
        return 'card-outline';
      case 'debitCard':
        return 'card-outline';
      case 'cashOnDelivery':
        return 'cash-outline';
      default:
        return 'wallet-outline';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, isSelected && styles.selectedCard]} 
      onPress={() => onSelect(method.id)}
    >
      <View style={styles.row}>
        <View style={styles.radioButton}>
          {isSelected ? (
            <View style={styles.radioButtonSelected} />
          ) : null}
        </View>
        <Ionicons name={getIcon()} size={24} color={colors.primary} style={styles.icon} />
        <Text style={styles.methodName}>{method.name}</Text>
      </View>
      {/* {method.type === 'creditCard' || method.type === 'debitCard' ? (
        <Text style={styles.cardNumber}>
          •••• •••• •••• {method.lastFourDigits || ''}
        </Text>
      ) : null} */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primaryTransparent,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  icon: {
    marginRight: 10,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  cardNumber: {
    marginLeft: 44,
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default PaymentMethodCard;