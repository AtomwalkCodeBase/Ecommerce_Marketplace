import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../Styles/appStyle';

const OrderSummaryItem = ({ label, value, isTotal = false }) => {
	return (
	  <View style={[styles.row, isTotal ? styles.totalRow : null]}>
		<Text style={[styles.label, isTotal && styles.totalLabel]}>{label}</Text>
		<Text style={[styles.value, isTotal && styles.totalValue]}>{value}</Text>
	  </View>
	);
  };

  const styles = StyleSheet.create({
	row: {
	  flexDirection: 'row',
	  justifyContent: 'space-between',
	  paddingVertical: 8,
	  borderBottomWidth: 1,
	  borderBottomColor: colors.muted,
	},
	totalRow: {
	  borderBottomWidth: 0,
	},
	label: {
	  fontSize: 16,
	  color: colors.textSecondary,
	},
	value: {
	  fontSize: 16,
	  color: colors.textPrimary,
	  fontWeight: '500',
	},
	totalLabel: {
	  fontWeight: 'bold',
	  color: colors.textPrimary,
	  fontSize: 18,
	},
	totalValue: {
	  fontWeight: 'bold',
	  color: colors.primary,
	  fontSize: 18,
	},
  });

export default OrderSummaryItem;