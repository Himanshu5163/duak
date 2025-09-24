import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { useSelector } from 'react-redux';

const Footer = () => {
  const { themeColor } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useSelector(state => state.auth);
  const items = [
    { label: 'Home', icon: 'home', screen: 'dashboard' },
    {
      label: 'Attendance',
      icon: 'appointment',
      screen: 'Attendance',
    },
    {
      label: 'Notice Board',
      icon: 'history',
      screen: 'NoticeBoard',
    },
    { label: 'Profile View', icon: 'profile', screen: 'ProfileView' },
  ];
  const iconMap = {
    home: require('../theme/asserts/icon/house.png'),
    appointment: require('../theme/asserts/icon/shedule.png'),
    history: require('../theme/asserts/icon/exam.png'),
    profile: require('../theme/asserts/icon/profile.png'),
  };
  return (
    <View
      style={[
        styles.footer,
        { paddingBottom: insets.bottom },
        { backgroundColor: themeColor },
      ]}
    >
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tab}
          onPress={() => navigation.navigate(item.screen)}
        >
          {/* <Icon name={item.icon} size={24} color="#fff" /> */}
          <Image
            source={
              iconMap[item.icon] || require('../theme/asserts/icon/default.png')
            } // optional fallback icon
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',

    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
    marginBottom: 8,
  },
});

export default Footer;
