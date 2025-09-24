import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";

export default function ApplyProductModal({ modalVisible, setModalVisible }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    product: "",
    quantity: "",
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    // 👉 Here you can call API with formData
    setModalVisible(false);
  };

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Apply For Product</Text>

          {/* Form Fields */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.name}
            onChangeText={text => handleChange("name", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={text => handleChange("email", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={formData.product}
            onChangeText={text => handleChange("product", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            keyboardType="numeric"
            value={formData.quantity}
            onChangeText={text => handleChange("quantity", text)}
          />

          {/* Buttons */}
          <View style={styles.modalButtonSection}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={{ color: "#fff" }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButtonSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
