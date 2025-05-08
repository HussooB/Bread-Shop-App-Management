import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const BAKERY_BG = require('../assets/bakery-bg.jpg');

export default function Sales() {
  const [hotels, setHotels] = useState('');
  const [markets, setMarkets] = useState('');
  const [shop, setShop] = useState('');
  const [unitPrice, setUnitPrice] = useState('6'); // Default to 6 birr per bread
  const router = useRouter();

  const totalQuantity = (parseInt(hotels) || 0) + (parseInt(markets) || 0) + (parseInt(shop) || 0);
  const totalRevenue = totalQuantity * (parseFloat(unitPrice) || 0);

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://192.168.21.57:5000/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ hotels: parseInt(hotels) || 0, markets: parseInt(markets) || 0, shop: parseInt(shop) || 0, unitPrice: parseFloat(unitPrice) }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Sales data added successfully');
        setHotels(''); setMarkets(''); setShop('');
      } else {
        Alert.alert('Error', data.message || 'Failed to add sales data');
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
          <Text style={styles.headerTitle}>Sales Tracking</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Unit Price (Birr)</Text>
          <TextInput
            style={styles.input}
            value={unitPrice}
            onChangeText={setUnitPrice}
            keyboardType="numeric"
            placeholder="Unit price (e.g. 6)"
          />
          <Text style={styles.label}>Hotels</Text>
          <TextInput
            style={styles.input}
            value={hotels}
            onChangeText={setHotels}
            keyboardType="numeric"
            placeholder="Sales to hotels"
          />
          <Text style={styles.label}>Markets</Text>
          <TextInput
            style={styles.input}
            value={markets}
            onChangeText={setMarkets}
            keyboardType="numeric"
            placeholder="Sales to markets"
          />
          <Text style={styles.label}>Own Shop</Text>
          <TextInput
            style={styles.input}
            value={shop}
            onChangeText={setShop}
            keyboardType="numeric"
            placeholder="Sales in own shop"
          />
          <View style={styles.revenueBox}>
            <Text style={styles.revenueText}>Total Revenue: <Text style={{ color: '#D2691E', fontWeight: 'bold' }}>{totalRevenue} Birr</Text></Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Sales</Text>
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
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0c097',
    marginBottom: 15,
  },
  revenueBox: {
    marginVertical: 10,
    alignItems: 'center',
  },
  revenueText: {
    fontSize: 18,
    color: '#8B5C2A',
  },
  button: {
    backgroundColor: '#D2691E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff8e1',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 