import { Stack } from "expo-router";
import {AppProvider} from '../context/AppContext'
import { Provider } from "react-redux";
import { store } from "../src/redux/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
    <AppProvider>
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      <Stack.Screen name="AuthScreen/index" options={{headerShown:false}}/> 
      <Stack.Screen name="PinScreen/index" options={{headerShown:false}}/> 
      <Stack.Screen name="ResetPassword/index" options={{headerShown:false}}/>
      <Stack.Screen name="ProductDetail/index" options={{headerShown:false}}/>
      <Stack.Screen name="LocationScreen/index" options={{headerShown:false}}/>
      <Stack.Screen name="ProductListScreen/index" options={{headerShown:false}}/>

    </Stack>
    </AppProvider>
    </Provider>
  );
}
