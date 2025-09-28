import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Qualified = ({ selectedStep }) => {
  
  if (!selectedStep || !selectedStep.status) {
    return null;
  }

  if (selectedStep.status === 'pending') {
    return (
      <View style={styles.contentPlaceholder}>
        <Icon name="alert-circle-outline" size={48} color="#EF4444" />{' '}
        <Text style={styles.contentPlaceholderText}>
          Your client information has been **submitted and is queued for
          verification**. An admin will begin the review process shortly. You
          will be automatically notified once your documents have been moved to
          'In-Progress' status.
        </Text>
      </View>
    );
  } else if (selectedStep.status === 'in-progress') {
    return (
      <View style={styles.contentPlaceholder}>
        <Icon name="hourglass-outline" size={48} color="#FFA500" />{' '}
        <Text style={styles.contentPlaceholderText}>
          Your client information and supporting documents are currently **under
          active review** by our administrative team. We are diligently checking
          all details and aim to complete the verification process within 24-48
          hours.
        </Text>
      </View>
    );
  } else if (selectedStep.status === 'completed') {
    return (
      <View style={styles.contentPlaceholder}>
        <Icon name="checkmark-circle-outline" size={48} color="#28A745" />{' '}
        <Text style={styles.contentPlaceholderTitle}>
          Congratulations! You've Qualified!
        </Text>
        <Text style={styles.contentPlaceholderText}>
          We have successfully **verified your documents** and essential
          qualifications. Your credit score, income stability, and supporting
          details all meet the necessary criteria. You are now **eligible to
          proceed** to the next exciting stage of your application.
        </Text>
      </View>
    );
  }

  return null;
};

// --- Styling for the Success Message ---
const styles = StyleSheet.create({
  // Kept all original styles
  cardContainer: {
    padding: 24,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginVertical: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  iconText: {
    fontSize: 30,
    lineHeight: 30,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#155724',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6b7280',
    marginTop: 5,
    textAlign: 'justify',
  },
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

export default Qualified;
