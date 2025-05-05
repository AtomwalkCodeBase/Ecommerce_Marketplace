import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { colors } from "../../src/Styles/appStyle";
import { StyleSheet, Text } from "react-native";
import { View } from "react-native";

const TabIcon = ({ focused, IconComponent, iconName, title }) => {
  if (focused) {
    return (
      <View
        style={styles.focusedContainer}
        // accessible
        accessibilityLabel={`${title} tab, selected`}
      >
        <IconComponent name={iconName} size={24} color={colors.primary} />
        <Text style={styles.focusedText}>{title}</Text>
      </View>
    );
  }
  return(
    <View
      style={styles.unfocusedContainer}
      // accessible
      accessibilityLabel={`${title} tab`}
    >
      <IconComponent name={iconName} size={22} color={colors.border} />
      <Text style={styles.unfocused}>{title}</Text>
    </View>
  )
}
  


const _layout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartCount = cartItems.length;
  return (
    <Tabs 
    screenOptions={{
      tabBarShowLabel: false,
      // headerShown: false,
      tabBarStyle: {
        height: 60,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderLeftWidth: 0.2,
        borderRightWidth: 0.2,
        paddingTop: 7,
      },
      tabBarItemStyle: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      },
      // tabBarStyle: styles.tabBar,
      // tabBarItemStyle: styles.tabBarItem,
      // tabBarActiveTintColor: colors.primary,
      // tabBarInactiveTintColor: colors.muted,
      // tabBarLabelStyle: { fontSize: 12 },
      // tabBarIconStyle: { display: "none" },
      // tabBarShowLabel: false,
      // tabBarHideOnKeyboard: true,
    }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              IconComponent={FontAwesome}
              iconName="home"
              title="Home"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              IconComponent={Feather}
              iconName="package"
              title="Orders"
            />
          ),
        }}
      />

        <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerShown: false,
          tabBarBadge: cartCount > 0 ? cartCount : null,
          // tabBarIcon: ({ color }) => (
          //   <Feather name="shopping-cart" size={24} color={color} />
          // ),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              IconComponent={Feather}
              iconName="shopping-cart"
              title="Cart"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
        //   tabBarIcon: ({ color }) => (
        //     <Ionicons name="people" size={24} color={color} />
        //   ),
        // }}
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              IconComponent={Ionicons}
              iconName="people"
              title="Profile"
            />
          ),
        }}
      />
      {/* <Tabs.Screen name='profile'/> */}
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0f0D23',
    borderRadius: 30,
    marginHorizontal: 15,
    marginBottom: 20,
    height: 52,
    position: 'absolute',
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#0f0D23',
  },
  tabBarItem: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedContainer: {
    // flexDirection: 'row',
    gap: 4,
    width: '100%',
    flex: 1,
    minWidth: 112,
    minHeight: 64,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    overflow: 'hidden',
  },
  focusedIcon: {
    width: 20,
    height: 20,
    tintColor: '#151312',
  },
  focusedText: {
    color: colors.primary || '#000', // Adjust based on your colors
    fontSize: 14,
    fontWeight: '600',
  },
  unfocusedContainer: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 999,
  },
  unfocusedIcon: {
    width: 20,
    height: 20,
    tintColor: '#A8B5Db',
  },
  unfocused: {
    color: colors.border || '#A8B5Db', // Adjust based on your colors
    fontSize: 12,
    fontWeight: '600',
  },
});