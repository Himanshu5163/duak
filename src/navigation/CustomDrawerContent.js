import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  StyleSheet,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { removeUser } from '../utils/storage';
import { fetchSidebars } from '../redux/sidebarSlice';
import { Strings } from '../theme/Strings';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Define menu items outside the component for better performance
const menuItems = [
  {
    id: 1,
    title: 'Dashboard',
    icon: 'house-user',
    screen: 'Dashboard',
    roles: [5, 6],
  },
  {
    id: 2,
    title: 'My Product',
    icon: 'box',
    screen: 'productList',
    roles: [6],
  },
  {
    id: 3,
    title: 'Kyc',
    icon: 'box',
    screen: 'kycWizard',
    roles: [6],
  },
  {
    id: 4,
    title: 'Tickets',
    icon: 'headset',
    submenus: [
      { id: 31, title: 'Raise Ticket', screen: 'SupportTicketAdd', roles: [6] },
      { id: 32, title: 'View Ticket', screen: 'SupportTicketList', roles: [5, 6] },
    ],
    roles: [5, 6],
  },
  {
    id: 5,
    title: 'Leads',
    icon: 'user-friends',
    submenus: [
      { id: 51, title: 'Add Lead', screen: 'leadAdd', roles: [5, 6] },
      { id: 52, title: 'New Leads', screen: 'LeadNew', roles: [5] },
      { id: 53, title: 'Lead Qualified', screen: 'leadQualified', roles: [5] },
      { id: 54, title: 'Lead Conversion', screen: 'LeadConversion', roles: [5] },
      { id: 55, title: 'Lead Closure', screen: 'LeadClosure', roles: [5] },
    ],
    roles: [5, 6],
  },
  {
    id: 12,
    title: 'Settings',
    icon: 'toolbox',
    screen: 'Setting',
    roles: [5, 6],
  },
];

const CustomDrawerContent = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const user_id = user?.id || '';
  const role_id = user?.role_id || '';

  const [expandedMenus, setExpandedMenus] = useState({});
  const animatedValues = useRef({});

  // Get the current route name from the navigation state for active item highlighting
  const currentRoute = navigation.getState().routes[navigation.getState().index];
  const routeName = currentRoute.name;

  useEffect(() => {
    // Initialize animated values for submenus
    menuItems.forEach(item => {
      if (item.submenus?.length) {
        if (!animatedValues.current[item.id]) {
          animatedValues.current[item.id] = new Animated.Value(0);
        }
      }
    });

    // You can uncomment this if you need to fetch sidebar data dynamically
    // if (Strings.APP_BASE_URL) {
    //   dispatch(fetchSidebars({ API_URL: Strings.APP_BASE_URL, user_id, role_id }));
    // }
  }, [dispatch, user_id, role_id]);

  const toggleSubmenu = useCallback(menuId => {
    const isExpanded = !!expandedMenus[menuId];
    setExpandedMenus(prev => ({ ...prev, [menuId]: !isExpanded }));

    Animated.timing(animatedValues.current[menuId], {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expandedMenus]);

  const handleLogout = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await removeUser();
          dispatch(logout());
        },
      },
    ]);
  }, [dispatch]);

  const navigateToScreen = useCallback(screenName => {
    if (screenName) {
      navigation.navigate(screenName);
      navigation.closeDrawer();
    }
  }, [navigation]);

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    const isMainVisible = item.roles.includes(role_id);
    if (!isMainVisible) return false;

    if (item.submenus) {
      item.submenus = item.submenus.filter(sub => sub.roles.includes(role_id));
    }
    return true;
  });

  return (
    <View style={styles.drawerContainer}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: user?.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&crop=face&w=150&h=150',
              }}
              style={styles.profileImage}
            />
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>{user?.name || 'Welcome Guest'}</Text>
            <Text style={styles.profileEmail} numberOfLines={1}>{user?.mobile || user?.email || ''}</Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileRole} numberOfLines={1}>
                {user?.role_name || ''}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.menuScrollView}>
        {filteredMenuItems.map(item => {
          const hasSubmenu = item.submenus && item.submenus.length > 0;
          const isActive = routeName === item.screen || (hasSubmenu && item.submenus.some(sub => sub.screen === routeName));
          const animation = hasSubmenu ? animatedValues.current[item.id] : null;

          return (
            <View key={item.id}>
              <TouchableOpacity
                style={[
                  styles.moduleButton,
                  isActive && styles.moduleButtonActive,
                ]}
                onPress={() => {
                  hasSubmenu ? toggleSubmenu(item.id) : navigateToScreen(item.screen);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.iconTextContainer}>
                  <Icon name={item.icon} size={16} color={isActive ? styles.moduleTextActive.color : styles.moduleButtonText.color} />
                  <Text
                    style={[
                      styles.moduleButtonText,
                      isActive && styles.moduleTextActive,
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>

                {hasSubmenu && animation && (
                  <Animated.View
                    style={[
                      styles.caretIcon,
                      {
                        transform: [{
                          rotate: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                          }),
                        }],
                      },
                    ]}
                  >
                    <Icon name="caret-up" size={16} color={isActive ? styles.moduleTextActive.color : styles.moduleButtonText.color} />
                  </Animated.View>
                )}
              </TouchableOpacity>

              {hasSubmenu && animation && (
                <Animated.View
                  style={[
                    styles.submenuContainer,
                    {
                      maxHeight: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, item.submenus.length * 40],
                      }),
                    },
                  ]}
                >
                  {item.submenus.map(sub => (
                    <TouchableOpacity
                      key={sub.id}
                      onPress={() => navigateToScreen(sub.screen)}
                      style={[
                        styles.submenuButton,
                        routeName === sub.screen && styles.submenuButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.submenuText,
                          routeName === sub.screen && styles.submenuTextActive,
                        ]}
                      >{sub.title}</Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Logout */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>🚪 Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#002c54',
  },
  profileSection: {
    backgroundColor: '#002c54',
    paddingTop: Platform.OS === 'android' ? 60 : 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    position: 'relative',
    shadowColor: '#002c54',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 15,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4ade80',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  profileBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileRole: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuScrollView: {
    flex: 1,
  },
  logoutSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#fd7e14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: '#fd7e14',
    padding: 13,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  moduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  moduleButtonActive: {
    backgroundColor: '#F3F4F6',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleButtonText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  moduleTextActive: {
    color: '#002c54',
  },
  caretIcon: {
    marginLeft: 8,
  },
  submenuContainer: {
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: 12,
    borderRadius: 12,
    marginTop: -4,
    marginBottom: 4,
  },
  submenuButton: {
    paddingLeft: 40,
    paddingVertical: 10,
  },
  submenuButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  submenuText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
  },
  submenuTextActive: {
    fontWeight: '600',
  }
});

export default CustomDrawerContent;