import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
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
  const [activeTab, setActiveTab] = useState('Dashboard');

  const items = [
    { label: 'Dashboard', icon: 'view-dashboard-outline', screen: 'Dashboard' },
    { label: 'My Tickets', icon: 'ticket-outline', screen: 'MyTickets' },
    { label: 'Products', icon: 'package-variant-closed', screen: 'Products' },
    { label: 'You', icon: 'account-circle-outline', screen: 'Profile' },
  ];

  const handlePress = (screen) => {
    setActiveTab(screen);
    navigation.navigate(screen);
  };

  return (
    <View
      style={[
        styles.footer,
        { paddingBottom: insets.bottom || 8 },
        { backgroundColor: themeColor || colors.primary },
      ]}
    >
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tab, activeTab === item.screen && styles.activeTab]}
          onPress={() => handlePress(item.screen)}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Icon
              name={item.icon}
              size={24}
              style={[
                styles.icon,
                activeTab === item.screen && styles.activeIcon,
              ]}
            />
            {activeTab === item.screen && <View style={styles.activeIndicator} />}
          </View>
          <Text
            style={[
              styles.label,
              activeTab === item.screen && styles.activeLabel,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    flex: 1,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeIcon: {
    color: '#fff',
    transform: [{ scale: 1.1 }],
  },
  activeIndicator: {
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    position: 'absolute',
    bottom: -4,
  },
  label: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
    fontWeight: '500',
  },
  activeLabel: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Footer;