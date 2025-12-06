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
} from 'react-native-paper';
import { Register as RegisterService } from '../../api/services/auth/authService';
import { StudentRegisterPayload } from '../../types/auth/auth.types';

export default function RegisterScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    mobileNo: '',
    adharID: '',
    formNo: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.userName.trim()) {
      errors.userName = 'Username is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email';
    }

    if (!formData.mobileNo.trim()) {
      errors.mobileNo = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNo.replace(/\D/g, ''))) {
      errors.mobileNo = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.adharID.trim()) {
      errors.adharID = 'Aadhar ID is required';
    } else if (!/^\d{12}$/.test(formData.adharID.replace(/\D/g, ''))) {
      errors.adharID = 'Enter a valid 12-digit Aadhar ID';
    }

    if (!formData.formNo.trim()) {
      errors.formNo = 'Form number is required';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload: StudentRegisterPayload = {
        AdharID: formData.adharID,
        ConfirmPassword: formData.confirmPassword,
        FormNo: formData.formNo,
        MobileNo: formData.mobileNo,
        PasswordHash: formData.password,
        UserLogin: formData.userName,
      };
      const result = await RegisterService(payload);
      // Try to read message from backend
      const msg = result?.Message || 'Registration successful! Please login.';
      setSnackbarMessage(msg);
      setSnackbarVisible(true);
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } catch (error: any) {
      setSnackbarMessage(error?.message || 'Registration failed. Please try again.');
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
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the eCampus</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              mode="outlined"
              placeholder="Choose a username"
              value={formData.userName}
              onChangeText={(value) => handleInputChange('userName', value)}
              editable={!loading}
              style={styles.input}
              outlineColor={validationErrors.userName ? '#d32f2f' : '#ddd'}
              activeOutlineColor={validationErrors.userName ? '#d32f2f' : '#1649b2'}
            />
            {validationErrors.userName && (
              <HelperText type="error">{validationErrors.userName}</HelperText>
            )}
          </View>

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

          {/* Form Number */}
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
          </View>

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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef4ff' },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 30 },

  headerContainer: { marginBottom: 30, marginTop: 10 },
  backButton: { marginBottom: 20 },
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
