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
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginUser, setUser } from '../../store/slices/authSlice';
import { api } from '../../api/api';
import { LoginPayload } from '../../types/auth/auth.types';
import { AppDispatch, RootState } from '../../store/store';
import { getIPAddress } from '../../utils/constant';

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    // Try to fetch the device public IP so backend can resolve org/institute details
    const userIp = (await getIPAddress(3000)) || '';

    const payload: LoginPayload = {
      CCode: '',
      UserName: email,
      Password: password,
      // match website which sent a full timestamp for AceYear
      AceYear: new Date().toISOString(),
      UserAccessAddress: userIp || '',
      UserType: 12,  // Always send UserType 12 (student) to trigger full profile population
    };

    try {
      console.log('Login payload:', payload);
      const result = await dispatch(LoginUser(payload)).unwrap();
      console.log('Login response:', result);
      // Persist token for future API calls
      try {
        const token = result?.IdToken ?? result?.ResponseData?.IdToken;
        if (token) {
          await AsyncStorage.setItem('IdToken', token);
        }
      } catch (e) {
        // ignore storage errors but log for debugging
        console.log('Failed to persist token:', e);
      }
      // Base returned user from login response
      const returnedUser = result?.UserData ?? result;

      // Always attempt supplemental fetch to get full profile (OrganizationName, InstituteName, Menu, etc.)
      // The backend may return incomplete data on first login; GetUserDetails with full context fills gaps.
      let mergedUser = returnedUser;
      try {
        const userId = returnedUser?.UserID || returnedUser?.UserId || null;
        if (userId) {
          console.log('Attempting supplemental profile fetch with full user context...');

          // Build a payload with full user context so backend returns complete profile
          const detailsPayload: any = {
            UserID: userId,
            CCode: returnedUser?.CCode || 0,
            UserName: returnedUser?.UserName || email,
            RoleId: returnedUser?.RoleId || 0,
          };

          console.log('GetUserDetails payload:', detailsPayload);
          const detailsResp = await api.post('/Account/GetUserDetails', detailsPayload);
          console.log('Supplemental profile response (raw):', detailsResp?.data);

          // Try several possible response shapes to find user details
          let details: any = null;
          const d = detailsResp?.data;
          if (!d) details = null;
          else if (d.ResponseData && d.ResponseData.UserData) details = d.ResponseData.UserData;
          else if (d.ResponseData && d.ResponseData.length && d.ResponseData[0]?.UserData) details = d.ResponseData[0].UserData;
          else if (d.UserData) details = d.UserData;
          else if (d.ResponseData) details = d.ResponseData; // sometimes ResponseData is the user object directly
          else details = d;

          if (details && (details.OrganizationName || details.InstituteName || details.Menu)) {
            // Merge supplemental details: fill in null fields from initial response
            const newUser = { ...(returnedUser || {}), ...(details || {}) };
            dispatch(setUser(newUser));
            mergedUser = newUser;
            console.log('Merged user after supplemental fetch:', mergedUser);
          } else {
            console.log('Supplemental fetch did not return organization/institute/menu data');
            // Still use the initial user data; some fields may remain null if backend doesn't populate them
          }
        }
      } catch (e) {
        console.log('Supplemental profile fetch failed (non-blocking):', e);
        // Continue with initial login response; don't block the user
      }

      // Determine role/user type from returned (possibly merged) data
      const roleId = mergedUser?.RoleId ?? mergedUser?.UserType ?? result?.UserType ?? user?.UserType;

      // Route by user type: 12 = student, anything else = faculty
      if (roleId === 12) {
        navigation.reset({ index: 0, routes: [{ name: 'StudentDashboard' }] });
      } else {
        // Route all non-12 users (faculty, admin, etc.) to faculty dashboard
        navigation.reset({ index: 0, routes: [{ name: 'FacultyDashboard' }] });
      }
    } catch (err: any) {
      // Show a clear error message when authentication fails
      console.log('Login error:', err);
      const msg =
        err && (typeof err === 'string')
          ? err
          : err?.message || error || 'Invalid credentials';
      setSnackbarMessage(msg as string);
      setSnackbarVisible(true);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated && user) {
      const userType = user.UserType;
      if (userType === 12) {
        navigation.reset({ index: 0, routes: [{ name: 'StudentDashboard' }] });
      } else {
        // Route all non-12 users to faculty dashboard
        navigation.reset({ index: 0, routes: [{ name: 'FacultyDashboard' }] });
      }
    }
  }, [isAuthenticated, user]);

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
          <IconButton
            icon="arrow-left"
            size={20}
            onPress={() => navigation.goBack()}
            mode="outlined"
            style={styles.backButton}
            iconColor="#1649b2"
          />
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Welcome back!</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email or Username</Text>
            <TextInput
              mode="outlined"
              placeholder="Enter your email or username"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (validationErrors.email) {
                  setValidationErrors((prev) => ({ ...prev, email: '' }));
                }
              }}
              editable={!loading}
              style={styles.input}
              outlineColor={validationErrors.email ? '#d32f2f' : '#ddd'}
              activeOutlineColor={validationErrors.email ? '#d32f2f' : '#1649b2'}
            />
            {validationErrors.email && (
              <HelperText type="error">{validationErrors.email}</HelperText>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              mode="outlined"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (validationErrors.password) {
                  setValidationErrors((prev) => ({ ...prev, password: '' }));
                }
              }}
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

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotPasswordLink}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            labelStyle={styles.loginButtonLabel}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={loading}
            >
              <Text style={styles.registerLink}>Register here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Error Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => {
          setSnackbarVisible(false);
          setSnackbarMessage(null);
        }}
        duration={4000}
        style={styles.snackbar}
      >
        {snackbarMessage || error || 'Login failed. Please try again.'}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef4ff' },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 30 },

  headerContainer: { marginBottom: 40, marginTop: 10 },
  backButton: { marginBottom: 20 },
  backButtonText: { fontSize: 16, color: '#1649b2', fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '700', color: '#08306b', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666' },

  formContainer: { marginBottom: 30 },

  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#08306b', marginBottom: 8 },
  input: { fontSize: 14 },

  forgotPasswordLink: { marginBottom: 20, alignSelf: 'flex-end' },
  forgotPasswordText: { color: '#1649b2', fontSize: 14, fontWeight: '600' },

  loginButton: {
    marginVertical: 12,
    paddingVertical: 6,
    backgroundColor: '#1649b2',
    borderRadius: 10,
  },
  loginButtonLabel: { fontSize: 16, fontWeight: '600' },

  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { fontSize: 14, color: '#666' },
  registerLink: { fontSize: 14, color: '#1649b2', fontWeight: '700', marginLeft: 4 },

  snackbar: { backgroundColor: '#d32f2f' },
});
