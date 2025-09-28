import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Subsidy = ({ selectedStep }) => {
  if (!selectedStep || !selectedStep.status) {
    return null;
  }

  if (selectedStep.status === 'pending') {
    return (
      <View style={styles.contentPlaceholder}>
        <Icon name="alert-circle-outline" size={48} color="#EF4444" />{' '}
        <Text style={styles.contentPlaceholderTitle}>
          Subsidy Application Preparation
        </Text>
        <Text style={styles.contentPlaceholderText}>
          We are preparing and submitting your solar subsidy application to the
          relevant government agency. This initial documentation phase usually
          takes 1-3 business days.
        </Text>
      </View>
    );
  } else if (selectedStep.status === 'in-progress') {
    return (
      <View style={styles.contentPlaceholder}>
        <Icon name="hourglass-outline" size={48} color="#FFA500" />{' '}
        <Text style={styles.contentPlaceholderTitle}>
          Government Review in Progress
        </Text>
        <Text style={styles.contentPlaceholderText}>
          Your subsidy application is now officially under review by the
          government authority. This is a crucial administrative step that can
          take **4-8 weeks** depending on processing volumes.
        </Text>
      </View>
    );
  } else if (selectedStep.status === 'completed') {
    return (
      <View style={styles.contentPlaceholder}>
        <Icon name="checkmark-circle-outline" size={48} color="#28A745" />{' '}
        <Text style={styles.contentPlaceholderTitle}>
          Subsidy Approved and Disbursed
        </Text>
        <Text style={styles.contentPlaceholderText}>
          Fantastic news! Your solar subsidy has been officially **approved**
          and the funds have been disbursed. This completes the financial
          incentive step of your project.
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

export default Subsidy;
