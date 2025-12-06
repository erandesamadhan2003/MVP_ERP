import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import StudentScreen from './src/screens/student/student';
import FacultyScreen from './src/screens/faculty/facutly';
import DebugScreen from './src/screens/DebugScreen';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

const StudentLoginScreen = () => (
  <SafeAreaProvider>
    <></>
  </SafeAreaProvider>
);

const FacultyLoginScreen = () => (
  <SafeAreaProvider>
    <></>
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
      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="StudentDashboard" component={StudentScreen} />
            <Stack.Screen name="FacultyDashboard" component={FacultyScreen} />
            <Stack.Screen name="Debug" component={DebugScreen} options={{ headerShown: true }} />
          </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
