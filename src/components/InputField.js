import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

// Color theme (consistent with AddressManagementComponent)
const colors = {
  textPrimary: '#000000',
  textSecondary: '#777E90',
  border: '#9B9B9A',
  white: '#FFFFFF',
};

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = colors.textSecondary,
  keyboardType = 'default',
  style,
  containerStyle,
}) => {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
});

export default InputField;