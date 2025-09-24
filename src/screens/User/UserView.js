import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  TextInput,
  FlatList,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { Strings } from '../../theme/Strings';

const { width } = Dimensions.get('window');

const UserView = () => {
  const token = '66|swQajga9OvTwvOecV9tRDNyEZsUOTp9MShfQjLzude6dd81f';
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const [userData, setUserData] = useState([]);
  const [roleData, setRoleData] = useState([]);

  useEffect(() => {
    filterUsers();
  }, [searchKeyword, selectedRole]);

  const filterUsers = (role = selectedRole, keyword = searchKeyword) => {
    let filtered = userData;

    if (role !== 'All') {
      filtered = filtered.filter(user => user.role_name === role);
    }
    if (keyword.trim()) {
      filtered = filtered.filter(
        user =>
          user.name?.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email?.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    setFilteredUsers(filtered);
  };

  const fetchUser = async () => {
    const formData = new FormData();
    formData.append('branch_id', '1'); // send as string

    try {
      const response = await fetch(`${Strings.APP_BASE_URL}/getUsers`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
      },
        body: formData,
      });

      const result = await response.json();

      console.log('user:', result);
      //Alert.alert('User Result', JSON.stringify(result)); // Convert to string

      if (result.status) {
        // Alert.alert('Success', 'User fetched successfully!');
        setUserData(result.data);
      }
    } catch (error) {
      console.error('Error fetch user:', error);
      // Alert.alert('Error', error.message);
    }
  };

  const fetchRole = async () => {
    try {
      const response = await fetch(`${Strings.APP_BASE_URL}/getRoles`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ Don't set Content-Type here!
        },
      });

      const result = await response.json();

      console.log('role:', result);
      //Alert.alert('Role Result', JSON.stringify(result)); // Convert to string

      if (result.status) {
        //Alert.alert('Success', 'Role fetched successfully!');
        setRoleData(result.data);
      }
    } catch (error) {
      console.error('Error fetch role:', error);
      //Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchRole();
  }, []);
  useEffect(() => {
    // Assuming userData is fetched or already available
    setFilteredUsers(userData);
  }, [userData]);

  const handleDropdownAction = (action, user) => {
    setActiveDropdown(null);

    switch (action) {
      case 'downloadId':
        console.log(`Downloading ID card for ${user.name}`);
        break;
      case 'downloadPayslip':
        console.log(`Downloading payslip for ${user.name}`);
        break;
      case 'downloadCertificate':
        console.log(`Downloading certificate for ${user.name}`);
        break;
      case 'viewSchedule':
        console.log(`Viewing schedule for ${user.name}`);
        break;
      case 'attendanceReport':
        console.log(`Viewing attendance report for ${user.name}`);
        break;
      case 'editProfile':
        console.log(`Editing profile for ${user.name}`);
        break;
      default:
        break;
    }
  };

  const handleMorePress = (userId, event) => {
    if (activeDropdown === userId) {
      setActiveDropdown(null);
    } else {
      // Close any existing dropdown first
      setActiveDropdown(null);
      // Small delay to ensure smooth animation
      setTimeout(() => {
        setActiveDropdown(userId);
      }, 50);
    }
  };

  const getAttendanceColor = attendance => {
    if (attendance >= 95) return '#10b981';
    if (attendance >= 90) return '#f59e0b';
    if (attendance >= 80) return '#f97316';
    return '#ef4444';
  };

  const getStatusColor = status => {
    switch (status) {
      case '1':
        return '#10b981';
      case '0':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const UserCard = ({ user }) => (
    <View style={styles.userCard}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            }}
            style={styles.avatar}
          />
          {user.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>{user.role_name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={event => handleMorePress(user.id, event)}
          activeOpacity={0.7}
        >
          <Text style={styles.moreText}>⋯</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>{user.address}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                { color: getAttendanceColor(user.attendance) },
              ]}
            >
              {user.attendance}%
            </Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(user.status) },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(user.status) },
                ]}
              >
                {user.status === '1' ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
          <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
            Contact
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const DropdownMenu = () => {
    if (!activeDropdown) return null;

    const user = users.find(u => u.id === activeDropdown);
    if (!user) return null;

    return (
      <Modal
        visible={true}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveDropdown(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveDropdown(null)}
        >
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleDropdownAction('downloadId', user)}
            >
              <Text style={styles.dropdownIcon}>🆔</Text>
              <Text style={styles.dropdownText}>Download ID Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleDropdownAction('downloadPayslip', user)}
            >
              <Text style={styles.dropdownIcon}>💰</Text>
              <Text style={styles.dropdownText}>Download Payslip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleDropdownAction('downloadCertificate', user)}
            >
              <Text style={styles.dropdownIcon}>📜</Text>
              <Text style={styles.dropdownText}>Download Certificate</Text>
            </TouchableOpacity>

            <View style={styles.dropdownDivider} />

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleDropdownAction('viewSchedule', user)}
            >
              <Text style={styles.dropdownIcon}>📅</Text>
              <Text style={styles.dropdownText}>View Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleDropdownAction('attendanceReport', user)}
            >
              <Text style={styles.dropdownIcon}>📊</Text>
              <Text style={styles.dropdownText}>Attendance Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleDropdownAction('editProfile', user)}
            >
              <Text style={styles.dropdownIcon}>✏️</Text>
              <Text style={styles.dropdownText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Team Members</Text>
        <Text style={styles.headerSubtitle}>
          {userData.length} members found
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email..."
            value={searchKeyword}
            onChangeText={text => {
              setSearchKeyword(text);
              filterUsers(selectedRole, text); // 👈 Trigger filter
            }}
            placeholderTextColor="#9ca3af"
          />

          {searchKeyword.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchKeyword('');
                filterUsers(selectedRole, ''); // 👈 Reset filter
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Role Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Role:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
        >
          {/* "All" Button */}
          <TouchableOpacity
            key="all"
            style={[
              styles.filterChip,
              selectedRole === 'All' && styles.filterChipActive,
            ]}
            onPress={() => {
              setSelectedRole('All');
              filterUsers('All');
            }}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedRole === 'All' && styles.filterChipTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {roleData.map(role => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.filterChip,
                selectedRole === role.name && styles.filterChipActive,
              ]}
              onPress={() => {
                setSelectedRole(role.name);
                filterUsers(role.name); // Trigger filter immediately
              }}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedRole === role.name && styles.filterChipTextActive,
                ]}
              >
                {role.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => <UserCard user={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onScrollBeginDrag={() => setActiveDropdown(null)}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
      />

      <DropdownMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  filterScrollView: {
    flexGrow: 0,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  filterChipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 16,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  moreButton: {
    padding: 8,
    borderRadius: 8,
  },
  moreText: {
    fontSize: 20,
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    minWidth: 200,
    maxWidth: 280,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  dropdownText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 4,
  },
  cardBody: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default UserView;
