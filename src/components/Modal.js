import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  Platform 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../Styles/appStyle';

const { width } = Dimensions.get('window');

/**
 * BaseModal component that provides the foundation for success and error modals
 */
const BaseModal = ({ visible, onClose, message, type }) => {
  // Animation value for fade-in effect
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  // Animation value for slide-up effect
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  // Configure modal styles based on type
  const isSuccess = type === 'success';
  const modalColor = isSuccess ? colors.success : colors.error;
  const iconName = isSuccess ? 'check-circle' : 'x-circle';
  const title = isSuccess ? 'Success' : 'Error';

  // Run animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      
      // Run parallel animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, slideAnim, onClose]);

  // Don't render anything if not visible
  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View 
          style={[
            styles.modalContent,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              borderLeftColor: modalColor,
              borderLeftWidth: 5,
            }
          ]}
        >
          <View style={styles.iconContainer}>
            <Feather name={iconName} size={28} color={modalColor} />
          </View>
          
          <View style={styles.messageContainer}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.messageText}>{message}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Feather name="x" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

/**
 * Success Modal Component
 */
export const SuccessModal = ({ visible, onClose, message }) => {
  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      message={message}
      type="success"
    />
  );
};

/**
 * Error Modal Component
 */
export const ErrorModal = ({ visible, onClose, message }) => {
  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      message={message}
      type="error"
    />
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 15,
  },
  messageContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  closeButton: {
    paddingHorizontal: 5,
  },
});

// Example usage in another component:
/*
import { SuccessModal, ErrorModal } from './path/to/Modals';

const MyComponent = () => {
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  
  const showSuccess = () => {
    setSuccessVisible(true);
  };
  
  const showError = () => {
    setErrorVisible(true);
  };
  
  return (
    <View>
      <TouchableOpacity onPress={showSuccess}>
        <Text>Show Success</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={showError}>
        <Text>Show Error</Text>
      </TouchableOpacity>
      
      <SuccessModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        message="Your changes have been saved successfully!"
      />
      
      <ErrorModal
        visible={errorVisible}
        onClose={() => setErrorVisible(false)}
        message="An error occurred. Please try again."
      />
    </View>
  );
};
*/