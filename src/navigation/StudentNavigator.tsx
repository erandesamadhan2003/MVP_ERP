import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentScreen from '../screens/student/student';
import StudentProfile from '../screens/student/StudentProfile';

const Stack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentDashboard" component={StudentScreen} />
      <Stack.Screen name="StudentProfile" component={StudentProfile} />
      {/* Add more student routes here as needed */}
    </Stack.Navigator>
  );
}
