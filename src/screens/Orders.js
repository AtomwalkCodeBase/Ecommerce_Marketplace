import { View, Text } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import { usePathname } from 'expo-router';

const Orders = () => {
	 const pathname = usePathname(); // Get the current route
	  console.log(`Current route: ${pathname}`);
  return (
	<>
	<Header isHomePage={true} title={"Orders"} currentRoute={pathname}  />

	  <Text>Orders</Text>
	</>
  )
}

export default Orders