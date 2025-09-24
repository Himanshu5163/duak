import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator ';
import { getUser } from '../utils/storage';
import { login } from '../redux/authSlice';
import Footer from '../common/Footer';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const user = await getUser();
      if (user) dispatch(login(user));
    };
    // Wait for 10 seconds before proceeding
    setTimeout(() => {
      setLoading(false);
    }, 3000); // 10 seconds

    checkLogin();
  }, []);

  if (loading) return <SplashScreen />;

  

  return (
    <NavigationContainer>
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {!isLoggedIn ? (
      <>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      </>
    ) : (
      <Stack.Screen name="Main" component={DrawerNavigator} />
    )}
  </Stack.Navigator>
  {isLoggedIn && <Footer />}
</NavigationContainer>

  );
};

export default AppNavigator;
