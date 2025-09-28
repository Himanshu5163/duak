import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { getToken } from '../../utils/storage';
import { Strings } from '../../theme/Strings';
import { fetchStates } from '../../redux/stateSlice';
import { fetchDistricts, clearDistricts } from '../../redux/districtSlice';
import { fetchCities, clearCities } from '../../redux/citySlice';
import { fetchLeadSources } from '../../redux/leadSourceSlice';

const LeadAdd = ({
  label = 'Add Lead',
  leadInfo = null,
  onLeadAdded,
  selectedStep,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { states, status: stateStatus } = useSelector(state => state.state);
  const { districts } = useSelector(state => state.district);
  const { cities } = useSelector(state => state.city);
  const { leadSources } = useSelector(state => state.leadSource);

  const [formData, setFormData] = useState({
    email: leadInfo?.email || '',
    address: leadInfo?.address || '',
    state_id: leadInfo?.state_id || '',
    district_id: leadInfo?.district_id || '',
    city_id: leadInfo?.city_id || '',
    sub_district_id: leadInfo?.sub_district_id || '',
    zip_code: leadInfo?.zip_code || '',
    lead_source_id: leadInfo?.lead_source_id || '',
    notes: leadInfo?.notes || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = leadInfo && leadInfo.id;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};
    const requiredFields = [
      'email',
      'state_id',
      'district_id',
      'city_id',
      'lead_source_id',
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())} is required`;
        valid = false;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    if (
      formData.zip_code &&
      formData.zip_code &&
      !/^\d{5,6}$/.test(formData.zip_code)
    ) {
      newErrors.zip_code = 'Zip code must be 5 or 6 digits';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const token = await getToken();
        if (token) {
          dispatch(fetchStates({ API_URL: Strings.APP_BASE_URL, token }));
          dispatch(fetchLeadSources({ API_URL: Strings.APP_BASE_URL, token }));
        }
      };
      loadData();
    }, [dispatch]),
  );

  useFocusEffect(
    useCallback(() => {
      const loadDistricts = async () => {
        if (!formData.state_id) {
          dispatch(clearDistricts());
          dispatch(clearCities());
          setFormData(prev => ({ ...prev, district_id: '', city_id: '' }));
          return;
        }
        const token = await getToken();
        dispatch(
          fetchDistricts({
            API_URL: Strings.APP_BASE_URL,
            token,
            state_id: formData.state_id,
          }),
        );
        if (!isEditing) {
          setFormData(prev => ({ ...prev, district_id: '', city_id: '' }));
          dispatch(clearCities());
        }
      };
      loadDistricts();
    }, [dispatch, formData.state_id, isEditing]),
  );

  useFocusEffect(
    useCallback(() => {
      const loadCities = async () => {
        if (!formData.district_id) {
          dispatch(clearCities());
          setFormData(prev => ({ ...prev, city_id: '' }));
          return;
        }
        const token = await getToken();
        dispatch(
          fetchCities({
            API_URL: Strings.APP_BASE_URL,
            token,
            district_id: formData.district_id,
          }),
        );
        if (!isEditing) {
          setFormData(prev => ({ ...prev, city_id: '' }));
        }
      };
      loadCities();
    }, [dispatch, formData.district_id, isEditing]),
  );

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const token = await getToken();
      const payload = new FormData();
      payload.append('updated_by', user.id);
      payload.append('client_id', user.id);
      payload.append('role_id', user.role_id);
      Object.keys(formData).forEach(key => {
        if (formData[key]) payload.append(key, formData[key]);
      });

      let apiUrl = '';
      let method = '';
      let successMessage = '';

      if (isEditing) {
        apiUrl = `${Strings.APP_BASE_URL}/lead-update/${user.id}`;
        method = 'POST';
        successMessage = 'Lead updated successfully';
      } else {
        apiUrl = `${Strings.APP_BASE_URL}/lead-create`;
        method = 'POST';
        successMessage = 'Lead created successfully';
      }

      const response = await fetch(apiUrl, {
        method: method,
        body: payload,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Lead response data:', data);
        if (!isEditing) {
          setFormData({
            email: '',
            address: '',
            state_id: '',
            district_id: '',
            city_id: '',
            zip_code: '',
            lead_source_id: '',
            notes: '',
          });
          dispatch(clearDistricts());
          dispatch(clearCities());
        }
        if (onLeadAdded) {
          onLeadAdded(); // Assuming the API returns the updated lead
        }
      } else {
        if (data.errors) setErrors(data.errors);
        else Alert.alert('Error', data.message || 'Failed to process lead');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to process lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedStep.status === 'pending') {
    return (
      <View style={styles.formContainer}>
        {/* <Text style={styles.sectionTitle}>{label}</Text> */}

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email *</Text>
          <TextInput
            style={[styles.textInput, errors.email && styles.errorBorder]}
            value={formData.email}
            onChangeText={v => handleInputChange('email', v)}
            placeholder="Enter Email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* State */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>State *</Text>
          <View style={styles.pickerContainer}>
            {stateStatus === 'loading' ? (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color="#2C3E50" />
              </View>
            ) : (
              <Picker
                selectedValue={formData.state_id}
                onValueChange={v => handleInputChange('state_id', v)}
                style={[styles.picker, errors.state_id && styles.errorBorder]}
              >
                <Picker.Item label="Select State" value="" />
                {states.map(s => (
                  <Picker.Item key={s.id} label={s.name} value={s.id} />
                ))}
              </Picker>
            )}
          </View>
          {errors.state_id && (
            <Text style={styles.errorText}>{errors.state_id}</Text>
          )}
        </View>

        {/* District */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>District *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.district_id}
              onValueChange={v => handleInputChange('district_id', v)}
              style={[styles.picker, errors.district_id && styles.errorBorder]}
            >
              <Picker.Item label="Select District" value="" />
              {districts.map(d => (
                <Picker.Item key={d.id} label={d.name} value={d.id} />
              ))}
            </Picker>
          </View>
          {errors.district_id && (
            <Text style={styles.errorText}>{errors.district_id}</Text>
          )}
        </View>

        {/* City */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>City *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.city_id}
              onValueChange={v => handleInputChange('city_id', v)}
              style={[styles.picker, errors.city_id && styles.errorBorder]}
            >
              <Picker.Item label="Select City" value="" />
              {cities.map(c => (
                <Picker.Item key={c.id} label={c.name} value={c.id} />
              ))}
            </Picker>
          </View>
          {errors.city_id && (
            <Text style={styles.errorText}>{errors.city_id}</Text>
          )}
        </View>

        {/* Zip Code */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Zip Code *</Text>
          <TextInput
            style={[styles.textInput, errors.zip_code && styles.errorBorder]}
            value={formData.zip_code}
            onChangeText={v => handleInputChange('zip_code', v)}
            placeholder="Enter Zip Code"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          {errors.zip_code && (
            <Text style={styles.errorText}>{errors.zip_code}</Text>
          )}
        </View>

        {/* Lead Source */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Lead Source *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.lead_source_id}
              onValueChange={v => handleInputChange('lead_source_id', v)}
              style={[
                styles.picker,
                errors.lead_source_id && styles.errorBorder,
              ]}
            >
              <Picker.Item label="Select Source" value="" />
              {leadSources.map(ls => (
                <Picker.Item key={ls.id} label={ls.name} value={ls.id} />
              ))}
            </Picker>
          </View>
          {errors.lead_source_id && (
            <Text style={styles.errorText}>{errors.lead_source_id}</Text>
          )}
        </View>

        {/* Address */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Address</Text>
          <TextInput
            style={[
              styles.textInput,
              errors.address && styles.errorBorder,
              { height: 80 },
            ]}
            value={formData.address}
            onChangeText={v => handleInputChange('address', v)}
            placeholder="Enter Address"
            placeholderTextColor="#9CA3AF"
            multiline
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Notes</Text>
          <TextInput
            style={[styles.textInput, { height: 100 }]}
            value={formData.notes}
            onChangeText={v => handleInputChange('notes', v)}
            placeholder="Enter Notes"
            placeholderTextColor="#9CA3AF"
            multiline
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
          <LinearGradient
            colors={['#007BFF', '#28A745']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Update' : 'Submit'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  } else if (selectedStep.status === 'in-progress') {
    return (
      <View style={styles.contentPlaceholder}>
        <Icon name="hourglass-outline" size={48} color="#FFA500" /> // hourglass
        for pending
        <Text style={styles.contentPlaceholderTitle}>Client Information</Text>
        <Text style={styles.contentPlaceholderText}>
          The information you have provided for client information is currently
          under verification by the admin. You will be notified once the
          verification is complete.
        </Text>
      </View>
    );
  } else if (selectedStep.status === 'completed') {
    return (
      <View style={styles.contentPlaceholder}>
        <Icon name="checkmark-circle-outline" size={48} color="#28A745" />{' '}
        {/* checkmark for completed */}
        <Text style={styles.contentPlaceholderTitle}>Client Information</Text>
        <Text style={styles.contentPlaceholderText}>
          Your client information has been successfully verified by the admin.
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  formContainer: {},
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
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
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#111827',
  },
  loadingOverlay: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  errorBorder: {
    borderColor: '#EF4444',
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
  },
  contentPlaceholderText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LeadAdd;
