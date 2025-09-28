import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
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
  const [activeProducts, setActiveProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getIconName = fullIconClass => {
    if (!fullIconClass) return 'question-circle';

    // Example: "fa fa-shirtsinbulk" → "shirtsinbulk"
    const parts = fullIconClass.split(' ');
    return (
      parts.find(p => p.startsWith('fa-'))?.replace('fa-', '') ||
      'question-circle'
    );
  };

  // Mock data - replace with actual API call
  const fetchActiveProducts = async () => {
    try {
      // Simulate API delay
      setTimeout(() => {
        const mockProducts = [
          {
            id: '1',
            name: 'Residential Solar Panel System',
            type: 'Solar Installation',
            status: 'Active',
            capacity: '5.5 kW',
            installDate: '2024-03-15',
            energyGenerated: '1,245 kWh',
            monthlySavings: '₹4,500',
            warranty: 'Until 2049',
            icon: 'solar-panel',
          },
          {
            id: '2',
            name: 'Solar Water Heater',
            type: 'Solar Heating',
            status: 'Active',
            capacity: '200 Liters',
            installDate: '2024-01-20',
            energyGenerated: '850 kWh',
            monthlySavings: '₹1,200',
            warranty: 'Until 2034',
            icon: 'fire',
          },
          {
            id: '3',
            name: 'Solar Street Light System',
            type: 'Solar Lighting',
            status: 'Active',
            capacity: '40W LED',
            installDate: '2023-11-10',
            energyGenerated: '320 kWh',
            monthlySavings: '₹800',
            warranty: 'Until 2028',
            icon: 'lightbulb',
          },
          {
            id: '4',
            name: 'Solar Battery Storage',
            type: 'Energy Storage',
            status: 'Active',
            capacity: '10 kWh',
            installDate: '2024-03-15',
            energyGenerated: 'N/A',
            monthlySavings: '₹2,000',
            warranty: 'Until 2034',
            icon: 'battery-full',
          },
        ];
        setActiveProducts(mockProducts);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      // console.log("Stored token:", token);
    };
    fetchToken();
    fetchActiveProducts();
  }, []);

  const renderProductCard = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productHeader}>
        <View style={styles.productIconContainer}>
          <Icon
            name={item.icon}
            size={24}
            color="#ff6b35"
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productType}>{item.type}</Text>
          <Text style={styles.productCapacity}>Capacity: {item.capacity}</Text>
        </View>
        <View style={styles.productStatus}>
          <View style={[styles.statusBadge, 
            item.status === 'Active' ? styles.activeBadge : styles.inactiveBadge
          ]}>
            <Text style={[styles.statusText, 
              item.status === 'Active' ? styles.activeText : styles.inactiveText
            ]}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.energyStatsContainer}>
        <View style={styles.statCard}>
          <Icon name="bolt" size={16} color="#ff6b35" />
          <Text style={styles.statLabel}>Energy Generated</Text>
          <Text style={styles.statValue}>{item.energyGenerated}</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="rupee-sign" size={16} color="#28a745" />
          <Text style={styles.statLabel}>Monthly Savings</Text>
          <Text style={styles.statValue}>{item.monthlySavings}</Text>
        </View>
      </View>

      <View style={styles.productDetails}>
        <View style={styles.detailRow}>
          <Icon name="calendar-alt" size={14} color="#666" />
          <Text style={styles.detailText}>Installed: {item.installDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="shield-alt" size={14} color="#666" />
          <Text style={styles.detailText}>Warranty: {item.warranty}</Text>
        </View>
      </View>

      <View style={styles.productActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="chart-line" size={16} color="#ff6b35" />
          <Text style={styles.actionButtonText}>View Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.serviceButton]}>
          <Icon name="tools" size={16} color="#6f42c1" />
          <Text style={[styles.actionButtonText, styles.serviceText]}>Service</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dashboardSection}>
        {/* <View style={styles.headerDashboard}>
          <Icon
            name={getIconName('fa fa-home')}
            solid
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.headerDashboardText}>Customer Dashboard</Text>
        </View> */}
        
        <View style={styles.greetingSection}>
          {/* <Text style={styles.greetingText}>{`${getGreeting()}, ${user.name}`}</Text> */}
          <View style={styles.profileContainer}>
            <View>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                }}
                style={styles.profileImage}
              />
            </View>
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userDetail}>Mobile No.: {user.mobile}</Text>
              <Text style={styles.userDetail}>Address: Jaipur</Text>
            </View>
          </View>
        </View>

        {/* Active Products Section */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Icon name="solar-panel" size={20} color="#ff6b35" />
            <Text style={styles.sectionTitle}>Solar Energy Systems</Text>
            <Text style={styles.productCount}>({activeProducts.length})</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#002c54" />
              <Text style={styles.loadingText}>Loading your products...</Text>
            </View>
          ) : activeProducts.length > 0 ? (
            <FlatList
              data={activeProducts}
              renderItem={renderProductCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="sun" size={48} color="#ff6b35" />
              <Text style={styles.emptyText}>No solar systems installed</Text>
              <Text style={styles.emptySubtext}>Start your journey to clean energy</Text>
              <TouchableOpacity style={styles.shopButton}>
                <Icon name="solar-panel" size={16} color="#fff" />
                <Text style={styles.shopButtonText}>Browse Solar Solutions</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dashboardSection: {
    padding: 9,
    flex: 1,
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
    fontWeight: '400',
    color: '#FFFFFF',
  },
  greetingSection: {
    padding: 9,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    gap: 8,
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#002c54',
  },
  userName: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  userDetail: {
    fontSize: 15,
    fontWeight: '300',
    color: '#666',
    marginBottom: 2,
  },
  
  // Products Section Styles
  productsSection: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff6b35',
    marginLeft: 8,
  },
  productCount: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff5f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  productType: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '500',
  },
  productCapacity: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  productStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#d4edda',
  },
  inactiveBadge: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#155724',
  },
  inactiveText: {
    color: '#721c24',
  },
  
  // Energy Statistics Styles
  energyStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  
  productDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ff6b35',
  },
  serviceButton: {
    borderColor: '#6f42c1',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ff6b35',
    marginLeft: 6,
  },
  serviceText: {
    color: '#6f42c1',
  },
  
  // Loading and Empty States
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 20,
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b35',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default Customer;