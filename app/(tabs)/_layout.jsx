import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { colors } from "../../src/Styles/appStyle";
import { StyleSheet, Text } from "react-native";
import { View } from "react-native";


// const TabIcon = ({ focused, IconComponent, iconName, title }) => {
//   if (focused) {
//     return (
//       <View
//         // source={highlightImage}
//         style={styles.focusedContainer}
//         accessible
//         accessibilityLabel={`${title} tab, selected`}
//       >
//         <IconComponent name={iconName} size={20} color={colors.primary} />
//         <Text style={styles.focusedText}>{title}</Text>
//       </View>
//     );
//   }
//   return (
//     <View
//       style={styles.unfocusedContainer}
//       accessible
//       accessibilityLabel={`${title} tab`}
//     >
//       <IconComponent name={iconName} size={20} color="wh" />
//     </View>
//   );
// };


const _layout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartCount = cartItems.length;
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          // tabBarIcon: ({ focused }) => (
          //   <TabIcon
          //     focused={focused}
          //     IconComponent={FontAwesome}
          //     iconName="home"
          //     title="Home"
          //   />
          // ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="package" size={24} color={color} />
          ),
        }}
      />
{/* 
      <Tabs.Screen
        name="category"
        options={{
          title: "Category",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="category" size={24} color="black" />
          ),
        }}
      /> */}

        <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerShown: false,
          tabBarBadge: cartCount > 0 ? cartCount : null,
          tabBarIcon: ({ color }) => (
            <Feather name="shopping-cart" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
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
    flexDirection: 'row',
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
    color: colors.secondary || '#000', // Adjust based on your colors
    fontSize: 16,
    fontWeight: '600',
  },
  unfocusedContainer: {
    width: '100%',
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
});