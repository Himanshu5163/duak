import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Strings } from '../../theme/Strings';
import { getToken } from '../../utils/storage';
import { useSelector } from 'react-redux';

const SupportTicketAdd = () => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
  });
  const { user } = useSelector(state => state.auth);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [field]: '',
    }));
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
      valid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]); // store first selected image
      }
    });
  };

 const handleSubmit = async () => {
  if (!validateForm()) return;
  setIsSubmitting(true);
  try {
    const token = await getToken();
    const formDataToSend = new FormData();
    formDataToSend.append('client_id', user.id); // replace with real client id
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('description', formData.description);

    if (selectedImage) {
      formDataToSend.append('attachment', {
        uri: selectedImage.uri,
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName || `upload_${Date.now()}.jpg`,
      });
    }

    // console.log('image',formDataToSend);

     const response = await fetch(`${Strings.APP_BASE_URL}/ticket-generate`, {
      method: 'POST',
      body: formDataToSend,
      headers: {
        'Authorization': `Bearer ${token}`,
        // don't manually set Content-Type for FormData, RN will set boundary automatically
      },
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert('Ticket Generated');
      setFormData({ subject: '', description: '' });
      setSelectedImage(null);
    } else {
      if (data.errors) {
        setErrors(data.errors);
      }
    }
  } catch (error) {
    console.error('Error submitting ticket:', error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Ticket Details</Text>

          {/* Subject */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject *</Text>
            <TextInput
              style={[styles.textInput, errors.subject && styles.errorBorder]}
              value={formData.subject}
              onChangeText={(value) => handleInputChange('subject', value)}
              placeholder="Brief description of your issue"
              placeholderTextColor="#9CA3AF"
            />
            {errors.subject ? <Text style={styles.errorText}>{errors.subject}</Text> : null}
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea, errors.description && styles.errorBorder]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Please provide detailed information about your issue"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{formData.description.length}/1000</Text>
            {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
          </View>

          {/* Attach Image */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Attachment</Text>
            <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
              <Text style={styles.attachButtonText}>📎 Choose Image</Text>
            </TouchableOpacity>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.previewImage}
              />
            )}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Ticket</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { flex: 1, padding: 16 },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textArea: { height: 120 },
  characterCount: { fontSize: 12, color: '#6B7280', textAlign: 'right', marginTop: 4 },
  submitSection: { paddingVertical: 20 },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: { backgroundColor: '#9CA3AF' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 },
  errorBorder: { borderColor: 'red' },
  attachButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  attachButtonText: { fontSize: 14, color: '#111827' },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
});

export default SupportTicketAdd;
