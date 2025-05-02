// styles/ButtonStyles.js
import { StyleSheet } from 'react-native';
import { colors } from './appStyle';

export const buttonStyles = StyleSheet.create({
  primary: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondary: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryText: {
    color: colors.textOnPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
