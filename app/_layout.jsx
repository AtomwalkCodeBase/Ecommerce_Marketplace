import { Stack } from "expo-router";
import {AppProvider} from '../context/AppContext'
import { Provider } from "react-redux";
import { store } from "../src/redux/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
    <AppProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      <Stack.Screen name="AuthScreen/index"/> 
      <Stack.Screen name="PinScreen/index"/> 
      <Stack.Screen name="ResetPassword/index"/>
      <Stack.Screen name="ProductDetail/index"/>
      <Stack.Screen name="LocationScreen/index"/>
      <Stack.Screen name="SearchScreen/index"/>
      <Stack.Screen name="ProductListScreen/index"/>

    </Stack>
    </AppProvider>
    </Provider>
  );
}
