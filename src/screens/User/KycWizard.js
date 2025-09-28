import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LeadAdd from '../Lead/LeadAdd';
import DocumentUploader from '../Lead/DocumentUploader';
import StatusBadge from './StatusBadge';
import { useSelector } from 'react-redux';
import { Strings } from '../../theme/Strings';
import { getToken } from '../../utils/storage';
import Qualified from '../Lead/Qualified';
import BankLoan from '../Lead/BankLoan';
import PaymentReceived from '../Lead/PaymentReceived';
import MaterialDispatch from '../Lead/MaterialDispatch';
const { width } = Dimensions.get('window');

const KycWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStepId, setSelectedStepId] = useState(5);
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [leadInfo, setLeadInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const tabScrollViewRef = useRef(null);
  const tabRefs = useRef([]);
  const { user } = useSelector(state => state.auth);

  const [workflowSteps, setWorkflowSteps] = useState([]);

  const handleDocumentsChange = (updatedDocuments) => {
    console.log('Documents updated:', updatedDocuments);
    setDocuments(updatedDocuments);
    if (updatedDocuments.length > 0) {
      setWorkflowSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.key === 'document' ? { ...step, status: 'completed' } : step
        ) 
      );
    } 
  };

  const fetchWorkflowSteps = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${Strings.APP_BASE_URL}/client-workflow-steps`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setWorkflowSteps(data.data.map(step => ({ ...step, id: step.id })));
        console.log('Workflow steps fetched:', data.data);
      } else { 
        Alert.alert('Failed', data.message || 'Unable to fetch workflow steps.');
      }
    } catch (error) {
      console.error('Error fetching workflow steps:', error);
      Alert.alert('Error', 'Unexpected error occurred while fetching steps.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchLeadInfo = async (client_mobile) => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(
        `${Strings.APP_BASE_URL}/client-workflow?client_mobile=${encodeURIComponent(client_mobile)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.status) {
          setLeadInfo(data.lead || data.data);
          console.log('Lead info fetched:', data.lead || data.data);
        } else {
          Alert.alert('Failed', data.message || 'Unable to fetch lead information.');
        }
      } else {
        Alert.alert('Error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error fetching lead info:', error);
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const DocumentComponent = () => (
    <DocumentUploader onDocumentsChange={handleDocumentsChange} />
  );

  const LeadComponent = () => (
    <LeadAdd leadInfo={leadInfo} />
  );

  const QualifiedComponent = () => (
    // <View style={styles.stepComponentContainer}>
    //   <Text style={styles.stepComponentTitle}>Qualification Check</Text>
    //   <Text style={styles.stepComponentText}>Verify eligibility based on criteria like credit score and qualifications.</Text>
    // </View>
    <Qualified />
  );

  const BankLoanProcessComponent = () => (
    // <View style={styles.stepComponentContainer}>
    //   <Text style={styles.stepComponentTitle}>Bank Loan Application</Text>
    //   <Text style={styles.stepComponentText}>Submit loan application, track approval status, and handle documentation.</Text>
    // </View>
    <BankLoan />
  );

  const PaymentReceivedComponent = () => (
    // <View style={styles.stepComponentContainer}>
    //   <Text style={styles.stepComponentTitle}>Payment Confirmation</Text>
    //   <Text style={styles.stepComponentText}>Record payment details, verify receipt, and update transaction status.</Text>
    // </View>
    <PaymentReceived />
  );

  const MaterialDispatchComponent = () => (
    // <View style={styles.stepComponentContainer}>
    //   <Text style={styles.stepComponentTitle}>Material Dispatch</Text>
    //   <Text style={styles.stepComponentText}>Schedule and track dispatch of materials to the installation site.</Text>
    // </View>
    <MaterialDispatch />
  );

  const InstallationComponent = () => (
    <View style={styles.stepComponentContainer}>
      <Text style={styles.stepComponentTitle}>Installation Setup</Text>
      <Text style={styles.stepComponentText}>Coordinate installation, assign technicians, and monitor progress.</Text>
    </View>
  );

  const NetMeteringComponent = () => (
    <View style={styles.stepComponentContainer}>
      <Text style={styles.stepComponentTitle}>Net Metering Configuration</Text>
      <Text style={styles.stepComponentText}>Set up net metering, perform testing, and ensure grid compliance.</Text>
    </View>
  );

  const SubsidyComponent = () => (
    <View style={styles.stepComponentContainer}>
      <Text style={styles.stepComponentTitle}>Subsidy Processing</Text>
      <Text style={styles.stepComponentText}>Apply for subsidies, submit documents, and track approval.</Text>
    </View>
  );

  const DisbursedComponent = () => (
    <View style={styles.stepComponentContainer}>
      <Text style={styles.stepComponentTitle}>Final Disbursement</Text>
      <Text style={styles.stepComponentText}>Complete final payments, close project, and generate completion certificate.</Text>
    </View>
  );

  useEffect(() => {
    fetchWorkflowSteps();
  }, []);

  useEffect(() => {
    const shouldShowBankLoan = true;
    const shouldShowSubsidy = true;

    const filtered = workflowSteps.filter(step => {
      if (step.key === 'bank_loan_process' && !shouldShowBankLoan) return false;
      if (step.key === 'subsidy' && !shouldShowSubsidy) return false;
      return true;
    });

    const withIds = filtered.map((step, index) => ({ ...step, id: index + 1 }));
    setVisibleSteps(withIds);

    setTimeout(() => {
      if (tabRefs.current[selectedStepId - 1]) {
        centerTab(selectedStepId);
      }
    }, 100);
  }, [workflowSteps]);

  useEffect(() => {
    if (currentStep === 1 && user?.mobile) {
      handleFetchLeadInfo(user.mobile);
    }
  }, [currentStep, user]);

  useEffect(() => {
    const currentStepData = visibleSteps.find((step) => step.id === currentStep);
    if (currentStepData && currentStepData.status === 'completed' && currentStep < visibleSteps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setSelectedStepId(nextStep);
      setWorkflowSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === nextStep && step.status === 'disabled' ? { ...step, status: 'pending' } : step
        )
      );
    }
  }, [visibleSteps, currentStep]);

  useEffect(() => {
    centerTab(selectedStepId);
  }, [selectedStepId]);

  const centerTab = (stepId) => {
    const tabRef = tabRefs.current[stepId - 1];
    if (tabRef && tabScrollViewRef.current) {
      tabRef.measureLayout(
        tabScrollViewRef.current,
        (x, y, width, height) => {
          const center = x - (Dimensions.get('window').width / 2) + (width / 2);
          tabScrollViewRef.current.scrollTo({ x: center, animated: true });
        },
        () => {}
      );
    }
  };

  const getStepStatus = (stepId) => {
    const step = visibleSteps.find((s) => s.id === stepId);
    return step ? step.status : 'disabled';
  };

  const handleTabPress = (step) => {
    const status = getStepStatus(step.id);
    if (status === 'disabled') return;
    setSelectedStepId(step.id);
  };

  const stepComponents = {
    lead: LeadComponent,
    document: DocumentComponent,
    qualified: QualifiedComponent,
    bank_loan_process: BankLoanProcessComponent,
    payment_received: PaymentReceivedComponent,
    material_dispatch: MaterialDispatchComponent,
    installation: InstallationComponent,
    net_metering: NetMeteringComponent,
    subsidy: SubsidyComponent,
    disbursed: DisbursedComponent,
  };

  const TabItem = ({ step, index }) => {
    const status = getStepStatus(step.id);
    const isSelected = selectedStepId === step.id;
    const isDisabled = status === 'disabled';

    return (
      <TouchableOpacity
        ref={el => (tabRefs.current[index] = el)}
        style={[styles.tabItem, isSelected && styles.selectedTabItem, isDisabled && styles.disabledTabItem]}
        onPress={() => handleTabPress(step)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <View style={styles.tabIconContainer}>
          <Icon
            name={step.icon}
            size={20}
            color={isSelected ? '#1a237e' : (isDisabled ? '#9ca3af' : '#424982')}
          />
          {status === 'completed' && (
            <View style={styles.completedCheck}>
              <Feather name="check" size={12} color="#fff" />
            </View>
          )}
        </View>
        <Text
          style={[
            styles.tabTitle,
            isSelected && styles.selectedTabTitle,
            isDisabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {step.label}
        </Text>
        {isSelected && <View style={[styles.tabIndicator, { backgroundColor: '#1a237e' }]} />}
      </TouchableOpacity>
    );
  };

  const ProgressBar = () => {
    const completedCount = visibleSteps.filter(step => step.status === 'completed').length;
    const progressPercentage = (completedCount / visibleSteps.length) * 100;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Progress: {completedCount} of {visibleSteps.length} steps
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${progressPercentage}%` }
            ]}
          />
        </View>
      </View>
    );
  };

  const StepContent = () => {
    const selectedStep = visibleSteps.find(s => s.id === selectedStepId);
    if (!selectedStep) return null;

    const StepComp = stepComponents[selectedStep.key];

    return (
      <View style={styles.contentContainer}>
        <View style={styles.contentHeader}>
          <LinearGradient
            colors={['#495057', '#374151']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.contentIconContainer}
          >
            <Icon name={selectedStep.icon} size={28} color="#fff" />
          </LinearGradient>
          <View style={styles.contentHeaderText}>
            <Text style={styles.contentTitle}>{selectedStep.label}</Text>
            <StatusBadge status={selectedStep.status} />
          </View>
        </View>
        <Text style={styles.contentDescription}>{selectedStep.description}</Text>
        <View style={styles.contentArea}>
          {StepComp ? <StepComp /> : (
            <View style={styles.contentPlaceholder}>
              <Icon name={selectedStep.icon} size={48} color="#9ca3af" />
              <Text style={styles.contentPlaceholderTitle}>
                {selectedStep.label} Management
              </Text>
              <Text style={styles.contentPlaceholderText}>
                This section contains the workflow management interface for {selectedStep.label.toLowerCase()}.
              </Text>
            </View>
          )}
        </View>
        <View style={styles.contentFooter}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedStepId(currentStep)}
          >
            <Text style={styles.backButtonText}>Back to Current</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafafa" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workflow Management</Text>
        <Text style={styles.headerSubtitle}>Track and manage your project progress</Text>
      </View>
      <ProgressBar />
      {isLoading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1a237e" />
          <Text style={styles.loadingText}>Fetching data...</Text>
        </View>
      ) : (
        <>
          <ScrollView
            ref={tabScrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabScrollView}
            contentContainerStyle={styles.tabContentContainer}
          >
            {visibleSteps.map((step, index) => (
              <TabItem key={step.key} step={step} index={index} />
            ))}
          </ScrollView>
          <ScrollView style={styles.contentScrollView} showsVerticalScrollIndicator={false}>
            <StepContent />
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e0e0e0' },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#1a237e', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#757575' },
  progressContainer: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressText: { fontSize: 13, fontWeight: '500', color: '#555' },
  progressPercentage: { fontSize: 13, fontWeight: '600', color: '#1a237e' },
  progressBarContainer: { height: 6, backgroundColor: '#e0e0e0', borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#1a237e', borderRadius: 3 },
  tabScrollView: { maxHeight: 90, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e0e0e0', paddingTop: 8 },
  tabContentContainer: { paddingHorizontal: 12 },
  tabItem: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 4, minWidth: 90, borderRadius: 12 },
  selectedTabItem: { backgroundColor: '#f5f5f5' },
  tabIndicator: { position: 'absolute', bottom: 0, height: 4, width: '60%', borderRadius: 2, alignSelf: 'center' },
  disabledTabItem: { opacity: 0.6 },
  tabIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0', marginBottom: 4 },
  completedCheck: { position: 'absolute', top: -2, right: -2, backgroundColor: '#388e3c', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  tabTitle: { fontSize: 11, fontWeight: '500', color: '#757575', textAlign: 'center' },
  selectedTabTitle: { fontWeight: '600', color: '#1a237e' },
  disabledText: { color: '#9ca3af' },
  contentScrollView: { flex: 1, backgroundColor: '#fafafa' },
  contentContainer: { backgroundColor: '#ffffff', margin: 20, borderRadius: 16, padding: 24, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10 }, android: { elevation: 6 } }) },
  contentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  contentIconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8 }, android: { elevation: 4 } }) },
  contentHeaderText: { flex: 1 },
  contentTitle: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 4 },
  contentDescription: { fontSize: 16, color: '#6b7280', lineHeight: 24, marginBottom: 24 },
  contentArea: { marginBottom: 28 },
  contentPlaceholder: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  contentPlaceholderTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 8 },
  contentPlaceholderText: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 20 },
  contentFooter: { flexDirection: 'row', justifyContent: 'flex-start', gap: 12 },
  backButton: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0' },
  backButtonText: { fontSize: 16, fontWeight: '600', color: '#555' },
  stepComponentContainer: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  stepComponentTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 8 },
  stepComponentText: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 20 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  loadingText: { marginTop: 10, fontSize: 16, color: '#1a237e' },
});

export default KycWizard;