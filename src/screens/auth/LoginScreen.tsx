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
import { LoginUser, setUser } from '../../store/slices/auth/authSlice';
import { api } from '../../api/api';
import { LoginPayload } from '../../types/auth/auth.types';
import { AppDispatch, RootState } from '../../store/store';
import { getIPAddress, validateLogin, defaultLoginPayload } from '../../utils/constant';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [payload, setPayload] = useState<LoginPayload>(defaultLoginPayload());
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [instituteCode, setInstituteCode] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    UserName?: string;
    Password?: string;
    CCode?: string;
  }>({});

  // Smart detection: Faculty login if institute code is provided
  const isFacultyLogin = instituteCode.trim().length > 0;

  // Validation is centralized in utils/constant

  const handleLogin = async () => {
    // Validate using shared validator
    const { valid, errors } = validateLogin({ UserName: payload.UserName, Password: payload.Password });
    if (!valid) {
      setValidationErrors(errors as any);
      return;
    }

    // Validate Institute Code if faculty login is checked
    if (isFacultyLogin) {
      if (!instituteCode || instituteCode.trim() === '') {
        setValidationErrors((prev) => ({ ...prev, CCode: 'Institute Code is required' }));
        return;
      }
    }

    // Try to fetch the device public IP so backend can resolve org/institute details
    const userIp = (await getIPAddress(3000)) || '';

    // Build final payload object locally (don't rely on setState to sync)
    const finalPayload: LoginPayload = {
      ...payload,
      AceYear: new Date().toISOString(),
      UserAccessAddress: userIp || '',
      UserType: isFacultyLogin ? 3 : 12,
      ...(isFacultyLogin && { CCode: instituteCode.trim() }),
    };

    try {
      console.log('Login payload:', finalPayload);
      const result = await dispatch(LoginUser(finalPayload)).unwrap();
      console.log('Login response:', result);

      // The Redux thunk stores token and user in the auth slice. Use returned user or store state to route.
      const returnedUser = result?.ResponseData?.UserData ?? result?.UserData ?? result;
      const roleId = returnedUser?.RoleId ?? returnedUser?.UserType ?? result?.UserType ?? user?.UserType;

      if (roleId === 12) {
        navigation.reset({ index: 0, routes: [{ name: 'StudentNavigator' }] });
      } else {
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
        navigation.reset({ index: 0, routes: [{ name: 'StudentNavigator' }] });
      } else {
        // Route all non-12 users to faculty dashboard
        navigation.reset({ index: 0, routes: [{ name: 'FacultyDashboard' }] });
      }
    }
  }, [isAuthenticated, user]);

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
                value={payload.UserName}
                onChangeText={(text) => {
                  setPayload((p) => ({ ...p, UserName: text }));
                  if (validationErrors.UserName) {
                    setValidationErrors((prev) => ({ ...prev, UserName: '' }));
                  }
                }}
                editable={!loading}
                style={styles.input}
                outlineColor={validationErrors.UserName ? '#d32f2f' : '#ddd'}
                activeOutlineColor={validationErrors.UserName ? '#d32f2f' : '#1649b2'}
              />
              {validationErrors.UserName && (
                <HelperText type="error">{validationErrors.UserName}</HelperText>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                mode="outlined"
                placeholder="Enter your password"
                value={payload.Password}
                onChangeText={(text) => {
                  setPayload((p) => ({ ...p, Password: text }));
                  if (validationErrors.Password) {
                    setValidationErrors((prev) => ({ ...prev, Password: '' }));
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
                outlineColor={validationErrors.Password ? '#d32f2f' : '#ddd'}
                activeOutlineColor={validationErrors.Password ? '#d32f2f' : '#1649b2'}
              />
              {validationErrors.Password && (
                <HelperText type="error">{validationErrors.Password}</HelperText>
              )}
            </View>

            {/* Institute Code Input (Always visible with smart helper text) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Institute Code
                <Text style={styles.optionalLabel}> (Faculty only)</Text>
              </Text>
              <TextInput
                mode="outlined"
                placeholder="Leave empty for student login"
                value={instituteCode}
                onChangeText={(text) => {
                  setInstituteCode(text);
                  if (validationErrors.CCode) {
                    setValidationErrors((prev) => ({ ...prev, CCode: '' }));
                  }
                }}
                editable={!loading}
                style={styles.input}
                keyboardType="numeric"
                outlineColor={validationErrors.CCode ? '#d32f2f' : '#ddd'}
                activeOutlineColor={validationErrors.CCode ? '#d32f2f' : '#1649b2'}
              />

              {validationErrors.CCode && (
                <HelperText type="error">{validationErrors.CCode}</HelperText>
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
    </SafeAreaWrapper>
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

  optionalLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#999',
    fontStyle: 'italic',
  },
  helperInfo: {
    color: '#1649b2',
    fontWeight: '600',
  },

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
