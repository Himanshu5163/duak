import React,{useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import { getToken } from '../../utils/storage';

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good Morning';
  if (hour < 16) return 'Good Afternoon';
  return 'Good Evening';
};

const Customer = () => {
  const { user } = useSelector(state => state.auth);
  const getIconName = fullIconClass => {
    if (!fullIconClass) return 'question-circle';

    // Example: "fa fa-shirtsinbulk" → "shirtsinbulk"
    const parts = fullIconClass.split(' ');
    return (
      parts.find(p => p.startsWith('fa-'))?.replace('fa-', '') ||
      'question-circle'
    );
  };

  useEffect(() => {
      const fetchToken = async () => {
        const token = await getToken();
        // console.log("Stored token:", token);
      };
      fetchToken();
    }, []);

  return (
    <>
      <View style={styles.dashboardSection}>
        <View style={styles.headerDashboard}>
          <Icon
            name={getIconName('fa fa-home')}
            solid
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.headerDashboardText}>Customer Dashboard</Text>
        </View>
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>{`${getGreeting()}, ${
            user.name
          }`}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 5,
              gap: 8,
              padding: 5,
              marginTop: 8, // iOS shadow
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,

              // Android shadow
              elevation: 3,
            }}
          >
            <View>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                }}
                style={styles.profileImage}
              />
            </View>
            <View>
              <Text style={styles.userName}>{ user.name}</Text>
              <Text style={styles.userDetail}>Mobile No.: { user.mobile}</Text>
              <Text style={styles.userDetail}>Address: Jaipur</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  dashboardSection: {
    padding: 9,
    flex:1
  },
  headerDashboard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#002c54',
    padding: 9,
    borderRadius: 4,
    paddingLeft: 20,
  },
  headerDashboardText: {
    fontSize: 20,
    fontWeight: 400,
    color: '#FFFFFF',
  },
  greetingSection: {
    padding: 9,
  },
  greetingText: {
    fontSize: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 42.5,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userName: {
    fontSize: 20,
    fontWeight: 400,
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 15,
    fontWeight: 300,
  },
   container: {
    flex: 1,
    paddingHorizontal: 15,
   
  },
  card: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    margin: 5,
    borderRadius: 12,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,

    // Shadow for Android
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 50,
    padding: 10,
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Customer;
