import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MaterialDispatch = ({ selectedStep }) => {
   if (!selectedStep || !selectedStep.status) {
     return null;
   }
 
   if (selectedStep.status === 'pending') {
     return (
       <View style={styles.contentPlaceholder}>
         <Icon name="alert-circle-outline" size={48} color="#EF4444" />{' '}
         <Text style={styles.contentPlaceholderTitle}>Dispatch Pending</Text>
         <Text style={styles.contentPlaceholderText}>
          The materials are packed and ready, awaiting carrier pickup for dispatch.
         </Text>
       </View>
     );
   } else if (selectedStep.status === 'in-progress') {
     return (
       <View style={styles.contentPlaceholder}>
         <Icon name="hourglass-outline" size={48} color="#FFA500" />{' '}
         <Text style={styles.contentPlaceholderTitle}>Out For Delivery</Text>
         <Text style={styles.contentPlaceholderText}>
           Your materials have been dispatched and are currently en route to the delivery location.
         </Text>
       </View>
     );
   } else if (selectedStep.status === 'completed') {
     return (
       <View style={styles.contentPlaceholder}>
         <Icon name="checkmark-circle-outline" size={48} color="#28A745" />{' '}
         <Text style={styles.contentPlaceholderTitle}>Dispatch Delivered</Text>
         <Text style={styles.contentPlaceholderText}>
           The materials have been successfully delivered and signed for at the destination.
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

export default MaterialDispatch;