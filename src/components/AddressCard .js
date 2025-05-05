import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../Styles/appStyle';

const AddressCard = ({ address, isSelected, onSelect }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, isSelected && styles.selectedCard]} 
      onPress={onSelect}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{address.contact_name}</Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        )}
      </View>
      {address.address_line_1 && <Text style={styles.address}>Address line 1:{address.address_line_1}</Text> }
      {address.address_line_2 && <Text style={styles.address}>Address line 2:{address.address_line_2}</Text> }
      {address.pin_code && <Text style={styles.address}>,{address.pin_code}</Text> }
      {address.place && <Text style={styles.address}>{address.place}</Text> }
      {address.country && <Text style={styles.address}>{address.country}</Text> }
      {address.mobile_number && <Text style={styles.phone}>{address.mobile_number}</Text> }
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});

export default AddressCard;
