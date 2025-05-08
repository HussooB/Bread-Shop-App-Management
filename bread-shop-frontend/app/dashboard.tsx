import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const BAKERY_BG = require('../assets/bakery-bg.jpg');

// Add types for user and summary
interface UserData {
  firstName: string;
  [key: string]: any;
}

interface Summary {
  production: { [key: string]: number };
  sales: { hotels: number; markets: number; shop: number };
  revenue: number;
}

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
    fetchSummary();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://192.168.21.57:5000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setUserData(data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://192.168.21.57:5000/api/summary/today', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      router.replace('/auth/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  // Provide default values to avoid undefined errors
  const production = summary?.production || {};
  const sales = summary?.sales || { hotels: 0, markets: 0, shop: 0 };
  const revenue = summary?.revenue ?? 0;

  return (
    <ImageBackground source={BAKERY_BG} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hello, {userData?.firstName || 'User'}!</Text>
          <TouchableOpacity onPress={() => setIsSidebarOpen(!isSidebarOpen)} style={styles.menuButton}>
            <Ionicons name="menu-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Sidebar */}
        {isSidebarOpen && (
          <View style={styles.sidebar}>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => { setIsSidebarOpen(false); router.push('/production'); }}>
              <Ionicons name="create-outline" size={24} color="#333" />
              <Text style={styles.sidebarText}>Production</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => { setIsSidebarOpen(false); router.push('/sales'); }}>
              <Ionicons name="cart-outline" size={24} color="#333" />
              <Text style={styles.sidebarText}>Sales</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => { setIsSidebarOpen(false); router.push('/wheat'); }}>
              <Ionicons name="leaf-outline" size={24} color="#333" />
              <Text style={styles.sidebarText}>Wheat</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Main Content */}
        <ScrollView style={styles.content}>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>6 Birr Bread</Text>
              <Text style={styles.cardValue}>{production['6birr'] || 0} pcs</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>7 Birr Bread</Text>
              <Text style={styles.cardValue}>{production['7birr'] || 0} pcs</Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>10 Birr Bread</Text>
              <Text style={styles.cardValue}>{production['10birr'] || 0} pcs</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>12 Birr Bread</Text>
              <Text style={styles.cardValue}>{production['12birr'] || 0} pcs</Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Hotels</Text>
              <Text style={styles.cardValue}>{sales.hotels} pcs</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Markets</Text>
              <Text style={styles.cardValue}>{sales.markets} pcs</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Own Shop</Text>
              <Text style={styles.cardValue}>{sales.shop} pcs</Text>
            </View>
          </View>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsTitle}>Total Daily Earnings</Text>
            <Text style={styles.earningsValue}>{revenue} Birr</Text>
          </View>
        </ScrollView>
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
    backgroundColor: '#D2691E', // bakery brown
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: { padding: 5 },
  menuButton: { padding: 5 },
  sidebar: {
    position: 'absolute',
    top: 70,
    right: 0,
    width: 200,
    backgroundColor: '#fff',
    padding: 20,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    zIndex: 1000,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sidebarText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  content: { flex: 1, padding: 20 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  card: {
    flex: 1,
    backgroundColor: '#fff8e1',
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0c097',
  },
  cardTitle: { fontSize: 16, color: '#8B5C2A', marginBottom: 5 },
  cardValue: { fontSize: 22, fontWeight: 'bold', color: '#D2691E' },
  earningsCard: {
    backgroundColor: '#fff8e1',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0c097',
  },
  earningsTitle: { fontSize: 18, color: '#8B5C2A', marginBottom: 5 },
  earningsValue: { fontSize: 28, fontWeight: 'bold', color: '#D2691E' },
}); 