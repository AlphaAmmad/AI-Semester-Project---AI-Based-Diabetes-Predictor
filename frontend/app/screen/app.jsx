import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Updated import
import axios from 'axios';

export default function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [predictionResult, setPredictionResult] = useState('');

  const [symptoms, setSymptoms] = useState({
    frequent_urination: 'no',
    excessive_thirst: 'no',
    unexplained_weight_loss: 'no',
    increased_hunger: 'no',
    blurry_vision: 'no',
    fatigue: 'no',
    diabetic_numbness: 'no',
    slow_healing_sores: 'no',
    frequent_infections: 'no',
  });

  const handleSymptomChange = (key, value) => {
    setSymptoms((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!age.trim()) newErrors.age = 'Age is required';
    else if (isNaN(age)) newErrors.age = 'Age must be a number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const requestData = {
      name: name.trim(),
      age: Number(age),
      ...Object.fromEntries(
        Object.entries(symptoms).map(([key, value]) => [key, value === 'yes' ? 1 : 0])
      ),
    };

    axios
      .post('http://192.168.2.101:5000/predict', requestData)
      .then((res) => {
        setPredictionResult(res.data.prediction);
        setModalVisible(true);
      })
      .catch((err) => {
        console.error(err);
        setPredictionResult('Error: Something went wrong!');
        setModalVisible(true);
      });
  };

  const symptomQuestions = {
    frequent_urination: '1. Are you experiencing any changes or increase in your frequency of urination?',
    excessive_thirst: '2. Are you feeling excessive thirst?',
    unexplained_weight_loss: '3. Are you losing weight gradually?',
    increased_hunger: '4. Is your appetite significantly increased?',
    blurry_vision: '5. Is your vision varying or decreasing?',
    fatigue: '6. Are you feeling fatigue?',
    diabetic_numbness: '7. Are you feeling numbness?',
    slow_healing_sores: '8. Do your wounds take a long time to heal?',
    frequent_infections: '9. Are you experiencing any infections (skin, chest, or urinary tract infections)?',
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/icon.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Diabetes Prediction App</Text>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        {/* Personal Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter your name"
                value={name}
                onChangeText={(val) => {
                  setName(val);
                  setErrors((prev) => ({ ...prev, name: '' }));
                }}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                placeholder="Enter your age"
                keyboardType="numeric"
                value={age}
                onChangeText={(val) => {
                  setAge(val);
                  setErrors((prev) => ({ ...prev, age: '' }));
                }}
              />
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>
          </View>
        </View>

        {/* Symptoms Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Symptoms</Text>
          {Object.keys(symptoms).map((key) => (
            <View key={key} style={styles.questionContainer}>
              <Text style={styles.questionText}>{symptomQuestions[key]}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={symptoms[key]}
                  onValueChange={(itemValue) => handleSymptomChange(key, itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#0277bd"
                  mode="dropdown" // Added for better Android experience
                >
                  <Picker.Item label="No" value="no" />
                  <Picker.Item label="Yes" value="yes" />
                </Picker>
              </View>
            </View>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Predict</Text>
        </TouchableOpacity>
      </View>

      {/* Result Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Prediction Result</Text>
            <Text style={styles.modalText}>{predictionResult}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f9ff',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    width: cardWidth,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0277bd',
  },
  formCard: {
    width: cardWidth,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0277bd',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '48%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  inputError: {
    borderColor: '#e63946',
  },
  errorText: {
    color: '#e63946',
    fontSize: 12,
    marginTop: 4,
  },
  questionContainer: {
    marginBottom: 18,
  },
  questionText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  picker: {
    width: '100%', // Added width for better control
    height: 50,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#0277bd',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0277bd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0277bd',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#0277bd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});