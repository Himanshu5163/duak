import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// --- Dummy Data ---
const DUMMY_DOCUMENTS = [
  {
    id: '1',
    name: 'Final Loan Agreement',
    url: 'https://example.com/loan-agreement.pdf',
  },
  {
    id: '2',
    name: 'Payment Schedule Breakdown',
    url: 'https://example.com/payment-schedule.pdf',
  },
  {
    id: '3',
    name: 'Insurance Policy Terms',
    url: 'https://example.com/policy-terms.pdf',
  },
  {
    id: '4',
    name: 'System Installation Checklist',
    url: 'https://example.com/installation-checklist.pdf',
  },
];

const DownloadDocument = () => {
  // Function to handle the download action (simplified)
  const handleDownload = (docName, docUrl) => {
    // In a real app, this would trigger actual file download or deep linking.
    Alert.alert(
      'Download Action',
      `Initiating download for '${docName}'. (URL: ${docUrl})`,
      [{ text: 'OK' }],
    );
  };

  // Helper to render the fixed Download button
  const renderDownloadButton = doc => (
    <TouchableOpacity
      style={styles.actionContainer}
      onPress={() => handleDownload(doc.name, doc.url)}
      activeOpacity={0.7}
    >
      <Icon name="download" size={20} color="#fff" />
      {/* <Text style={styles.actionText}>Download</Text> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* --- Document List --- */}
      {DUMMY_DOCUMENTS.map((doc, index) => (
        <View key={doc.id} style={[
            styles.documentCard, 
            // Add a bottom border to all items except the last one
            index < DUMMY_DOCUMENTS.length - 1 && styles.cardSeparator 
          ]}>
          {/* File Icon (PDF) */}
          <Icon
            name="file-pdf-box"
            size={28}
            color="#dc3545"
            style={styles.fileIcon}
          />

          <View style={styles.infoContainer}>
            <Text style={styles.documentName} numberOfLines={2}>
              {doc.name}
            </Text>
          </View>

          {/* Fixed Download Button */}
          {renderDownloadButton(doc)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 15,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    marginVertical: 8,
  },
  fileIcon: {
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  documentSize: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  // --- Download Button Styling ---
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff', // Primary Blue for the action button
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
   cardSeparator: {
    marginBottom: 0, // Reset margin so the border is tight
    paddingBottom: 15, // Maintain internal padding
    borderBottomWidth: 1, 
    borderBottomColor: '#d6cacaff', // Light gray line
  },
});

export default DownloadDocument;
