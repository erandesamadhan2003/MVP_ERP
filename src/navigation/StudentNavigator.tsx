import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentScreen from '../screens/student/student';
import StudentProfile from '../screens/student/profile/StudentProfile';
import StudentCourseEnrollment from '../screens/student/enrollment/StudentCourseEnrollment';
import EnrollmentList from '../screens/student/enrollment/EnrollmentList';
import ExamForm from '../screens/student/examination/ExamForm';

const Stack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={StudentScreen} />
      <Stack.Screen name="StudentProfile" component={StudentProfile} />
      <Stack.Screen name="StudentCourseEnrollment" component={StudentCourseEnrollment} />
      <Stack.Screen name="EnrollmentList" component={EnrollmentList} />
      <Stack.Screen name="ExamForm" component={ExamForm} />
      {/* Add more student routes here as needed */}
    </Stack.Navigator>
  );
}
