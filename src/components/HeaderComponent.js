import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HeaderComponent = ({
  title,
  onLeftPress,
  leftIcon = 'arrow-back',
  backgroundColor = '#fff',
  textColor = '#000',
  showLeftIcon = true,
}) => {
  return (
    <SafeAreaView style={{ backgroundColor }}>
      <View style={[styles.container, { backgroundColor }]}>
        {showLeftIcon ? (
          <TouchableOpacity onPress={onLeftPress}>
            <Ionicons name={leftIcon} size={24} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}

        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>

        {/* Placeholder to balance layout */}
        <View style={{ width: 24 }} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    height: Platform.OS === 'ios' ? 60 : 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default HeaderComponent;
