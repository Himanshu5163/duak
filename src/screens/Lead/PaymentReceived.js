import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Helper function to determine the content based on status
const getStatusContent = (status) => {
  switch (status) {
    case 'complete':
    case 'received':
      return {
        title: 'Payment Complete',
        message: 'Your payment has been successfully received and processed. Thank you!',
        iconName: 'check-circle',
        color: '#28a745', // Green
        bgColor: '#e6ffed', // Light Green
      };
    case 'in-progress':
    case 'processing':
      return {
        title: 'Payment In Progress',
        message: 'Your transaction is currently being processed. This may take a few moments.',
        iconName: 'timer-sand',
        color: '#ffc107', // Yellow/Orange
        bgColor: '#fff3cd', // Light Yellow
      };
    case 'pending':
    default:
      return {
        title: 'Payment Pending',
        message: 'We are waiting for confirmation of your transaction. Please check back soon.',
        iconName: 'alert-circle',
        color: '#007bff', // Blue
        bgColor: '#eaf3ff', // Light Blue
      };
  }
};

const PaymentReceived = ({ status = 'pending' }) => {
  const { title, message, iconName, color, bgColor } = getStatusContent(status.toLowerCase());

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

export default PaymentReceived;