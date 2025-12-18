import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentScreen from '../screens/student/student';
import StudentProfile from '../screens/student/profile/StudentProfile';
import StudentCourseEnrollment from '../screens/student/enrollment/StudentCourseEnrollment';
import EnrollmentList from '../screens/student/enrollment/EnrollmentList';

const Stack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentDashboard" component={StudentScreen} />
      <Stack.Screen name="StudentProfile" component={StudentProfile} />
      <Stack.Screen name="StudentCourseEnrollment" component={StudentCourseEnrollment} />
      <Stack.Screen name="EnrollmentList" component={EnrollmentList} />
      {/* Add more student routes here as needed */}
    </Stack.Navigator>
  );
}
