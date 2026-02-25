import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Alert,
  Linking,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { supabase } from '../services/supabase';

// Get responsive dimensions
const { width: screenWidth } = Dimensions.get('window');

interface BaseItem {
  id: number;
  name: string;
  image_url: string | null;
  address: string | null;
  lat?: number;
  lng?: number;
  phone?: string;
  festival_date?: string;
}

export default function ExploreScreen() {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width * 0.75;
  
  const [touristSpots, setTouristSpots] = useState<BaseItem[]>([]);
  const [restaurants, setRestaurants] = useState<BaseItem[]>([]);
  const [cafes, setCafes] = useState<BaseItem[]>([]);
  const [temples, setTemples] = useState<BaseItem[]>([]);
  const [festivals, setFestivals] = useState<BaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [spots, rests, cafesData, templesData, festivalsData] = await Promise.all([
        supabase.from('tourist_spots').select('*'),
        supabase.from('restaurants').select('*'),
        supabase.from('cafes').select('*'),
        supabase.from('temples').select('*'),
        supabase.from('festivals').select('*'),
      ]);

      setTouristSpots(spots.data || []);
      setRestaurants(rests.data || []);
      setCafes(cafesData.data || []);
      setTemples(templesData.data || []);
      setFestivals(festivalsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data from database');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (lat?: number, lng?: number, name?: string) => {
    if (!lat || !lng) {
      Alert.alert('Error', 'Location not available');
      return;
    }

    // Use universal Google Maps direction URL
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open maps');
    });
  };

  const handleCall = (phone?: string) => {
    if (!phone) {
      Alert.alert('Error', 'Phone number not available');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const renderCard = (item: BaseItem, showNavigate = true, showCall = false, cardWidth: number) => (
    <View key={item.id} style={[styles.card, { width: cardWidth }]}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.cardImage} />
      ) : (
        <View style={styles.cardImagePlaceholder}>
          <Text style={styles.cardImageEmoji}>📷</Text>
        </View>
      )}
      
      <View style={styles.cardContent}>
        <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
        
        {item.address && (
          <Text style={styles.cardAddress} numberOfLines={2}>📍 {item.address}</Text>
        )}
        
        {item.festival_date && (
          <Text style={styles.cardDate}>📅 {item.festival_date}</Text>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          {showNavigate && item.lat && item.lng && (
            <TouchableOpacity 
              style={styles.navigateButton}
              onPress={() => handleNavigation(item.lat, item.lng, item.name)}
            >
              <Text style={styles.navigateButtonText}>🗺️ นำทาง</Text>
            </TouchableOpacity>
          )}
          
          {showCall && item.phone && (
            <TouchableOpacity 
              style={styles.callButton}
              onPress={() => handleCall(item.phone)}
            >
              <Text style={styles.callButtonText}>📞 โทร</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderSection = (title: string, data: BaseItem[], showNavigate = true, showCall = false, cardWidth: number) => {
    if (data.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {data.map((item) => renderCard(item, showNavigate, showCall, cardWidth))}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>สำรวจอุตรดิตถ์</Text>
            <Text style={styles.headerSubtitle}>
              ค้นพบสถานที่ท่องเที่ยว ร้านอาหาร และอื่นๆ อีกมากมาย
            </Text>
          </View>

          {/* Categories */}
          {renderSection('🗺️ สถานที่ท่องเที่ยว', touristSpots, true, false, CARD_WIDTH)}
          {renderSection('🍜 ร้านอาหาร', restaurants, true, true, CARD_WIDTH)}
          {renderSection('☕ คาเฟ่', cafes, true, true, CARD_WIDTH)}
          {renderSection('⛩️ วัด', temples, true, false, CARD_WIDTH)}
          {renderSection('🎊 เทศกาล', festivals, false, false, CARD_WIDTH)}

          {/* Empty State if no data */}
          {touristSpots.length === 0 && restaurants.length === 0 && cafes.length === 0 && 
           temples.length === 0 && festivals.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyTitle}>ยังไม่มีข้อมูล</Text>
              <Text style={styles.emptyText}>
                เพิ่มข้อมูลใน Supabase เพื่อแสดงผล
              </Text>
            </View>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingRight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageEmoji: {
    fontSize: 40,
  },
  cardContent: {
    padding: 16,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  cardAddress: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  cardDate: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  navigateButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  navigateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  },
});

