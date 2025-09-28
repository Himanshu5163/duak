import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Qualified = () => {
  const SuccessIcon = () => (
    <View style={styles.iconContainer}>
      {/* <Text style={styles.iconText}>🎉</Text>  */}
      <Icon name="check-decagram" size={35} color="#388E3C" />
    </View>
  );

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <SuccessIcon />
        <Text style={styles.stepTitle}>Congratulations! You've Qualified!</Text>
      </View>
      <Text style={styles.stepDescription}>
        We have successfully **verified your documents** and essential
        qualifications. Your credit score, income stability, and supporting
        details all meet the necessary criteria. You are now eligible to proceed
        to the next exciting stage of your application.
      </Text>
    </View>
  );
};

// --- Styling for the Success Message ---
const styles = StyleSheet.create({
  cardContainer: {
    padding: 24,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    // shadowColor: '#155724',

    marginVertical: 12,
  },
  header: {
    // flexDirection: 'row',
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
});

export default Qualified;
