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

const documentCategories = [
  { id: 1, name: 'Passport' },
  { id: 2, name: 'Driver License' },
  { id: 3, name: 'National ID' },
  { id: 4, name: 'Utility Bill' },
  { id: 5, name: 'Other' },
];

const DocumentUploader = ({ onDocumentsChange }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

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

        const cameraGranted = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;
        const storageGranted =
          Platform.Version >= 33
            ? granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED
            : granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;

        if (cameraGranted && storageGranted) {
          console.log('All permissions granted.');
          return true;
        } else {
          // Check if permissions are permanently denied
          const cameraDeniedForever = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          const storageDeniedForever =
            Platform.Version >= 33
              ? granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
              : granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;

          if (cameraDeniedForever || storageDeniedForever) {
            Alert.alert(
              'Permission Required',
              'Camera and storage permissions are permanently denied. Please enable them in your app settings to proceed.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
              ]
            );
          } else {
            Alert.alert(
              'Permission Denied',
              'Camera and storage access are required to upload documents.'
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
        const cameraResult = await launchCamera({ mediaType: 'photo', saveToPhotos: false }, () => {});
        const galleryResult = await launchImageLibrary({ mediaType: 'photo' }, () => {});

        if (cameraResult.errorCode === 'permission' || galleryResult.errorCode === 'permission') {
          Alert.alert(
            'Permission Required',
            'Camera or photo library access is required. Please enable permissions in your app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
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

  const handlePickerResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.error('ImagePicker Error:', response.errorCode, response.errorMessage);
      if (response.errorCode === 'permission') {
        Alert.alert(
          'Permission Denied',
          'Camera or gallery access is required. Please enable permissions in your app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      } else {
        Alert.alert('Error', `Failed to select image: ${response.errorMessage}`);
      }
    } else if (response.assets && response.assets.length > 0) {
      const newFile = response.assets[0];
      const fileData = {
        uri: newFile.uri,
        type: newFile.type || 'image/jpeg',
        name: newFile.fileName || `document_${Date.now()}.jpg`,
        category: selectedCategory,
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
      Alert.alert('Category Required', 'Please select a document category before uploading.');
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
          onPress: () => launchCamera({ mediaType: 'photo', saveToPhotos: true }, handlePickerResponse),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => launchImageLibrary({ mediaType: 'photo' }, handlePickerResponse),
        },
      ],
      { cancelable: true }
    );
  };

  const handleRemoveDocument = (indexToRemove) => {
    const updatedDocuments = documents.filter((_, index) => index !== indexToRemove);
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Documents</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Document Category *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Category" value="" />
            {documentCategories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
            ))}
          </Picker>
        </View>
      </View>
      <TouchableOpacity style={styles.uploadButton} onPress={showImagePickerOptions}>
        <LinearGradient
          colors={['#007BFF', '#28A745']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.uploadButtonGradient}
        >
          <Icon name="upload" size={20} color="#fff" style={styles.uploadIcon} />
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
});

export default DocumentUploader;