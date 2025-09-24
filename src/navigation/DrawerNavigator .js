import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions, TouchableOpacity, Text, View } from 'react-native';
import CustomDrawerContent from './CustomDrawerContent'; // ✅ Make sure this path is correct
import Setting from '../common/Setting';
import { useTheme } from '../theme/ThemeContext';
import Customer from '../screens/Dashboard/Customer';
import { useSelector } from 'react-redux';
import RelationshipManager from '../screens/Dashboard/RelationshipManager';
import ProductList from '../screens/Products/ProductList';
import SupportTicketAdd from '../screens/SupportTicket/SupportTicketAdd';
import SupportTicketList from '../screens/SupportTicket/SupportTicketList';
import RegisterScreen from '../screens/RegisterScreen';

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

const getDashboardComponent = role_id => {
  switch (role_id) {
    case 5:
      return RelationshipManager;
    case 6:
      return Customer;
    default:
      return () => null; // fallback
  }
};

const DrawerNavigator = () => {
  const { themeColor } = useTheme();
  const { user } = useSelector(state => state.auth);
  const DashboardComponent = getDashboardComponent(user?.role_id);
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          backgroundColor: '#fff',
          width: width * 0.75,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: themeColor, // 🟢 use dynamic color
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 16, padding: 4 }}
            onPress={() => navigation.openDrawer()}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>
                ☰
              </Text>
            </View>
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen name="dashboard" component={DashboardComponent} />
      <Drawer.Screen name="productList" component={ProductList} />
      <Drawer.Screen name="SupportTicketAdd" component={SupportTicketAdd} />
      <Drawer.Screen name="SupportTicketList" component={SupportTicketList} />
      {/* <Drawer.Screen name="RegisterScreen" component={RegisterScreen} /> */}
      <Drawer.Screen name="Setting" component={Setting} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
