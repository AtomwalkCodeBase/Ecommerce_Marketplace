import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchAddresses, 
  deleteExistingAddress,
  DefaultAddress,  
} from '../redux/slice/addressSlice';
import { colors } from '../Styles/appStyle';
import { useRouter } from 'expo-router';
import ConfirmationModal from '../components/ConfirmationModal';
import { SuccessModal, ErrorModal } from '../components/Modal';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddressManagementComponent = () => {
  const router = useRouter();
  const { addresses, selectedAddressId, loading } = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleDeleteAddress = (id) => {
    setAddressToDelete(id);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      dispatch(deleteExistingAddress(addressToDelete))
        .unwrap()
        .then(() => {
          dispatch(fetchAddresses());
          setModalVisible(false);
          setAddressToDelete(null);
        });
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      const address = addresses.find((addr) => addr.id === id);
      if (!address) throw new Error('Address not found');
      const addressData = {
        id: id,
        name: address.contact_name,
        mobile_number: address.mobile_number,
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2,
        location: address.location,
        pin_code: address.pin_code,
      };
      await dispatch(DefaultAddress(addressData)).unwrap();
      dispatch(fetchAddresses());
      setSuccessModalVisible(true);
    } catch (error) {
      console.log('Failed to set default address:', error);
      setErrorModalVisible(true);
    }
  };

  const defaultAddress = addresses.find((addr) => addr.default);
  const otherAddresses = addresses.filter((addr) => !addr.default);

  const renderAddress = ({ item }) => (
    <View style={styles.savedAddressCard}>
      <View style={styles.addressContent}>
        <View style={styles.addressNameRow}>
          <Text style={styles.addressName}>{item.contact_name}</Text>
          <Text style={styles.addressPhone}>{item.mobile_number}</Text>
        </View>
        
        <Text style={styles.addressLine}>
          {item.address_line_1}
          {item.address_line_2 ? `, ${item.address_line_2}` : ''},
          {item.location ? ` ${item.location},` : ''} {item.pin_code}
        </Text>
      </View>
      
      <View style={styles.addressActions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push({ pathname: '/AddEditAddress', params: { address: JSON.stringify(item) } })}
        >
          <Ionicons name="pencil" size={16} color={colors.primary} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDeleteAddress(item.id)}
          disabled={loading}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        
        {!item.default && (
          <TouchableOpacity 
            style={styles.setDefaultButton}
            onPress={() => setDefaultAddress(item.id)}
            disabled={loading}
          >
            <Ionicons name="star-outline" size={16} color={colors.primary} />
            <Text style={styles.setDefaultButtonText}>Set as Default</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderDefaultAddressSection = () => (
    <>
      <View style={styles.defaultAddressHeader}>
        <Text style={styles.sectionSubTitle}>Default Address</Text>
      </View>
      {defaultAddress ? (
        renderAddress({ item: defaultAddress })
      ) : (
        <View style={styles.noAddressContainer}>
          <Ionicons name="location-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.noAddressText}>No default address set</Text>
        </View>
      )}
      <View style={styles.otherAddressesHeader}>
        <Text style={styles.sectionSubTitle}>Other Addresses</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/AddEditAddress')}
        >
          <Ionicons name="add" size={20} color={colors.textOnPrimary} />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        scrollEnabled={true}
        data={otherAddresses}
        renderItem={renderAddress}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.addressList}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListHeaderComponent={renderDefaultAddressSection}
      />
      
      <ConfirmationModal
        visible={isModalVisible}
        onConfirm={confirmDelete}
        onCancel={() => {
          setModalVisible(false);
          setAddressToDelete(null);
        }}
        message="Are you sure you want to delete this address?"
        messageSize={16}
        confirmButtonColor={colors.error}
        cancelButtonColor={colors.textSecondary}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
      
      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        message="Default address updated successfully!"
      />
      <ErrorModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        message="Failed to update default address. Please try again."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  addButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addressList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  defaultAddressHeader: {
    paddingHorizontal: 0,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  otherAddressesHeader: {
    paddingHorizontal: 0,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
    marginTop: 16,
  },
  sectionSubTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  savedAddressCard: {
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
  addressContent: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  addressNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
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
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 16,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  setDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  setDefaultButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  noAddressContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAddressText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  }
});

export default AddressManagementComponent;