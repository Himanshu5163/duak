import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NetMetering = ({ selectedStep }) => {
    if (!selectedStep || !selectedStep.status) {
         return null;
       }
     
       if (selectedStep.status === 'pending') {
         return (
           <View style={styles.contentPlaceholder}>
             <Icon name="alert-circle-outline" size={48} color="#EF4444" />{' '}
             <Text style={styles.contentPlaceholderTitle}>Net Metering Application Preparation</Text>
             <Text style={styles.contentPlaceholderText}>
              We are currently preparing and submitting all necessary documentation to the utility company for your Net Metering agreement. This phase usually takes 1-2 business days.
             </Text>
           </View>
         );
       } else if (selectedStep.status === 'in-progress') {
         return (
           <View style={styles.contentPlaceholder}>
             <Icon name="hourglass-outline" size={48} color="#FFA500" />{' '}
             <Text style={styles.contentPlaceholderTitle}>Awaiting Utility Company Approval</Text>
             <Text style={styles.contentPlaceholderText}>
              Your Net Metering application is now under review by the utility provider. This phase is handled entirely by the utility and may take **2-4 weeks** for final approval.
             </Text>
           </View>
         );
       } else if (selectedStep.status === 'completed') {
         return (
           <View style={styles.contentPlaceholder}>
             <Icon name="checkmark-circle-outline" size={48} color="#28A745" />{' '}
             <Text style={styles.contentPlaceholderTitle}>Net Metering Approved & Commissioned</Text>
             <Text style={styles.contentPlaceholderText}>
               Congratulations! Your Net Metering has been officially **approved and commissioned** by the utility company. Your solar system is now connected and generating grid credit!
             </Text>
           </View>
         );
       }
     
       return null;
}

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

export default NetMetering;