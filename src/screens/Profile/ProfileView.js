import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Strings } from '../../theme/Strings';

const ProfileView = () => {
  const [userInfo, setUserInfo] = useState({
    // Basic Info
    name: 'Demo User',
    staffId: '201',
    rollNo: 'A001',
    class: '10th',
    section: 'Section A',
    phone: '1234567890',
    emergencyContactNo: 'N/A',
    email: 'demo@nlet.in',
    gender: 'Male',
    dateOfBirth: '2023-05-31',
    fatherName: 'N/A',
    motherName: 'N/A',
    maritalStatus: 'N/A',
    qualification: 'N/A',

    // Work/Academic Info
    role: 'Teacher, Admin',
    designation: 'N/A',
    department: 'N/A',
    workExperience: 'N/A',
    admissionDate: '2023-04-01',
    dateOfJoining: 'N/A',

    // Address Info
    currentAddress: 'N/A',
    permanentAddress: 'N/A',
    location: 'N/A',

    // Employment Info
    epfNo: 'N/A',
    basicSalary: '30000',
    contractType: 'N/A',
    workShift: 'N/A',

    // Bank Details
    bankAccountTitle: 'N/A',
    bankName: 'N/A',
    bankBranchName: 'N/A',
    bankAccountNumber: 'N/A',
    ifscCode: 'N/A',
    secondaryBankAccountNumber: 'null',
    test: 'null',

    // Parent Info (for students)
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 98765 12345',
    bloodGroup: 'O+',
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Profile'); // Profile or Documents

  const openEditModal = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue);
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    if (!editValue.trim()) {
      Alert.alert('Error', 'Field cannot be empty');
      return;
    }

    setUserInfo(prev => ({
      ...prev,
      [editField]: editValue,
    }));
    setEditModalVisible(false);
    setEditField('');
    setEditValue('');
  };

  const getFieldLabel = field => {
    const labels = {
      name: 'Full Name',
      staffId: 'Staff ID',
      phone: 'Phone Number',
      emergencyContactNo: 'Emergency Contact No.',
      email: 'Email Address',
      gender: 'Gender',
      dateOfBirth: 'Date of Birth',
      fatherName: 'Father Name',
      motherName: 'Mother Name',
      maritalStatus: 'Marital Status',
      qualification: 'Qualification',
      role: 'Role',
      designation: 'Designation',
      department: 'Department',
      workExperience: 'Work Experience',
      dateOfJoining: 'Date of Joining',
      currentAddress: 'Current Address',
      permanentAddress: 'Permanent Address',
      location: 'Location',
      epfNo: 'EPF No.',
      basicSalary: 'Basic Salary',
      contractType: 'Contract Type',
      workShift: 'Work Shift',
      bankAccountTitle: 'Bank Account Title',
      bankName: 'Bank Name',
      bankBranchName: 'Bank Branch Name',
      bankAccountNumber: 'Bank Account Number',
      ifscCode: 'IFSC Code',
      secondaryBankAccountNumber: 'Secondary Bank Account Number',
      test: 'Test',
      parentName: 'Parent Name',
      parentPhone: 'Parent Phone',
      bloodGroup: 'Blood Group',
    };
    return labels[field] || field;
  };

  const formatDate = dateString => {
    if (dateString === 'N/A' || !dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const { user } = useSelector(state => state.auth);
  const [profileDetail, setProfileDetail] = useState([]);
  useEffect(() => {
    if (user) {
      fetchProfileDetail();
    }
  }, [user]);

  const fetchProfileDetail = async () => {
    if (!user?.user_id) {
      Alert.alert('Missing Data', 'Required user or student ID is missing.');
      return;
    }

    try {
      const bodyData = {
        id: user.user_id,
        role_id: user.role_id,
      };

      const response = await fetch(`${Strings.APP_BASE_URL}/getProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const rawText = await response.text();
      console.log('Raw response:', rawText);

      try {
        const result = JSON.parse(rawText);

        if (result.success) {
          setProfileDetail(result.data);
        } else {
          Alert.alert(
            'Fetch Failed',
            result.message || 'Unable to fetch student details.',
          );
        }
      } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError);
        Alert.alert(
          'Error',
          'Invalid response from server:\n' + rawText.slice(0, 300),
        );
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };
  //Alert.alert('profile:', JSON.stringify(profileDetail, null, 2));
  const ProfileItem = ({ label, value, editable = false, field = '' }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileRow}>
        <Text style={styles.profileLabel}>{label}</Text>
        <View style={styles.profileValueContainer}>
          <Text style={styles.profileValue}>{value}</Text>
          {editable && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => openEditModal(field, value)}
            >
              <View style={styles.editIcon}>
                <Image
                  source={require('../../theme/asserts/icon/pencil.png')} // optional fallback icon
                  style={{ width: 18, height: 18 }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderProfileContent = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Basic Information */}
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <ProfileItem
            label="User Name"
            value={profileDetail.userName}
            editable={false}
            field="staffId"
          />
          <ProfileItem
            label="Phone"
            value={profileDetail.mobile}
            editable={false}
            field="phone"
          />
          <ProfileItem
            label="Role"
            value={profileDetail.role_name}
            editable={false}
            field="role"
          />
          {/* <ProfileItem
            label="Emergency Contact No."
            value={userInfo.emergencyContactNo}
            editable={false}
            field="emergencyContactNo"
          /> */}
          <ProfileItem
            label="Email"
            value={profileDetail.email}
            editable={false}
            field="email"
          />
          <ProfileItem
            label="Gender"
            value={profileDetail.gender_name}
            editable={false}
            field="gender"
          />
          <ProfileItem
            label="Date Of Birth"
            value={profileDetail.dob}
            editable={false}
            field="dateOfBirth"
          />
          <ProfileItem
            label="Father Name"
            value={profileDetail.father_name}
            editable={false}
            field="fatherName"
          />
          <ProfileItem
            label="Mother Name"
            value={profileDetail.mother_name}
            editable={false}
            field="motherName"
          />
          <ProfileItem
            label="Country"
            value={profileDetail.country_name}
            editable={false}
            field="motherName"
          />
          <ProfileItem
            label="State"
            value={profileDetail.state_name}
            editable={false}
            field="motherName"
          />
          <ProfileItem
            label="City"
            value={profileDetail.city_name}
            editable={false}
            field="motherName"
          />
          {/* <ProfileItem
            label="Marital Status"
            value={userInfo.maritalStatus}
            editable={false}
            field="maritalStatus"
          /> */}
          {/* <ProfileItem
            label="Qualification"
            value={userInfo.qualification}
            editable={false}
            field="qualification"
          /> */}
          {/* <ProfileItem
            label="Designation"
            value={userInfo.designation}
            editable={false}
            field="designation"
          /> */}
          {/* <ProfileItem
            label="Department"
            value={userInfo.department}
            editable={false}
            field="department"
          /> */}
          {/* <ProfileItem
            label="Work Experience"
            value={userInfo.workExperience}
            editable={false}
            field="workExperience"
          /> */}
          {/* <ProfileItem
            label="Current Address"
            value={userInfo.currentAddress}
            editable={false}
            field="currentAddress"
          /> */}
          <ProfileItem
            label="Address"
            value={profileDetail.address}
            editable={false}
            field="permanentAddress"
          />
          {/* <ProfileItem
            label="EPF No."
            value={userInfo.epfNo}
            editable={false}
            field="epfNo"
          /> */}
          {/* <ProfileItem
            label="Basic Salary"
            value={userInfo.basicSalary}
            editable={false}
            field="basicSalary"
          /> */}
          {/* <ProfileItem
            label="Contract Type"
            value={userInfo.contractType}
            editable={false}
            field="contractType"
          /> */}
          {/* <ProfileItem
            label="Work Shift"
            value={userInfo.workShift}
            editable={false}
            field="workShift"
          /> */}
          {/* <ProfileItem
            label="Location"
            value={userInfo.location}
            editable={false}
            field="location"
          /> */}
          {/* <ProfileItem
            label="Date of Joining"
            value={userInfo.dateOfJoining}
            editable={false}
            field="dateOfJoining"
          /> */}
          {/* <ProfileItem
            label="Bank Account Number"
            value={userInfo.bankAccountNumber}
            editable={false}
            field="bankAccountNumber"
          /> */}
          {/* <ProfileItem
            label="IFSC Code"
            value={userInfo.ifscCode}
            editable={false}
            field="ifscCode"
          /> */}
          {/* <ProfileItem
            label="test"
            value={userInfo.test}
            editable={false}
            field="test"
          /> */}
          {/* <ProfileItem
            label="Secondary Bank Account Number"
            value={userInfo.secondaryBankAccountNumber}
            editable={false}
            field="secondaryBankAccountNumber"
          /> */}
        </View>
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );

  const renderDocumentsContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>📄</Text>
        <Text style={styles.emptyStateTitle}>No Documents</Text>
        <Text style={styles.emptyStateSubtitle}>
          Documents will appear here when uploaded
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {/* <Text style={styles.avatarText}>
                {userInfo.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </Text> */}
              <Image
                source={{
                  uri: profileDetail.image,
                }}
                style={styles.avatarText}
              />
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: isOnline ? '#2ecc71' : '#95a5a6' },
                ]}
              />
            </View>
          </View>

          <View style={styles.profileHeaderInfo}>
            <Text style={styles.profileName}>{profileDetail.first_name}</Text>
            {/* <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isOnline ? '#2ecc71' : '#95a5a6' },
                ]}
              />
              <Text style={styles.statusText}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View> */}
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'Profile' && styles.activeTab]}
            onPress={() => setSelectedTab('Profile')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Profile' && styles.activeTabText,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'Documents' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('Documents')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Documents' && styles.activeTabText,
              ]}
            >
              Documents
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'Profile'
          ? renderProfileContent()
          : renderDocumentsContent()}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                Edit {getFieldLabel(editField)}
              </Text>
              <View style={styles.modalPlaceholder} />
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>{getFieldLabel(editField)}</Text>
              <TextInput
                style={styles.modalInput}
                value={editValue}
                onChangeText={setEditValue}
                placeholder={`Enter ${getFieldLabel(editField).toLowerCase()}`}
                multiline={
                  editField.includes('address') || editField === 'qualification'
                }
                numberOfLines={
                  editField.includes('address') || editField === 'qualification'
                    ? 3
                    : 1
                }
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 25,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,

    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'white',
  },
  profileHeaderInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  tabContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6c7ce7',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#6c7ce7',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 1,
  },
  sectionContent: {
    paddingHorizontal: 20,
  },
  profileItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  profileLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '400',
    flex: 1,
  },
  profileValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  profileValue: {
    fontSize: 16,
    color: '#2c3e50',
    marginRight: 10,
    textAlign: 'right',
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    borderRadius: 4,
    padding: 4,
    minWidth: 24,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconText: {
    color: 'white',
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 8,
  },
  emptyStateText: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  bottomSpace: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  modalClose: {
    fontSize: 20,
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalPlaceholder: {
    width: 20,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#2c3e50',
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingVertical: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#6c7ce7',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileView;
