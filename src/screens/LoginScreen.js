import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { storeUser } from '../utils/storage';
import { Strings } from '../theme/Strings';
import { fetchSetting } from '../redux/settingSlice';
import { useNavigation } from '@react-navigation/native'

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('6');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const settings = useSelector(state => state.settings.settings || []);
  const dispatch = useDispatch();
  const API_URL = Strings.APP_BASE_URL || '';
  useEffect(() => {
    if (API_URL) {
      dispatch(fetchSetting({ API_URL }));
    }
  }, [API_URL, dispatch]);

  const navigation = useNavigation(); // initialize navigation

  const validateForm = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = 'username is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  //Alert.alert('settings:', JSON.stringify(settings, null, 2));
  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const formData = {
      username: username, // Your backend expects "username", not "userName"
      password: password,
      role_id: selectedRole,
    };

    try {
      const response = await fetch(`${Strings.APP_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const resp = await response.json();

     if (resp?.status === true) {
        console.log('Login Successful:', JSON.stringify(resp.user, null, 2));
        console.log('token Successful:', resp.access_token);
        
        // save user and token
        await storeUser(resp.user, resp.access_token);

        dispatch(login(resp.user)); // Redux login
        Alert.alert('Login', resp.message || 'Login successful');
      }else {
        console.warn('Login Failed:', resp?.message);
        Alert.alert('Login Failed', resp?.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login Error:', error.message);
      Alert.alert('Login Error', error.message || 'Something went wrong');
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4c669f" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Background */}
          <View style={styles.backgroundContainer}>
            {/* Decorative circles */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            <View style={styles.circle3} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                {/* <Image
                  source={{ uri: settings?.logo }}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                /> */}
                <Image
                    source={require('../theme/asserts/logo/duakLogo1.png')}
                    style={{ width: 100, height: 100, borderRadius:100 }}
                />
              </View>
              {/* <Text style={styles.welcomeTitle}>{settings?.name}</Text> */}
              <Text style={styles.welcomeTitle}>Duak</Text>
              <Text style={styles.welcomeSubtitle}>
                Sign in to continue to your account
              </Text>
            </View>

            <View style={styles.roleViewButton} >
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        selectedRole === '5' && styles.activeRoleButton,
                      ]}
                      onPress={() => setSelectedRole('5')}
                    >
                      <Text
                        style={[
                          styles.roleButtonText,
                          selectedRole === '5' && styles.activeRoleButtonText,
                        ]}
                      >
                        Relationship Manager
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        selectedRole === '6' && styles.activeRoleButton,
                      ]}
                      onPress={() => setSelectedRole('6')}
                    >
                      <Text
                        style={[
                          styles.roleButtonText,
                          selectedRole === '6' && styles.activeRoleButtonText,
                        ]}
                      >
                        User
                      </Text>
                    </TouchableOpacity>
                  </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.username && styles.inputError,
                  ]}
                >
                  <Image
                    source={require('../theme/asserts/icon/profile.png')} // optional fallback icon
                    style={{ width: 24, height: 24, marginRight: 12 }}
                    resizeMode="contain"
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="username "
                    placeholderTextColor="#FFFFFF"
                    value={username}
                    onChangeText={setUserName}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
                {errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.password && styles.inputError,
                  ]}
                >
                  <Image
                    source={require('../theme/asserts/icon/password.png')} // optional fallback icon
                    style={{ width: 24, height: 24, marginRight: 12 }}
                    resizeMode="contain"
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor="#FFFFFF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeIcon}>
                      {showPassword ? '👁' : '👁‍🗨'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              {/* Forgot Password */}
              {/* <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity> */}

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <View style={styles.loginButtonContent}>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={styles.loginButtonText}>Signing in...</Text>
                    </View>
                  ) : (
                    <View style={styles.loginButtonTextContainer}>
                      <Text style={styles.loginButtonText}>Sign In</Text>
                      <Text style={styles.arrowIcon}>→</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {/* Divider */}
              {/* <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View> */}

              {/* Social Login Buttons */}
              {/* <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialIcon}>G</Text>
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialIcon}>f</Text>
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>
              </View> */}

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                  <Text style={styles.signupLink} >Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002c54',
    // backgroundColor: '#4c669f',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#002c54',
  },
  circle1: {
    position: 'absolute',
    top: 50,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle2: {
    position: 'absolute',
    top: 200,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  circle3: {
    position: 'absolute',
    bottom: 150,
    left: width * 0.2,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    minHeight: height,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: '#fd7e14',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoInner: {
    width: 32,
    height: 32,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    opacity: 0.9,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderColor: '#fd7e14',
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    height: '100%',
  },
  eyeButton: {
    padding: 8,
  },
  eyeIcon: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  errorText: {
    color: '#fd7e14',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  loginButton: {
    marginBottom: 32,
    borderRadius: 16,
    backgroundColor: '#fd7e14',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonContent: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  arrowIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 8,
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  socialButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
  },
  signupLink: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '600',
  },
  roleViewButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    borderRadius: 50,
    marginBottom: 10,
    height: 50,
    marginHorizontal:'auto'
  },
  roleButton: {
    height: 40,
    borderRadius: 50,
    width: '38%',
  },
  roleButtonText: {
    color: '#203857',
    textAlign: 'center',
    alignSelf: 'center',
    margin: 'auto',
  },

  activeRoleButton: {
    backgroundColor: '#203857',
  },
  activeRoleButtonText: {
    color: '#FFFFFF',
  },
});

export default LoginScreen;
