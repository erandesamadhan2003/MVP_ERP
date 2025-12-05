import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";

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
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            {/* <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
            <Stack.Screen name="FacultyLogin" component={FacultyLoginScreen} />
            <Stack.Screen name="InstituteLogin" component={InstituteLoginScreen} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
