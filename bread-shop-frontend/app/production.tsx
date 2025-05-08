import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const BAKERY_BG = require('../assets/bakery-bg.jpg');
const BREAD_TYPES = [
  { label: '6 Birr', value: '6birr' },
  { label: '7 Birr', value: '7birr' },
  { label: '10 Birr', value: '10birr' },
  { label: '12 Birr', value: '12birr' },
];

export default function Production() {
  const [breadType, setBreadType] = useState('6birr');
  const [quantity, setQuantity] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!quantity) {
      Alert.alert('Error', 'Please enter quantity');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://192.168.21.57:5000/api/production', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ breadType, quantity: parseInt(quantity) }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Production data added successfully');
        setQuantity('');
      } else {
        Alert.alert('Error', data.message || 'Failed to add production data');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <ImageBackground source={BAKERY_BG} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Production</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Bread Type</Text>
          <View style={styles.dropdownContainer}>
            {BREAD_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[styles.dropdownOption, breadType === type.value && styles.dropdownSelected]}
                onPress={() => setBreadType(type.value)}
              >
                <Text style={breadType === type.value ? styles.dropdownSelectedText : styles.dropdownText}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="Enter quantity"
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Production</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 248, 220, 0.92)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#D2691E',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: { padding: 5 },
  placeholder: { width: 34 },
  form: {
    backgroundColor: '#fff8e1',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    borderWidth: 1,
    borderColor: '#e0c097',
  },
  label: {
    fontSize: 16,
    color: '#8B5C2A',
    marginBottom: 5,
  },
  dropdownContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  dropdownOption: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0c097',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
  },
  dropdownSelected: {
    backgroundColor: '#D2691E',
    borderColor: '#D2691E',
  },
  dropdownText: {
    color: '#8B5C2A',
    fontWeight: 'bold',
  },
  dropdownSelectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0c097',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D2691E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff8e1',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 