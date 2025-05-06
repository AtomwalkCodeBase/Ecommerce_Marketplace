import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../Styles/appStyle';

const AddressCard = ({ address, isSelected, onSelect, showRadio = true, actionButtons }) => {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onSelect}
    >
      <View style={[styles.addressContent, actionButtons && styles.addressContentWithButtons]}>
        <View style={styles.addressNameRow}>
          {showRadio && (
            <View style={styles.radio}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
          )}
          <Text style={styles.addressName}>{address.contact_name}</Text>
          <Text style={styles.addressPhone}>{address.mobile_number}</Text>
        </View>
        <Text style={[styles.addressLine, showRadio && styles.addressLineIndented]}>
          {address.address_line_1}
          {address.address_line_2 ? `, ${address.address_line_2}` : ''}
          {address.location ? `, ${address.location}` : ''} {address.pin_code}
        </Text>
      </View>
      {actionButtons && (
        <View style={styles.addressActions}>
          {actionButtons}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  addressContent: {
    flex: 1,
    marginBottom: 12,
  },
  addressContentWithButtons: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  addressNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
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
  addressLineIndented: {
    paddingLeft: 28,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default AddressCard;