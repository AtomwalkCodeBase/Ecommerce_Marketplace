import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import AddressManagementSection from '../screens/AddressManagementSection';
import { colors } from '../Styles/appStyle';
import Header from '../components/Header';


export default function LocationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Header isHomePage={false} title={"Your Addresses"} />
      
      <View style={styles.content}>
        <AddressManagementSection />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
});