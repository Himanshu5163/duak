import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Helper function to determine the content based on dispatch status
const getStatusContent = (status) => {
  switch (status.toLowerCase()) {
    case 'complete':
    case 'delivered':
      return {
        title: 'Dispatch Delivered',
        message: 'The materials have been successfully delivered and signed for at the destination.',
        iconName: 'package-variant-closed-check', // Box with a checkmark
        color: '#28a745', // Green (Success)
        bgColor: '#e6ffed', // Light Green
      };
    case 'in-progress':
    case 'out-for-delivery':
      return {
        title: 'Out For Delivery',
        message: 'Your materials have been dispatched and are currently en route to the delivery location.',
        iconName: 'truck-fast', // Fast truck icon
        color: '#ffc107', // Orange/Yellow (Warning/In-Progress)
        bgColor: '#fff3cd', // Light Yellow
      };
    case 'pending':
    default:
      return {
        title: 'Dispatch Pending',
        message: 'The materials are packed and ready, awaiting carrier pickup for dispatch.',
        iconName: 'package-variant-closed', // Simple box icon
        color: '#007bff', // Blue (Informational)
        bgColor: '#eaf3ff', // Light Blue
      };
  }
};

const MaterialDispatch = ({ status = 'pending' }) => {
  const { title, message, iconName, color, bgColor } = getStatusContent(status);

  return (
    <View style={[styles.cardContainer, { backgroundColor: bgColor, borderColor: color }]}>
      
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: color + '1A' }]}> 
          {/* Icon with primary color */}
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
    marginLeft: 65, // Align text under the title, skipping the icon area
  },
});

export default MaterialDispatch;