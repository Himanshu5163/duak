import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TextInput
} from 'react-native';

// Using React Native Vector Icons - Make sure to install: npm install react-native-vector-icons
// and follow platform-specific setup instructions
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

const { width, height } = Dimensions.get('window');

const DashboardScreen = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: 'dashboard', iconSet: 'MaterialIcons', color: '#3B82F6' },
    { id: 'students', name: 'Students', icon: 'people', iconSet: 'MaterialIcons', color: '#10B981' },
    { id: 'teachers', name: 'Teachers', icon: 'school', iconSet: 'MaterialIcons', color: '#8B5CF6' },
    { id: 'classes', name: 'Classes', icon: 'class', iconSet: 'MaterialIcons', color: '#F59E0B' },
    { id: 'attendance', name: 'Attendance', icon: 'how-to-reg', iconSet: 'MaterialIcons', color: '#EF4444' },
    { id: 'grades', name: 'Grades', icon: 'grade', iconSet: 'MaterialIcons', color: '#06B6D4' },
    { id: 'schedule', name: 'Schedule', icon: 'schedule', iconSet: 'MaterialIcons', color: '#84CC16' },
    { id: 'finance', name: 'Finance', icon: 'attach-money', iconSet: 'MaterialIcons', color: '#F97316' },
    { id: 'reports', name: 'Reports', icon: 'assessment', iconSet: 'MaterialIcons', color: '#6366F1' },
    { id: 'settings', name: 'Settings', icon: 'settings', iconSet: 'MaterialIcons', color: '#6B7280' }
  ];

  const stats = [
    { title: 'Total Students', value: '1,247', change: '+12%', icon: 'people', color: '#3B82F6' },
    { title: 'Total Teachers', value: '89', change: '+3%', icon: 'school', color: '#10B981' },
    { title: 'Attendance Rate', value: '94.2%', change: '+2.1%', icon: 'how-to-reg', color: '#8B5CF6' },
    { title: 'Monthly Revenue', value: '$48,290', change: '+8%', icon: 'attach-money', color: '#F59E0B' }
  ];

  const recentActivities = [
    { 
      action: 'New student enrollment', 
      user: 'Sarah Johnson', 
      time: '2 hours ago', 
      type: 'enrollment',
      icon: 'person-add'
    },
    { 
      action: 'Grade updated for Math Class', 
      user: 'Mr. Smith', 
      time: '4 hours ago', 
      type: 'grade',
      icon: 'grade'
    },
    { 
      action: 'Fee payment received', 
      user: 'John Doe', 
      time: '6 hours ago', 
      type: 'payment',
      icon: 'payment'
    },
    { 
      action: 'Attendance marked for Grade 10A', 
      user: 'Ms. Davis', 
      time: '1 day ago', 
      type: 'attendance',
      icon: 'how-to-reg'
    }
  ];

  const upcomingEvents = [
    { 
      title: 'Parent-Teacher Meeting', 
      date: 'July 5, 2025', 
      time: '9:00 AM',
      icon: 'event'
    },
    { 
      title: 'Science Fair', 
      date: 'July 8, 2025', 
      time: '10:00 AM',
      icon: 'science'
    },
    { 
      title: 'Sports Day', 
      date: 'July 12, 2025', 
      time: '8:00 AM',
      icon: 'sports'
    },
    { 
      title: 'Annual Exam Results', 
      date: 'July 15, 2025', 
      time: '2:00 PM',
      icon: 'assignment'
    }
  ];

  const quickActions = [
    { title: 'Add Student', icon: 'person-add', color: '#3B82F6', module: 'students' },
    { title: 'Mark Attendance', icon: 'how-to-reg', color: '#10B981', module: 'attendance' },
    { title: 'Enter Grades', icon: 'grade', color: '#8B5CF6', module: 'grades' },
    { title: 'Generate Report', icon: 'assessment', color: '#F59E0B', module: 'reports' }
  ];

  const StatCard = ({ stat }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={styles.statInfo}>
          <Text style={styles.statTitle}>{stat.title}</Text>
          <Text style={styles.statValue}>{stat.value}</Text>
          <View style={styles.statChange}>
            <Icon name="trending-up" size={14} color="#10B981" />
            <Text style={styles.statChangeText}>{stat.change} from last month</Text>
          </View>
        </View>
        <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
          <Icon name={stat.icon} size={24} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );

  const ActivityItem = ({ activity }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityDot} />
      <View style={styles.activityContent}>
        <Text style={styles.activityAction}>{activity.action}</Text>
        <Text style={styles.activityUser}>by {activity.user}</Text>
        <View style={styles.activityTime}>
          <Icon name="access-time" size={12} color="#9CA3AF" />
          <Text style={styles.activityTimeText}>{activity.time}</Text>
        </View>
      </View>
    </View>
  );

  const EventItem = ({ event }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventIndicator} />
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Icon name={event.icon} size={16} color="#3B82F6" />
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>
        <Text style={styles.eventDate}>{event.date}</Text>
        <Text style={styles.eventTime}>{event.time}</Text>
      </View>
    </View>
  );

  const QuickActionButton = ({ action }) => (
    <TouchableOpacity 
      style={styles.quickActionButton}
      onPress={() => setActiveModule(action.module)}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
        <Icon name={action.icon} size={24} color={action.color} />
      </View>
      <Text style={styles.quickActionText}>{action.title}</Text>
    </TouchableOpacity>
  );

  const ModuleButton = ({ module }) => {
    const isActive = activeModule === module.id;
    
    return (
      <TouchableOpacity
        style={[styles.moduleButton, isActive && styles.moduleButtonActive]}
        onPress={() => {
          setActiveModule(module.id);
          setSidebarOpen(false);
        }}
        activeOpacity={0.7}
      >
        <Icon 
          name={module.icon}
          size={20} 
          color={isActive ? module.color : '#6B7280'} 
        />
        <Text style={[styles.moduleButtonText, isActive && { color: module.color }]}>
          {module.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDashboard = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome back, Admin!</Text>
        <Text style={styles.welcomeSubtitle}>Here's what's happening at your school today</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </View>

      {/* Recent Activities & Upcoming Events */}
      <View style={styles.row}>
        {/* Recent Activities */}
        <View style={[styles.card, styles.activitiesCard]}>
          <View style={styles.cardHeader}>
            <Icon name="history" size={20} color="#3B82F6" />
            <Text style={styles.cardTitle}>Recent Activities</Text>
          </View>
          <View style={styles.activitiesList}>
            {recentActivities.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))}
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={[styles.card, styles.eventsCard]}>
          <View style={styles.cardHeader}>
            <Icon name="event" size={20} color="#10B981" />
            <Text style={styles.cardTitle}>Upcoming Events</Text>
          </View>
          <View style={styles.eventsList}>
            {upcomingEvents.map((event, index) => (
              <EventItem key={index} event={event} />
            ))}
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="flash-on" size={20} color="#F59E0B" />
          <Text style={styles.cardTitle}>Quick Actions</Text>
        </View>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <QuickActionButton key={index} action={action} />
          ))}
        </View>
      </View>

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );

  const renderModulePlaceholder = () => {
    const currentModule = modules.find(m => m.id === activeModule);
    
    return (
      <View style={styles.placeholderContainer}>
        <View style={styles.placeholderIcon}>
          <Icon name={currentModule?.icon || 'help'} size={40} color="#9CA3AF" />
        </View>
        <Text style={styles.placeholderTitle}>{currentModule?.name} Module</Text>
        <Text style={styles.placeholderDescription}>
          This module is under development. The interface will contain specific functionality for managing {activeModule}.
        </Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setActiveModule('dashboard')}
        >
          <Icon name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setSidebarOpen(!sidebarOpen)}
            activeOpacity={0.7}
          >
            <Icon name="menu" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {activeModule.charAt(0).toUpperCase() + activeModule.slice(1)}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <Icon name="notifications" size={20} color="#6B7280" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.7}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AD</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.main}>
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <TouchableOpacity 
            style={styles.overlay} 
            onPress={() => setSidebarOpen(false)}
            activeOpacity={1}
          />
        )}

        {/* Sidebar */}
        <View style={[
          styles.sidebar, 
          { 
            transform: [{ translateX: sidebarOpen ? 0 : -width }],
            opacity: sidebarOpen ? 1 : 0
          }
        ]}>
          <View style={styles.sidebarHeader}>
            <View style={styles.logo}>
              <Icon name="school" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.logoText}>SchoolERP</Text>
          </View>
          
          <ScrollView style={styles.navigation} showsVerticalScrollIndicator={false}>
            {modules.map((module) => (
              <ModuleButton key={module.id} module={module} />
            ))}
          </ScrollView>

          <View style={styles.sidebarFooter}>
            <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
              <Icon name="logout" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {activeModule === 'dashboard' ? renderDashboard() : renderModulePlaceholder()}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    width: 160,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    padding: 0,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  navigation: {
    flex: 1,
    paddingTop: 20,
  },
  moduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  moduleButtonActive: {
    backgroundColor: '#F3F4F6',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  moduleButtonText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#EF4444',
  },
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChangeText: {
    fontSize: 11,
    color: '#10B981',
    marginLeft: 4,
    fontWeight: '500',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activitiesCard: {
    flex: 1.5,
    marginRight: 8,
  },
  eventsCard: {
    flex: 1,
    marginLeft: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  activitiesList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityDot: {
    width: 8,
    height: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activityUser: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  activityTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTimeText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  eventsList: {
    marginTop: 8,
  },
  eventItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  eventIndicator: {
    width: 4,
    backgroundColor: '#10B981',
    borderRadius: 2,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 6,
  },
  eventDate: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  quickActionButton: {
    width: (width - 80) / 2,
    alignItems: 'center',
    padding: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 40,
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholderDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 20,
  },
});

export default DashboardScreen;