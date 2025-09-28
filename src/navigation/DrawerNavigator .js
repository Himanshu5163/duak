import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions, TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import CustomDrawerContent from './CustomDrawerContent';
import Setting from '../common/Setting';
import { useTheme } from '../theme/ThemeContext';
import Customer from '../screens/Dashboard/Customer';
import { useSelector } from 'react-redux';
import RelationshipManager from '../screens/Dashboard/RelationshipManager';
import ProductList from '../screens/Products/ProductList';
import SupportTicketAdd from '../screens/SupportTicket/SupportTicketAdd';
import SupportTicketList from '../screens/SupportTicket/SupportTicketList';
import LeadAdd from '../screens/Lead/LeadAdd';
import KycWizard from '../screens/User/KycWizard';

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

const getDashboardComponent = role_id => {
  switch (role_id) {
    case 5:
      return RelationshipManager;
    case 6:
      return Customer;
    default:
      return () => null;
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
        drawerStyle: styles.drawer,
        headerShown: true,
        headerStyle: [styles.header, { backgroundColor: themeColor }],
        headerTintColor: '#fff',
        headerTitleStyle: styles.headerTitle,
        headerLeft: () => (
          <TouchableOpacity
            style={styles.headerLeftButton}
            onPress={() => navigation.openDrawer()}
          >
            <View style={styles.headerLeftIconContainer}>
              <Text style={styles.headerLeftIcon}>☰</Text>
            </View>
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardComponent}
        options={{
          title: 'Dashboard',
          drawerLabel: 'Home',
        }}
      />
      <Drawer.Screen
        name="productList"
        component={ProductList}
        options={{
          title: 'Products',
          drawerLabel: 'Products',
        }}
      />
      <Drawer.Screen
        name="SupportTicketAdd"
        component={SupportTicketAdd}
        options={{
          title: 'Add Ticket',
          drawerLabel: 'Add Ticket',
        }}
      />
      <Drawer.Screen
        name="SupportTicketList"
        component={SupportTicketList}
        options={{
          title: 'Tickets',
          drawerLabel: 'Tickets',
        }}
      />
      <Drawer.Screen
        name="Setting"
        component={Setting}
        options={{
          title: 'App Settings',
          drawerLabel: 'App Settings',
        }}
      />
      <Drawer.Screen
        name="leadAdd"
        component={LeadAdd}
        options={{
          title: 'Lead Add',
          drawerLabel: 'Lead Add',
        }}
      />
      <Drawer.Screen
        name="kycWizard"
        component={KycWizard}
        options={{
          title: 'Kyc Verification',
          drawerLabel: 'Kyc Verification',
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: '#fff',
    width: width * 0.75,
  },
  header: {
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 18,
  },
  headerLeftButton: {
    marginLeft: 16,
    padding: 4,
  },
  headerLeftIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLeftIcon: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DrawerNavigator;