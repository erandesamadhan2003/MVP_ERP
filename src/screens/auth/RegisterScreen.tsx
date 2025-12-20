import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Snackbar,
  HelperText,
  IconButton,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { AppDispatch } from '../../store/store';
import { LoginUser, setUser } from '../../store/slices/auth/authSlice';
import { Register as RegisterService } from '../../api/services/auth/authService';
import { StudentRegisterPayload, LoginPayload } from '../../types/auth/auth.types';
import { validateRegister, getIPAddress } from '../../utils/constant';

import SafeAreaWrapper from '../../components/SafeAreaWrapper';

export default function RegisterScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    email: '',
    confirmEmail: '',
    mobileNo: '',
    adharID: '',
    formNo: '',
    password: '',
    confirmPassword: '',
    // initial parameters as requested (kept for parity; registration service will pick relevant fields)
    AceYear: new Date().toISOString(),
    UserType: 12,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const { valid, errors } = validateRegister(formData as Record<string, any>);
    setValidationErrors(errors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Step 1: Register the user
      const payload: StudentRegisterPayload = {
        AdharID: formData.adharID,
        ConfirmPassword: formData.confirmPassword,
        FormNo: formData.formNo,
        MobileNo: formData.mobileNo,
        PasswordHash: formData.password,
        UserLogin: formData.email,
      };
      console.log('Register payload:', payload);
      const result = await RegisterService(payload);
      console.log('Register response:', result);

      // Stop the flow if registration failed and show the message from API
      if (!result || result?.ResponseCode !== 1) {
        const registrationError =
          result?.Message || 'Registration failed. Please try again.';
        setSnackbarMessage(registrationError);
        setSnackbarVisible(true);
        return;
      }

      // Prefer any registration identifier we get back as a temporary URN
      const registrationId =
        result?.ResponseData?.GenRegisterID ??
        result?.ResponseData?.RCNO ??
        result?.ResponseData?.RUserID ??
        null;
      
      // Step 2: Auto-login after successful registration
      const userIp = (await getIPAddress(3000)) || '';
      const loginPayload: LoginPayload = {
        UserName: formData.email,
        Password: formData.password,
        AceYear: new Date().toISOString(),
        UserAccessAddress: userIp || '',
        UserType: 12, // Student type
      };
      console.log('Login payload:', loginPayload);
      
      const loginResponse = await dispatch(LoginUser(loginPayload)).unwrap();
      console.log('Login response:', loginResponse);

      // Guard: if login payload missing user data, stop here
      if (!loginResponse?.UserData) {
        setSnackbarMessage('Login failed after registration. Please try again.');
        setSnackbarVisible(true);
        return;
      }

      // If backend login user does not yet contain URNNO, populate it from registration response
      if (
        registrationId &&
        (!loginResponse?.UserData?.URNNO || loginResponse.UserData.URNNO === 0)
      ) {
        dispatch(setUser({ URNNO: registrationId }));
      }
      console.log('Navigation: login successful, navigating to profile');
      
      // Step 3: Navigate directly to Student Profile screen
      // Reset to StudentNavigator, then navigate to Profile
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'StudentNavigator' }],
        })
      );
      // Navigate to Profile screen within StudentNavigator
      navigation.navigate('StudentNavigator', { screen: 'StudentProfile' });
      
    } catch (error: any) {
      const errorMessage = error?.response?.data?.Message 
        || error?.message 
        || error?.toString() 
        || 'Registration failed. Please try again.';
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <IconButton
            icon="arrow-left"
            size={20}
            onPress={() => navigation.goBack()}
            mode="outlined"
            style={styles.backButton}
            iconColor="#1649b2"
          />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the eCampus</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              mode="outlined"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              editable={!loading}
              style={styles.input}
              outlineColor={validationErrors.email ? '#d32f2f' : '#ddd'}
              activeOutlineColor={validationErrors.email ? '#d32f2f' : '#1649b2'}
            />
            {validationErrors.email && (
              <HelperText type="error">{validationErrors.email}</HelperText>
            )}
          </View>

          {/* Confirm Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Email</Text>
            <TextInput
              mode="outlined"
              placeholder="Re-enter your email"
              value={formData.confirmEmail}
              onChangeText={(value) => handleInputChange('confirmEmail', value)}
              editable={!loading}
              style={styles.input}
              outlineColor={validationErrors.confirmEmail ? '#d32f2f' : '#ddd'}
              activeOutlineColor={validationErrors.confirmEmail ? '#d32f2f' : '#1649b2'}
            />
            {validationErrors.confirmEmail && (
              <HelperText type="error">{validationErrors.confirmEmail}</HelperText>
            )}
          </View>

          {/* Mobile Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              mode="outlined"
              placeholder="10-digit mobile number"
              value={formData.mobileNo}
              onChangeText={(value) => handleInputChange('mobileNo', value.replace(/\D/g, '').slice(0, 10))}
              editable={!loading}
              keyboardType="phone-pad"
              style={styles.input}
              outlineColor={validationErrors.mobileNo ? '#d32f2f' : '#ddd'}
              activeOutlineColor={validationErrors.mobileNo ? '#d32f2f' : '#1649b2'}
            />
            {validationErrors.mobileNo && (
              <HelperText type="error">{validationErrors.mobileNo}</HelperText>
            )}
          </View>

          {/* Aadhar ID */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Aadhar ID</Text>
            <TextInput
              mode="outlined"
              placeholder="12-digit Aadhar number"
              value={formData.adharID}
              onChangeText={(value) => handleInputChange('adharID', value.replace(/\D/g, '').slice(0, 12))}
              editable={!loading}
              keyboardType="number-pad"
              style={styles.input}
              outlineColor={validationErrors.adharID ? '#d32f2f' : '#ddd'}
              activeOutlineColor={validationErrors.adharID ? '#d32f2f' : '#1649b2'}
            />
            {validationErrors.adharID && (
              <HelperText type="error">{validationErrors.adharID}</HelperText>
            )}
          </View>

          {/* Form Number
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Form Number</Text>
            <TextInput
              mode="outlined"
              placeholder="Your form number"
              value={formData.formNo}
              onChangeText={(value) => handleInputChange('formNo', value)}
              editable={!loading}
              style={styles.input}
              outlineColor={validationErrors.formNo ? '#d32f2f' : '#ddd'}
              activeOutlineColor={validationErrors.formNo ? '#d32f2f' : '#1649b2'}
            />
            {validationErrors.formNo && (
              <HelperText type="error">{validationErrors.formNo}</HelperText>
            )}
          </View> */}

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              mode="outlined"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={!showPassword}
              editable={!loading}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                />
              }
              outlineColor={validationErrors.password ? '#d32f2f' : '#ddd'}
              activeOutlineColor={validationErrors.password ? '#d32f2f' : '#1649b2'}
            />
            {validationErrors.password && (
              <HelperText type="error">{validationErrors.password}</HelperText>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              mode="outlined"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                />
              }
              outlineColor={validationErrors.confirmPassword ? '#d32f2f' : '#ddd'}
              activeOutlineColor={validationErrors.confirmPassword ? '#d32f2f' : '#1649b2'}
            />
            {validationErrors.confirmPassword && (
              <HelperText type="error">{validationErrors.confirmPassword}</HelperText>
            )}
          </View>

          {/* Register Button */}
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.registerButton}
            labelStyle={styles.registerButtonLabel}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Button>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef4ff' },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 30 },

  headerContainer: { marginBottom: 30, marginTop: 10 },
  backButton: { marginBottom: 12 },
  backButtonText: { fontSize: 16, color: '#1649b2', fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '700', color: '#08306b', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666' },

  formContainer: { marginBottom: 30 },

  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#08306b', marginBottom: 8 },
  input: { fontSize: 14 },

  registerButton: {
    marginVertical: 12,
    paddingVertical: 6,
    backgroundColor: '#1649b2',
    borderRadius: 10,
  },
  registerButtonLabel: { fontSize: 16, fontWeight: '600' },

  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { fontSize: 14, color: '#666' },
  loginLink: { fontSize: 14, color: '#1649b2', fontWeight: '700', marginLeft: 4 },

  snackbar: { backgroundColor: '#1649b2' },
});
