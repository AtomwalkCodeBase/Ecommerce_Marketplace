import React, { useEffect, useRef } from 'react';
import { SafeAreaView, Text, StyleSheet, Animated, Easing } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const OrderConfirm = () => {
  const router = useRouter();
  
  // Animation refs
  const thumbsFade = useRef(new Animated.Value(0)).current;
  const thumbsScale = useRef(new Animated.Value(0.5)).current;
  const sparkleFade = useRef(new Animated.Value(0)).current;
  const sparkleScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Thumbs-up animation: fade in and scale up
    Animated.parallel([
      Animated.timing(thumbsFade, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(thumbsScale, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Sparkle animation: delayed fade in and scale up
    Animated.parallel([
      Animated.timing(sparkleFade, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(sparkleScale, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Home after 2.5 seconds
    const timeout = setTimeout(() => {
      router.push('/home');
    }, 2500);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.thumbsContainer,
          {
            opacity: thumbsFade,
            transform: [{ scale: thumbsScale }],
          },
        ]}
      >
        <FontAwesome name="thumbs-up" size={120} color="#4CAF50" />
      </Animated.View>
      <Text style={styles.message}>
        Your Order Has been Received
      </Text>
      <Animated.View
        style={[
          styles.sparkleContainer,
          {
            opacity: sparkleFade,
            transform: [{ scale: sparkleScale }],
          },
        ]}
      >
        <MaterialIcons name="stars" size={150} color="#FFD700" />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbsContainer: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderConfirm;