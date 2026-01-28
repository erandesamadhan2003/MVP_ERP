import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FacultyDashboard from '../screens/faculty/FacultyDashboard';
import TimeTable from '../screens/faculty/eLearning/timetable/TimeTable';
import Attendance from '../screens/faculty/eLearning/timetable/Attendance';

const Stack = createNativeStackNavigator();

export default function FacultyNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FacultyDashboard" component={FacultyDashboard} />
      <Stack.Screen name="TimeTable" component={TimeTable} />
      <Stack.Screen name="Attendance" component={Attendance} />
      {/* Add more faculty routes here as needed */}
    </Stack.Navigator>
  );
}
