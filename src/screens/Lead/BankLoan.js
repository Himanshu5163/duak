import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';

const BankLoan = () => {

  const [wantsNewLoan, setWantsNewLoan] = useState(null);
  const [loanAmount, setLoanAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);

  // Function to handle the final submission (for 'Yes' selection or 'No' action)
  const handleSubmit = isLoanRequested => {
    // Clear any previous messages
    setApiMessage(null);
    setIsLoading(true);

    let successText;
    if (isLoanRequested) {
      // Logic for YES: Loan requested
      successText = `Loan request for $${
        loanAmount || 'amount not specified'
      } submitted for review.`;
    } else {
      // Logic for NO: Skipping loan step
      successText =
        'Loan application step successfully skipped. Proceeding to the next stage.';
    }

    // Simulate a network request delay (e.g., 2 seconds)
    setTimeout(() => {
      setIsLoading(false);
      setApiMessage({
        type: 'success',
        text: successText,
      });
    }, 2000);
  };

  // Helper to render the message based on API status
  const renderMessage = () => {
    if (!apiMessage) return null;

    const messageStyle =
      apiMessage.type === 'success'
        ? styles.successMessage
        : styles.errorMessage;

    return (
      <View style={styles.messageContainer}>
        <Text style={messageStyle}>{apiMessage.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.label}>
        Do you want to apply for a bank loan as part of this process?
      </Text>

      {/* --- Step 1: Selection --- */}
      <View style={styles.segmentedControl}>
        {['yes', 'no'].map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.segmentButton,
              wantsNewLoan === option && styles.segmentButtonActive,
            ]}
            onPress={() => {
              setWantsNewLoan(option);
              setApiMessage(null); // Clear previous messages
              // If 'No' is selected, immediately trigger the submit/skip action
              if (option === 'no') {
                handleSubmit(false);
              }
            }}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.segmentText,
                wantsNewLoan === option && styles.segmentTextActive,
              ]}
            >
              {option === 'yes' ? 'Yes, Apply Now' : 'No, Skip Loan'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* --- Step 2: Conditional Input Box (If 'Yes' is selected) --- */}
      {wantsNewLoan === 'yes' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            What is the approximate loan amount you require?
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={setLoanAmount}
            value={loanAmount}
            placeholder="e.g., $50,000"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          {/* --- Step 3: Submit Button (Only visible if 'Yes' is selected) --- */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => handleSubmit(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Loan Request</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* --- Loading and Message Area --- */}
      {isLoading && wantsNewLoan === 'no' && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007bff" />
          <Text style={styles.loadingText}>Processing to next step...</Text>
        </View>
      )}
      {renderMessage()}
    </View>
  );
};

// --- Styling (Reused and minor adjustments) ---
const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    marginVertical: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  // --- Segmented Control Styling ---
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 25,
    marginTop:10
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentButtonActive: {
    backgroundColor: '#007bff',
    shadowColor: '#007bff',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  segmentTextActive: {
    color: '#fff',
  },
  // --- Input Styling ---
  inputGroup: {
    marginBottom: 5, // Keep space for the button below
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 15, // Space between input and button
  },
  // --- Button & Message Styling ---
  submitButton: {
    backgroundColor: '#339449ff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    marginTop:10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop: 10,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#007bff',
  },
  messageContainer: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#d4edda',
  },
  successMessage: {
    color: '#155724',
    fontSize: 14,
    fontWeight: '600',
  },
  errorMessage: {
    color: '#721c24',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BankLoan;
