import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from 'react-native';

import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import DebugScreen from './src/screens/DebugScreen';
import StudentNavigator from './src/navigation/StudentNavigator';
import FacultyNavigator from './src/navigation/FacultyNavigator';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

const StudentLoginScreen = () => (
  <SafeAreaProvider>
    <StudentNavigator />
  </SafeAreaProvider>
);

const FacultyLoginScreen = () => (
  <SafeAreaProvider>
    <FacultyNavigator />
  </SafeAreaProvider>
);

const InstituteLoginScreen = () => (
  <SafeAreaProvider>
    <></>
  </SafeAreaProvider>
);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <Provider store={store}>
        <PaperProvider theme={MD3LightTheme}>
          <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="StudentDashboard" component={StudentNavigator} />
            <Stack.Screen name="FacultyDashboard" component={FacultyNavigator} />
            <Stack.Screen name="Debug" component={DebugScreen} options={{ headerShown: true }} />
          </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
