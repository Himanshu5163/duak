import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Helper function to determine the content based on installation status
const getStatusContent = (status) => {
  switch (status.toLowerCase()) {
    case 'complete':
    case 'finished':
      return {
        title: 'Installation Complete! 🥳',
        message: 'The installation has been successfully completed and tested. Your system is fully operational.',
        iconName: 'check-decagram', // Star/Badge with a checkmark for final approval
        color: '#28a745', // Green (Success)
        bgColor: '#e6ffed', 
      };
    case 'in-progress':
    case 'scheduled':
      return {
        title: 'Installation In Progress',
        message: 'The installation team is currently on-site working, or the service is scheduled for today.',
        iconName: 'tools', // Tools icon to signify work being done
        color: '#ffc107', // Orange/Yellow (In-Progress)
        bgColor: '#fff3cd', 
      };
    case 'pending':
    default:
      return {
        title: 'Installation Pending',
        message: 'Installation is booked and confirmed, awaiting the scheduled service date and time.',
        iconName: 'calendar-clock', // Calendar with a clock for scheduled time
        color: '#007bff', // Blue (Informational)
        bgColor: '#eaf3ff', 
      };
  }
};

const Installation = ({ status = 'in-progress' }) => {
  const { title, message, iconName, color, bgColor } = getStatusContent(status.toLowerCase());

  return (
    <View style={[styles.cardContainer, { backgroundColor: bgColor, borderColor: color }]}>
      
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: color + '1A' }]}> 
          {/* Icon with primary color and light background circle */}
          <Icon name={iconName} size={30} color={color} />
        </View>
        <Text style={[styles.statusTitle, { color: color }]}>
          {title}
        </Text>
      </View>

      <Text style={styles.messageText}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 8, // Prominent colored border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginVertical: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    marginRight: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginLeft: 65, // Aligns text under the title/message block
  },
});

export default Installation;