import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getToken } from '../../utils/storage';

const RelationshipManager = () => {
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
      console.log("Stored token:", token);
    };
    fetchToken();
  }, []);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const metrics = {
    totalClients: 157,
    activeDeals: 23,
    monthlyRevenue: 285000,
    conversionRate: 68,
  };

  const clients = [
    {
      id: 1,
      name: 'Acme Corp',
      contact: 'John Smith',
      value: 125000,
      status: 'Active',
      lastContact: '2 days ago',
      priority: 'high',
    },
    {
      id: 2,
      name: 'TechStart Ltd',
      contact: 'Sarah Johnson',
      value: 85000,
      status: 'Prospect',
      lastContact: '1 week ago',
      priority: 'medium',
    },
    {
      id: 3,
      name: 'Global Industries',
      contact: 'Mike Wilson',
      value: 200000,
      status: 'Active',
      lastContact: '3 days ago',
      priority: 'high',
    },
    {
      id: 4,
      name: 'Innovation Hub',
      contact: 'Emily Chen',
      value: 65000,
      status: 'Negotiation',
      lastContact: '1 day ago',
      priority: 'medium',
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: 'Follow up with Acme Corp proposal',
      client: 'Acme Corp',
      due: 'Today',
      priority: 'high',
    },
    {
      id: 2,
      task: 'Quarterly review with TechStart',
      client: 'TechStart Ltd',
      due: 'Tomorrow',
      priority: 'medium',
    },
    {
      id: 3,
      task: 'Contract renewal discussion',
      client: 'Global Industries',
      due: '3 days',
      priority: 'high',
    },
    {
      id: 4,
      task: 'Product demo preparation',
      client: 'Innovation Hub',
      due: '1 week',
      priority: 'low',
    },
  ];

  const StatusBadge = ({ status }) => {
    const getStatusStyle = status => {
      switch (status) {
        case 'Active':
          return { backgroundColor: '#D1FAE5', color: '#065F46' };
        case 'Prospect':
          return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
        case 'Negotiation':
          return { backgroundColor: '#FEF3C7', color: '#92400E' };
        default:
          return { backgroundColor: '#F3F4F6', color: '#374151' };
      }
    };

    return (
      <View
        style={[
          styles.badge,
          { backgroundColor: getStatusStyle(status).backgroundColor },
        ]}
      >
        <Text
          style={[styles.badgeText, { color: getStatusStyle(status).color }]}
        >
          {status}
        </Text>
      </View>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const getPriorityStyle = priority => {
      switch (priority) {
        case 'high':
          return { backgroundColor: '#FEE2E2', color: '#991B1B' };
        case 'medium':
          return { backgroundColor: '#FEF3C7', color: '#92400E' };
        case 'low':
          return { backgroundColor: '#D1FAE5', color: '#065F46' };
        default:
          return { backgroundColor: '#F3F4F6', color: '#374151' };
      }
    };

    return (
      <View
        style={[
          styles.badge,
          { backgroundColor: getPriorityStyle(priority).backgroundColor },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            { color: getPriorityStyle(priority).color },
          ]}
        >
          {priority.toUpperCase()}
        </Text>
      </View>
    );
  };

  const MetricCard = ({ title, value, icon, trend, color }) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View>
          <Text style={styles.metricTitle}>{title}</Text>
          <Text style={styles.metricValue}>{value}</Text>
        </View>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
      </View>
      <View style={styles.trendContainer}>
        <Text style={styles.trendText}>↗ {trend}</Text>
      </View>
    </View>
  );

  const TaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{item.task}</Text>
        <Text style={styles.taskClient}>{item.client}</Text>
      </View>
      <View style={styles.taskMeta}>
        <PriorityBadge priority={item.priority} />
        <Text style={styles.taskDue}>{item.due}</Text>
      </View>
    </View>
  );

  const ClientItem = ({ item }) => (
    <View style={styles.clientItem}>
      <View style={styles.clientHeader}>
        <View style={styles.clientAvatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.name}</Text>
          <Text style={styles.clientContact}>{item.contact}</Text>
        </View>
      </View>
      <View style={styles.clientMeta}>
        <Text style={styles.clientValue}>${item.value.toLocaleString()}</Text>
        <StatusBadge status={item.status} />
        <Text style={styles.clientLastContact}>{item.lastContact}</Text>
      </View>
      <View style={styles.clientActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📞</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>✉️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTab]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title.charAt(0).toUpperCase() + title.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Total Clients"
          value={metrics.totalClients}
          icon="👥"
          trend="+12% from last month"
          color="#DBEAFE"
        />
        <MetricCard
          title="Active Deals"
          value={metrics.activeDeals}
          icon="📊"
          trend="+8% from last month"
          color="#FED7AA"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${metrics.monthlyRevenue.toLocaleString()}`}
          icon="$"
          trend="+15% from last month"
          color="#D1FAE5"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          icon="%"
          trend="+5% from last month"
          color="#E9D5FF"
        />
      </View>

      {/* Tasks Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
          <Text style={styles.sectionIcon}>📅</Text>
        </View>
        <FlatList
          data={upcomingTasks}
          renderItem={({ item }) => <TaskItem item={item} />}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* Top Clients Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Clients by Value</Text>
          <Text style={styles.sectionIcon}>👤</Text>
        </View>
        <FlatList
          data={clients.slice(0, 4)}
          renderItem={({ item }) => <ClientItem item={item} />}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );

  const renderClients = () => (
    <View style={styles.tabContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Client List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Portfolio</Text>
        <FlatList
          data={clients}
          renderItem={({ item }) => <ClientItem item={item} />}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );

  const renderPipeline = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.pipelineGrid}>
        {['Prospect', 'Qualified', 'Proposal', 'Negotiation'].map(
          (stage, index) => (
            <View key={stage} style={styles.pipelineStage}>
              <View style={styles.stageHeader}>
                <Text style={styles.stageTitle}>{stage}</Text>
                <View style={styles.stageCount}>
                  <Text style={styles.stageCountText}>
                    {Math.floor(Math.random() * 10) + 1}
                  </Text>
                </View>
              </View>
              {clients.slice(0, 2).map(client => (
                <View key={client.id} style={styles.pipelineItem}>
                  <Text style={styles.pipelineClientName}>{client.name}</Text>
                  <Text style={styles.pipelineClientValue}>
                    ${client.value.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          ),
        )}
      </View>

      {/* Pipeline Analytics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pipeline Performance</Text>
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticItem}>
            <Text style={styles.analyticValue}>$2.1M</Text>
            <Text style={styles.analyticLabel}>Total Pipeline Value</Text>
          </View>
          <View style={styles.analyticItem}>
            <Text style={styles.analyticValue}>45 days</Text>
            <Text style={styles.analyticLabel}>Avg. Deal Cycle</Text>
          </View>
          <View style={styles.analyticItem}>
            <Text style={styles.analyticValue}>68%</Text>
            <Text style={styles.analyticLabel}>Win Rate</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderAnalytics = () => (
    <ScrollView style={styles.tabContent}>
      {/* Performance Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Overview</Text>
        <View style={styles.performanceList}>
          {[
            { label: 'Calls Made This Month', value: '142' },
            { label: 'Meetings Scheduled', value: '28' },
            { label: 'Proposals Sent', value: '15' },
            { label: 'Deals Closed', value: '8' },
          ].map((item, index) => (
            <View key={index} style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>{item.label}</Text>
              <Text style={styles.performanceValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Client Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Distribution</Text>
        <View style={styles.distributionList}>
          {[
            { label: 'Enterprise (>$100K)', percentage: 60, color: '#3B82F6' },
            {
              label: 'Mid-Market ($50K-$100K)',
              percentage: 30,
              color: '#10B981',
            },
            {
              label: 'Small Business (<$50K)',
              percentage: 10,
              color: '#F59E0B',
            },
          ].map((item, index) => (
            <View key={index} style={styles.distributionItem}>
              <Text style={styles.distributionLabel}>{item.label}</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.percentageText}>{item.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'clients':
        return renderClients();
      case 'pipeline':
        return renderPipeline();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderOverview();
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Relationship Manager</Text>
            <Text style={styles.headerSubtitle}>
              Welcome back, Alex Thompson
            </Text>
          </View>
          {/* <View style={styles.headerActions}>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add Client</Text>
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AT</Text>
            </View>
          </View> */}
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['overview', 'clients', 'pipeline', 'analytics'].map(tab => (
              <TabButton
                key={tab}
                title={tab}
                isActive={activeTab === tab}
                onPress={() => setActiveTab(tab)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        {renderContent()}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  dashboardSection: {
    padding: 9,
  },
  headerDashboard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#002c54',
    padding: 9,
    borderRadius: 4,
    paddingLeft: 20,
    borderTopWidth: 3,
    borderTopColor: '#fd7e14',
  },
  headerDashboardText: {
    fontSize: 20,
    fontWeight: 400,
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: (width - 48) / 2,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  metricTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  sectionIcon: {
    fontSize: 16,
  },
  taskItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  taskClient: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskMeta: {
    alignItems: 'flex-end',
  },
  taskDue: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  clientItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  clientContact: {
    fontSize: 12,
    color: '#6B7280',
  },
  clientMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clientValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  clientLastContact: {
    fontSize: 12,
    color: '#6B7280',
  },
  clientActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 12,
    padding: 4,
  },
  actionIcon: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
  },
  pipelineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  pipelineStage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: (width - 48) / 2,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  stageCount: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stageCountText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  pipelineItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  pipelineClientName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  pipelineClientValue: {
    fontSize: 10,
    color: '#6B7280',
  },
  analyticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  analyticItem: {
    alignItems: 'center',
  },
  analyticValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 4,
  },
  analyticLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  performanceList: {
    marginTop: 16,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  performanceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  distributionList: {
    marginTop: 16,
  },
  distributionItem: {
    marginBottom: 16,
  },
  distributionLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    minWidth: 30,
  },
});

export default RelationshipManager;
