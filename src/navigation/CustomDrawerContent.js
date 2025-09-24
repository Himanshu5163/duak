// CustomDrawerContent.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { removeUser } from '../utils/storage';
import { fetchSidebars } from '../redux/sidebarSlice';
import { Strings } from '../theme/Strings';
import Icon from 'react-native-vector-icons/FontAwesome5';

const menuItems = [
  {
    id: 1,
    title: 'Dashboard',
    icon: 'house-user',
    screen: 'dashboard',
    color: '#667eea',
    submenus: [],
  },
  {
    id: 2,
    title: 'Product List',
    icon: 'box',
    screen: 'productList',
    color: '#667eea',
    submenus: [],
  },
  {
    id: 3,
    title: 'Support Managment',
    icon: 'headset',
    screen: 'productList',
    color: '#667eea',
    submenus: [
      { id: 31, title: 'Raise Ticket', screen: 'SupportTicketAdd' },
      { id: 32, title: 'View Ticket', screen: 'SupportTicketList' },
    ],
  },
  {
    id: 12,
    title: 'Settings',
    icon: 'toolbox',
    screen: 'Setting',
    color: '#a8edea',
    submenus: [],
  },
];

const CustomDrawerContent = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [animatedValues] = useState({});
  const [activeItemId, setActiveItemId] = useState(null);

  const API_URL = Strings.APP_BASE_URL || '';
  const user_id = user?.id || '';
  const role_id = user?.role_id || '';

  useEffect(() => {
    if (API_URL) {
      dispatch(fetchSidebars({ API_URL, user_id, role_id }));
    }
  }, [API_URL, dispatch]);

  useEffect(() => {
    menuItems.forEach(item => {
      if (item.submenus?.length) {
        animatedValues[item.id] = new Animated.Value(0);
      }
    });
  }, []);

  const toggleSubmenu = menuId => {
    const isExpanded = expandedMenus[menuId];
    setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));

    Animated.timing(animatedValues[menuId], {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
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
  };

  const navigateToScreen = screenName => {
    if (screenName) {
      navigation.navigate(screenName);
      navigation.closeDrawer();
    }
  };

  return (
    <View style={styles.drawerContainer}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri:
                  user?.image_url ||
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              }}
              style={styles.profileImage}
            />
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.name || 'John Doe'}
            </Text>
            <Text style={styles.profileEmail}>
              {user?.mobile || 'john@example.com'}
            </Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileRole}>
                {user?.role_id || 'Administrator'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {menuItems.map(item => {
          const hasSubmenu = item.submenus.length > 0;
          const isExpanded = expandedMenus[item.id]; // ✅ use expandedMenus object
          const animation = animatedValues[item.id]; // already created in useEffect

          return (
            <View key={item.id} style={{ marginTop: 8 }}>
              <TouchableOpacity
                style={[
                  styles.moduleButton,
                  activeItemId === item.id && styles.moduleButtonActive,
                ]}
                onPress={() => {
                  setActiveItemId(item.id);
                  hasSubmenu ? toggleSubmenu(item.id) : navigateToScreen(item.screen);
                }}
                activeOpacity={0.7}
              >
                <View style={{flexDirection:'row'}}>
                  <Icon name={item.icon} size={16} color={activeItemId === item.id ? "#000" : "#fff"} />
                  <Text
                    style={[
                      styles.moduleButtonText,
                      activeItemId === item.id && styles.moduleTextActive,
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>

                {/* Toggle arrow if submenu exists */}
                {hasSubmenu && (
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: animation
                            ? animation.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["0deg", "180deg"], // ▶ rotates to ▼
                            })
                            : "0deg",
                        },
                      ],
                      marginLeft: 8,
                    }}
                  >
                    {/* <Text style={{ color: "#000", fontSize: 14 }}>▶</Text> */}
                    <Icon name="caret-up" size={16} color={activeItemId === item.id ? "#000" : "#fff"} />
                  </Animated.View>
                )}
              </TouchableOpacity>

              {hasSubmenu && (
                <Animated.View
                  style={{
                    maxHeight: animation
                      ? animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, item.submenus.length * 40],
                      })
                      : 0,
                    overflow: "hidden",
                  }}
                >
                  {item.submenus.map(sub => (
                    <TouchableOpacity
                      key={sub.id}
                      onPress={() => navigateToScreen(sub.screen)}
                      style={{ paddingLeft: 30, paddingVertical: 10 }}
                    >
                      <Text style={{ color: "#FFFFFF" }}>{sub.title}</Text>
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
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    position: 'relative',
    // Create gradient effect with overlay
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
    gap: 5,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
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
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
    textAlign: 'center',
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
  menuSection: {
    flex: 1,
    paddingTop: 20,
  },
  menuContainer: {
    paddingHorizontal: 12,
  },
  menuItemContainer: {
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
    flex: 1,
  },
  submenuContainer: {
    overflow: 'hidden',
    marginLeft: 20,
    marginRight: 8,
  },
  submenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 1,
  },
  submenuConnector: {
    width: 2,
    height: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 14,
    borderRadius: 1,
  },
  emojiIcon: {
    textAlign: 'center',
  },
  submenuEmojiIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  expandIcon: {
    fontSize: 16,
    color: '#8e8e93',
    fontWeight: 'bold',
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  hamburgerIcon: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  submenuText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    flex: 1,
  },
  logoutSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
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
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#fd7e14',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    textAlign: 'center',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  appVersion: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  hamburgerButton: {
    marginLeft: 16,
    padding: 4,
  },
  hamburgerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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
    borderLeftWidth: 3,
    borderLeftColor: '#fd7e14',
  },
  moduleButtonText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  moduleTextActive: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#002c54',
  },
  moduleIconActive: {
    color: '#002c54',
  },
});

export default CustomDrawerContent;
