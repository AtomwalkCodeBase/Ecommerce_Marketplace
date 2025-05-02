import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import LocationScreen from '../../src/screens/LocationScreen';
import { colors } from '../../src/Styles/appStyle';

const index = () => {
    return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <LocationScreen />
    </SafeAreaView>
  );
}

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});