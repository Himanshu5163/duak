import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSetting } from '../redux/settingSlice';
import { Strings } from '../theme/Strings';
const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create pulsing animation for loading
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    // Main entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Start pulse animation
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const settings = useSelector(state => state.settings.settings || []);
  const dispatch = useDispatch();
  const API_URL = Strings.APP_BASE_URL || '';
  useEffect(() => {
    if (API_URL) {
      dispatch(fetchSetting({ API_URL }));
    }
  }, [API_URL, dispatch]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      <View style={styles.container}>
        {/* Animated Background Elements */}
        <View style={styles.backgroundPattern}>
          <View style={[styles.floatingShape, styles.shape1]} />
          <View style={[styles.floatingShape, styles.shape2]} />
          <View style={[styles.floatingShape, styles.shape3]} />
          <View style={[styles.floatingShape, styles.shape4]} />
          <View style={[styles.floatingShape, styles.shape5]} />
        </View>

        {/* Main Logo Container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
            },
          ]}
        >
          <View style={styles.outerRing}>
            <View style={styles.innerRing}>
              <View style={styles.centerIcon}>
                {/* School Building Icon */}
                 <Image
                  source={require('../theme/asserts/logo/duakLogo1.png')}
                  style={{ width: 100, height: 100, borderRadius:100 }}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* App Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* <Text style={styles.appTitle}>{settings?.name}</Text> */}
          <Text style={styles.appTitle}>Duak</Text>
          <Text style={styles.tagline}>Smart Energy Solution</Text>
          <View style={styles.roleContainer}>
            <View style={styles.roleItem}>
              <View style={[styles.roleDot, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.roleText}>Relationship Manager</Text>
            </View>
            <View style={styles.roleItem}>
              <View style={[styles.roleDot, { backgroundColor: '#4ECDC4' }]} />
              <Text style={styles.roleText}>Customer </Text>
            </View>
            {/* <View style={styles.roleItem}>
              <View style={[styles.roleDot, { backgroundColor: '#45B7D1' }]} />
              <Text style={styles.roleText}>Student</Text>
            </View> */}
          </View>
        </Animated.View>

        {/* Loading Section */}
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.loadingRing}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
          <Text style={styles.loadingText}>Initializing your workspace...</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        </Animated.View>

        {/* Bottom Brand Text */}
        <Animated.View
          style={[
            styles.brandContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {/* <Text style={styles.brandText}>Empowering Education Together</Text>
          <Text style={styles.versionText}>Version 2.0</Text> */}
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002c54', // Deep blue
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingShape: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.1,
  },
  shape1: {
    width: 80,
    height: 80,
    backgroundColor: '#FF6B6B',
    top: '10%',
    left: '10%',
  },
  shape2: {
    width: 60,
    height: 60,
    backgroundColor: '#4ECDC4',
    top: '20%',
    right: '15%',
  },
  shape3: {
    width: 40,
    height: 40,
    backgroundColor: '#45B7D1',
    bottom: '30%',
    left: '20%',
  },
  shape4: {
    width: 70,
    height: 70,
    backgroundColor: '#96CEB4',
    bottom: '20%',
    right: '10%',
  },
  shape5: {
    width: 50,
    height: 50,
    backgroundColor: '#FFEAA7',
    top: '50%',
    left: '5%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  outerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  innerRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    // backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  building: {
    width: 50,
    height: 50,
    position: 'relative',
  },
  buildingBase: {
    position: 'absolute',
    bottom: 0,
    left: 5,
    width: 40,
    height: 35,
    backgroundColor: '#3F51B5',
    borderRadius: 2,
  },
  buildingTop: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    width: 30,
    height: 15,
    backgroundColor: '#303F9F',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  flag: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    width: 2,
    height: 12,
    backgroundColor: '#FF5722',
  },
  door: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    width: 10,
    height: 15,
    backgroundColor: '#8BC34A',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  window: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#FFC107',
    borderRadius: 1,
  },
  window1: {
    bottom: 20,
    left: 10,
  },
  window2: {
    bottom: 20,
    right: 10,
  },
  window3: {
    bottom: 10,
    left: 10,
  },
  window4: {
    bottom: 10,
    right: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '300',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  roleText: {
    color: '#E8EAF6',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
  },
  loadingRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '400',
  },
  progressContainer: {
    width: 200,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  brandContainer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  brandText: {
    color: '#9FA8DA',
    fontSize: 14,
    fontWeight: '300',
    marginBottom: 5,
  },
  versionText: {
    color: '#7986CB',
    fontSize: 12,
    fontWeight: '200',
  },
});

export default SplashScreen;
