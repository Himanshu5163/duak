import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';

const documentCategories = [
  { id: 1, name: 'Passport' },
  { id: 2, name: 'Driver License' },
  { id: 3, name: 'National ID' },
  { id: 4, name: 'Utility Bill' },
  { id: 5, name: 'Other' },
];
const oldDocuments = [
  {
    id: '1',
    fileName: 'ID_Proof.jpg',
    category: 'Identity',
    uri: 'data:image/jpeg;base64,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',
  },
  {
    id: '2',
    fileName: 'Utility_Bill.png',
    category: 'Address',
    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfHil8z6Qa3v2cG337JqW0-9Qh1jc_4jOY6A&s',
  },
  {
    id: '2',
    fileName: 'Utility_Bill.png',
    category: 'Address',
    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfHil8z6Qa3v2cG337JqW0-9Qh1jc_4jOY6A&s',
  },
  {
    id: '2',
    fileName: 'Utility_Bill.png',
    category: 'Address',
    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfHil8z6Qa3v2cG337JqW0-9Qh1jc_4jOY6A&s',
  },
  // Add more old documents as needed
];
const DocumentUploader = ({ onDocumentsChange, selectedStep }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { user } = useSelector(state => state.auth);

  // Log the onDocumentsChange prop for debugging
  console.log('onDocumentsChange prop:', onDocumentsChange);

  const requestCameraAndStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Determine permissions based on Android version
        const permissions = [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          // For Android 13+ (API 33), use READ_MEDIA_IMAGES
          Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ];

        const granted = await PermissionsAndroid.requestMultiple(permissions);

        const cameraGranted =
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
          PermissionsAndroid.RESULTS.GRANTED;
        const storageGranted =
          Platform.Version >= 33
            ? granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED
            : granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
              PermissionsAndroid.RESULTS.GRANTED;

        if (cameraGranted && storageGranted) {
          console.log('All permissions granted.');
          return true;
        } else {
          // Check if permissions are permanently denied
          const cameraDeniedForever =
            granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
            PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          const storageDeniedForever =
            Platform.Version >= 33
              ? granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
                PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
              : granted[
                  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                ] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;

          if (cameraDeniedForever || storageDeniedForever) {
            Alert.alert(
              'Permission Required',
              'Camera and storage permissions are permanently denied. Please enable them in your app settings to proceed.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
          } else {
            Alert.alert(
              'Permission Denied',
              'Camera and storage access are required to upload documents.',
            );
          }
          return false;
        }
      } catch (err) {
        console.warn('Permission request error:', err);
        Alert.alert('Error', 'Failed to request permissions.');
        return false;
      }
    } else if (Platform.OS === 'ios') {
      // For iOS, check permissions using react-native-image-picker
      try {
        const cameraResult = await launchCamera(
          { mediaType: 'photo', saveToPhotos: false },
          () => {},
        );
        const galleryResult = await launchImageLibrary(
          { mediaType: 'photo' },
          () => {},
        );

        if (
          cameraResult.errorCode === 'permission' ||
          galleryResult.errorCode === 'permission'
        ) {
          Alert.alert(
            'Permission Required',
            'Camera or photo library access is required. Please enable permissions in your app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
          return false;
        }
        return true;
      } catch (err) {
        console.warn('iOS permission check error:', err);
        return false;
      }
    }
    return true;
  };

  const handlePickerResponse = response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.error(
        'ImagePicker Error:',
        response.errorCode,
        response.errorMessage,
      );
      if (response.errorCode === 'permission') {
        Alert.alert(
          'Permission Denied',
          'Camera or gallery access is required. Please enable permissions in your app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
      } else {
        Alert.alert(
          'Error',
          `Failed to select image: ${response.errorMessage}`,
        );
      }
    } else if (response.assets && response.assets.length > 0) {
      const newFile = response.assets[0];
      const fileData = {
        uri: newFile.uri,
        type: newFile.type || 'image/jpeg',
        name: newFile.fileName || `document_${Date.now()}.jpg`,
        category: selectedCategory,
        mobile: user.mobile,
        key: 'document',
      };
      const updatedDocuments = [...documents, fileData];
      setDocuments(updatedDocuments);
      // Check if onDocumentsChange is a function before calling it
      if (typeof onDocumentsChange === 'function') {
        onDocumentsChange(updatedDocuments);
      } else {
        console.warn('onDocumentsChange is not a function:', onDocumentsChange);
      }
      setSelectedCategory('');
    } else {
      console.warn('No assets returned from image picker');
      Alert.alert('Error', 'No image was selected.');
    }
  };

  const showImagePickerOptions = async () => {
    if (!selectedCategory) {
      Alert.alert(
        'Category Required',
        'Please select a document category before uploading.',
      );
      return;
    }

    const hasPermission = await requestCameraAndStoragePermission();
    if (!hasPermission) {
      return;
    }

    Alert.alert(
      'Select Image',
      'Choose a method to upload your document',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Upload cancelled'),
          style: 'cancel',
        },
        {
          text: 'Take Photo',
          onPress: () =>
            launchCamera(
              { mediaType: 'photo', saveToPhotos: true },
              handlePickerResponse,
            ),
        },
        {
          text: 'Choose from Gallery',
          onPress: () =>
            launchImageLibrary({ mediaType: 'photo' }, handlePickerResponse),
        },
      ],
      { cancelable: true },
    );
  };

  const handleRemoveDocument = indexToRemove => {
    const updatedDocuments = documents.filter(
      (_, index) => index !== indexToRemove,
    );
    setDocuments(updatedDocuments);
    // Check if onDocumentsChange is a function before calling it
    if (typeof onDocumentsChange === 'function') {
      onDocumentsChange(updatedDocuments);
    } else {
      console.warn('onDocumentsChange is not a function:', onDocumentsChange);
    }
  };

  const renderDocumentItem = ({ item, index }) => (
    <View style={styles.documentItem}>
      <Image source={{ uri: item.uri }} style={styles.documentImage} />
      <View style={styles.documentInfo}>
        <Text style={styles.documentCategory}>{item.category}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveDocument(index)}
      >
        <Icon name="times-circle" size={24} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  const renderOldDocumentItem = ({ item }) => (
    <View style={styles.oldDocumentItem}>
      <Image
        source={{ uri: item.uri }}
        style={styles.oldDocumentImage}
        resizeMode="cover"
      />
      <View style={styles.oldDocumentInfo}>
        <Text style={styles.oldDocumentFileName} numberOfLines={1}>
          {item.fileName}
        </Text>
      </View>
    </View>
  );

  if (!selectedStep || !selectedStep.status) {
    return null;
  }
  if (selectedStep.status === 'pending') {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Upload Documents</Text>

        {oldDocuments.length > 0 && (
          <View style={styles.uploadedContainer}>
            <Text style={styles.uploadedTitle}>
              Previously Submitted Documents:
            </Text>
            <FlatList
              data={oldDocuments}
              renderItem={renderOldDocumentItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.documentList}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Document Category *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={itemValue => setSelectedCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value="" />
              {documentCategories.map(cat => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
              ))}
            </Picker>
          </View>
        </View>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={showImagePickerOptions}
        >
          <LinearGradient
            colors={['#007BFF', '#28A745']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.uploadButtonGradient}
          >
            <Icon
              name="upload"
              size={20}
              color="#fff"
              style={styles.uploadIcon}
            />
            <Text style={styles.uploadButtonText}>Select Document</Text>
          </LinearGradient>
        </TouchableOpacity>
        {documents.length > 0 && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Selected Files:</Text>
            <FlatList
              data={documents}
              renderItem={renderDocumentItem}
              keyExtractor={(item, index) => `doc-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.documentList}
            />
          </View>
        )}
      </View>
    );
  } else if (selectedStep.status === 'in-progress') {
    return (
      <View style={styles.contentPlaceholder}>
        <Icon name="hourglass-half" size={48} color="#FFA500" />{' '}
        <Text style={styles.contentPlaceholderTitle}>
          Documents Under Active Review
        </Text>
        <Text style={styles.contentPlaceholderText}>
          Your uploaded documents are currently being reviewed by our
          administrative team for clarity and completeness. We will notify you
          immediately if any revisions or additional items are required.
        </Text>
      </View>
    );
  } else if (selectedStep.status === 'completed') {
    return (
      <View style={styles.contentPlaceholder}>
        <Icon name="check-square" size={48} color="#28A745" />{' '}
        <Text style={styles.contentPlaceholderTitle}>
          Documents Accepted and Verified
        </Text>
        <Text style={styles.contentPlaceholderText}>
          All required documents have been successfully verified and accepted!
          You have cleared this important compliance step and can now move
          forward with your application.
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  picker: {
    height: 50,
    color: '#111827',
  },
  uploadButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  uploadIcon: {
    marginRight: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    marginTop: 20,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  documentList: {
    alignItems: 'flex-start',
    marginTop:10
  },
  documentItem: {
    position: 'relative',
    marginRight: 15,
    alignItems: 'center',
    width: 80,
  },
  documentImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  documentInfo: {
    marginTop: 5,
  },
  documentCategory: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 2,
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
  oldDocumentItem: {
    marginRight: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
    width: 120, // Fixed width for clear image preview
    height: 135, // Fixed height
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  oldDocumentImage: {
    width: '100%',
    height: 100, // Half the height of the item
  },
  oldDocumentInfo: {
    padding: 8,
    alignItems: 'center',
  },
  oldDocumentFileName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  oldDocumentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  oldDocumentStatusText: {
    fontSize: 11,
    color: '#28A745',
    marginLeft: 4,
    fontWeight: '600',
  },
});

export default DocumentUploader;
