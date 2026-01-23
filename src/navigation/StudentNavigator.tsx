import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentScreen from '../screens/student/student';
import StudentProfile from '../screens/student/profile/StudentProfile';
import StudentCourseEnrollment from '../screens/student/enrollment/StudentCourseEnrollment';
import EnrollmentList from '../screens/student/enrollment/EnrollmentList';
import ExamForm from '../screens/student/examination/ExamForm';
import ReadingAttendance from '../screens/student/library/ReadingAttendance';
import LibraryClearance from '../screens/student/library/LibraryClearance';
import PdfViewer from '../components/common/PdfViewer';
import Dues from '../screens/student/payment/Dues';
import Confirmation from '../screens/student/payment/Confirmation';
import PaymentWebView from '../screens/student/payment/PaymentWebView';
import PaymentResult from '../screens/student/payment/PaymentResult';
import PdfWebView from '../components/common/PdfWebView';

const Stack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={StudentScreen} />
      <Stack.Screen name="StudentProfile" component={StudentProfile} />
      <Stack.Screen name="StudentCourseEnrollment" component={StudentCourseEnrollment} />
      <Stack.Screen name="EnrollmentList" component={EnrollmentList} />
      <Stack.Screen name="ExamForm" component={ExamForm} />
      <Stack.Screen name="ReadingAttendance" component={ReadingAttendance} />
      <Stack.Screen name="LibraryClearance" component={LibraryClearance} />
      <Stack.Screen name="DuesPayment" component={Dues} />
      <Stack.Screen name="PaymentConfirmation" component={Confirmation} />
      <Stack.Screen name="PaymentWebView" component={PaymentWebView} options={{headerShown: false}} />
      <Stack.Screen name="PaymentResult" component={PaymentResult} options={{headerShown: false}}/>
      <Stack.Screen name="PdfWebView" component={PdfWebView} options={{headerShown: false}} />

      <Stack.Screen name="PdfViewer" component={PdfViewer} options={{headerShown: false}} />
      {/* Add more student routes here as needed */}
    </Stack.Navigator>
  );
}
