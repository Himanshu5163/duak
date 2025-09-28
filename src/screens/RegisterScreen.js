import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
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
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [dealerUniqueId, setDealerUniqueId] = useState(''); // ✅ Dealer Unique Id state
  const [selectedRole, setSelectedRole] = useState('6');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const settings = useSelector(state => state.settings.settings || []);
  const dispatch = useDispatch();
  const API_URL = Strings.APP_BASE_URL || '';
  const navigation = useNavigation();

  useEffect(() => {
    if (API_URL) {
      dispatch(fetchSetting({ API_URL }));
    }
  }, [API_URL, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!name) newErrors.name = 'Name is required';
    if (!mobile) newErrors.mobile = 'Mobile is required';
    if (!dealerUniqueId) newErrors.dealerUniqueId = 'Dealer Unique Id is required'; // ✅ validation
    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const formData = {
      name,
      mobile,
      dealer_unique_id: dealerUniqueId, // ✅ added in payload
      password,
      role_id: selectedRole,
    };

    try {
      const url = `${Strings.APP_BASE_URL}/register`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const resp = await response.json();

      if (resp?.status === true) {
        await storeUser(resp.user, resp.access_token);
        dispatch(login(resp.user));
        // navigation.navigate('Login');
      } else if (response.status === 422) {

        
        if (resp.errors && typeof resp.errors === 'object') {
          const backendErrors = {};
          Object.keys(resp.errors).forEach(key => {
            backendErrors[key] = resp.errors[key][0];

           
          });
           console.log('Validation error:',backendErrors);
          setErrors(backendErrors);
        }
      } else if (response.status === 403) {
        setErrors({ form: resp.message || 'Only clients can register' });
      } else {
        setErrors({ form: resp.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ form: error.message || 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
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
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            <View style={styles.circle3} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                <Image
                  source={require('../theme/asserts/logo/duakLogo1.png')}
                  style={{ width: 100, height: 100, borderRadius: 100 }}
                />
              </View>
              <Text style={styles.welcomeTitle}>Duak</Text>
              <Text style={styles.welcomeSubtitle}>
                Sign up to continue to your account
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.name && styles.inputError,
                  ]}
                >
                  <Image
                    source={require('../theme/asserts/icon/profile.png')}
                    style={{ width: 24, height: 24, marginRight: 12 }}
                    resizeMode="contain"
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Name"
                    placeholderTextColor="#FFFFFF"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* Mobile Input */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.mobile && styles.inputError,
                  ]}
                >
                  <Image
                    source={require('../theme/asserts/icon/phone-call.png')}
                    style={{ width: 24, height: 24, marginRight: 12 }}
                    resizeMode="contain"
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Mobile"
                    placeholderTextColor="#FFFFFF"
                    value={mobile}
                    onChangeText={text => {
                      const numericText = text.replace(/[^0-9]/g, '');
                      setMobile(numericText);
                    }}
                    keyboardType="number-pad"
                    maxLength={10}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                  />
                </View>
                {errors.mobile && (
                  <Text style={styles.errorText}>{errors.mobile}</Text>
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
                    source={require('../theme/asserts/icon/password.png')}
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
                {/* Dealer Unique Id Input */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.dealerUniqueId && styles.inputError,
                  ]}
                >
                  <Image
                    source={require('../theme/asserts/icon/dealer.png')}
                    style={{ width: 24, height: 24, marginRight: 12 }}
                    resizeMode="contain"
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Dealer Unique Id"
                    placeholderTextColor="#FFFFFF"
                    value={dealerUniqueId}
                    onChangeText={setDealerUniqueId}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
                {errors.dealerUniqueId && (
                  <Text style={styles.errorText}>{errors.dealerUniqueId}</Text>
                )}
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <View style={styles.loginButtonContent}>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={styles.loginButtonText}>Signing up...</Text>
                    </View>
                  ) : (
                    <View style={styles.loginButtonTextContainer}>
                      <Text style={styles.loginButtonText}>Sign Up</Text>
                      <Text style={styles.arrowIcon}>→</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {/* Login Redirect */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.signupLink}>Login</Text>
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
  container: { flex: 1, backgroundColor: '#002c54' },
  keyboardAvoidingView: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  backgroundContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#002c54',
  },
  circle1: {
    position: 'absolute',
    top: 50, left: -50,
    width: 150, height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle2: {
    position: 'absolute',
    top: 200, right: -30,
    width: 100, height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  circle3: {
    position: 'absolute',
    bottom: 150, left: width * 0.2,
    width: 120, height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    minHeight: height,
  },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logoBox: {
    width: 80, height: 80,
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
  formContainer: { width: '100%' },
  inputContainer: { marginBottom: 20 },
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
  inputError: { borderColor: '#fd7e14' },
  textInput: { flex: 1, fontSize: 16, color: '#ffffff', height: '100%' },
  eyeButton: { padding: 8 },
  eyeIcon: { fontSize: 18, color: 'rgba(255, 255, 255, 0.7)' },
  errorText: {
    color: '#fd7e14',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
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
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonContent: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonTextContainer: { flexDirection: 'row', alignItems: 'center' },
  loginButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '600', marginRight: 8 },
  arrowIcon: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupText: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 16 },
  signupLink: { color: '#ff6b6b', fontSize: 16, fontWeight: '600' },
});

export default RegisterScreen;
