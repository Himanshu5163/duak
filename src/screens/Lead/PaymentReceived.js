import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PaymentReceived = ({ selectedStep }) => {
  if (!selectedStep || !selectedStep.status) {
    return null;
  }

  if (selectedStep.status === 'pending') {
    return (
      <View style={styles.contentPlaceholder}>
        <Icon name="alert-circle-outline" size={48} color="#EF4444" />{' '}
        <Text style={styles.contentPlaceholderTitle}>Payment Pending</Text>
        <Text style={styles.contentPlaceholderText}>
          We are waiting for confirmation of your transaction. Please check back
          soon.
        </Text>
      </View>
    );
  } else if (selectedStep.status === 'in-progress') {
    return (
      <View style={styles.contentPlaceholder}>
        <Icon name="hourglass-outline" size={48} color="#FFA500" />{' '}
        <Text style={styles.contentPlaceholderTitle}>Payment In Progress</Text>
        <Text style={styles.contentPlaceholderText}>
          Your transaction is currently being processed. This may take a few
          moments.
        </Text>
      </View>
    );
  } else if (selectedStep.status === 'completed') {
    return (
      <View style={styles.contentPlaceholder}>
        <Icon name="checkmark-circle-outline" size={48} color="#28A745" />{' '}
        <Text style={styles.contentPlaceholderTitle}>Payment Complete</Text>
        <Text style={styles.contentPlaceholderText}>
          Your payment has been successfully received and processed. Thank you!
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  contentPlaceholder: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contentPlaceholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
    textAlign: 'center',
  },
  contentPlaceholderText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'justify',
    lineHeight: 20,
  },
});

export default PaymentReceived;
