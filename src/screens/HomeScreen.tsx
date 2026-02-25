import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  // Province Information
  const provinceName = 'อุตรดิตถ์';
  const provinceMotto =
    'เหล็กน้ำพี้ลือเลื่อง เมืองลางสาดหวาน บ้านพระยาพิชัยดาบหัก ถิ่นสักใหญ่ของโลก';
  const provinceSealUrl =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Seal_Uttaradit.png/220px-Seal_Uttaradit.png';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section with Province Seal */}
        <View style={styles.heroSection}>
          <View style={styles.heroOverlay} />
          <Image
            source={{ uri: provinceSealUrl }}
            style={styles.provinceSeal}
            resizeMode="contain"
          />
          <Text style={styles.provinceName}>{provinceName}</Text>
          <Text style={styles.englishName}>Uttaradit Province</Text>
        </View>

        {/* Motto Section */}
        <View style={styles.mottoSection}>
          <View style={styles.mottoBadge}>
            <Text style={styles.mottoLabel}>คติพจน์</Text>
          </View>
          <Text style={styles.mottoText}>{provinceMotto}</Text>
        </View>

        {/* Info Cards Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>ข้อมูลจังหวัด</Text>

          {/* Location Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>📍</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>ที่ตั้ง</Text>
              <Text style={styles.infoDescription}>
                ภาคเหนือตอนล่าง ห่างจากกรุงเทพฯ ประมาณ 488 กิโลเมตร
              </Text>
            </View>
          </View>

          {/* Area Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>🗺️</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>พื้นที่</Text>
              <Text style={styles.infoDescription}>
                ประมาณ 7,739 ตารางกิโลเมตร
              </Text>
            </View>
          </View>

          {/* Population Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>👥</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>ประชากร</Text>
              <Text style={styles.infoDescription}>
                ประมาณ 460,000 คน
              </Text>
            </View>
          </View>
        </View>

        {/* Highlights Section */}
        <View style={styles.highlightsSection}>
          <Text style={styles.sectionTitle}>ไฮไลท์ของจังหวัด</Text>

          <View style={styles.highlightGrid}>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightEmoji}>⛩️</Text>
              <Text style={styles.highlightText}>วัดมากมาย</Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightEmoji}>🏞️</Text>
              <Text style={styles.highlightText}>ธรรมชาติงดงาม</Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightEmoji}>🍜</Text>
              <Text style={styles.highlightText}>อาหารอร่อย</Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightEmoji}>🎊</Text>
              <Text style={styles.highlightText}>ประเพณีงานบุญ</Text>
            </View>
          </View>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>ยินดีต้อนรับสู่อุตรดิตถ์</Text>
          <Text style={styles.welcomeText}>
            จังหวัดอุตรดิตถ์เป็นจังหวัดที่มีความงามทางธรรมชาติและวัฒนธรรม
            ที่มีเอกลักษณ์เฉพาะตัว มีแหล่งท่องเที่ยวทางธรรมชาติที่สวยงาม
            อาหารพื้นเมืองอร่อย และผู้คนที่ใจดี พร้อมต้อนรับนักท่องเที่ยวทุกคน
          </Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 30,
  },
  heroSection: {
    height: 280,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 107, 53, 0.9)',
  },
  provinceSeal: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    zIndex: 1,
  },
  provinceName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    zIndex: 1,
  },
  englishName: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 5,
    opacity: 0.9,
    zIndex: 1,
  },
  mottoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 2,
  },
  mottoBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  mottoLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  mottoText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  highlightsSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  highlightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  highlightItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  highlightEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  welcomeSection: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
    opacity: 0.95,
  },
});

