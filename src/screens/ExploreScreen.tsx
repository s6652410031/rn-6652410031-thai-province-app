import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  addFavorite,
  FavoriteItem,
  isFavorite,
  removeFavorite,
} from "../services/favoritesService";
import { supabase } from "../services/supabase";

type CategoryType =
  | "tourist_spot"
  | "restaurant"
  | "cafe"
  | "temple"
  | "festival";

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

interface Category {
  key: CategoryType;
  title: string;
  data: BaseItem[];
  showNavigate: boolean;
  showCall: boolean;
}

const CATEGORIES: {
  key: CategoryType;
  title: string;
  showNavigate: boolean;
  showCall: boolean;
}[] = [
  {
    key: "tourist_spot",
    title: "🗺️ สถานที่ท่องเที่ยว",
    showNavigate: true,
    showCall: false,
  },
  {
    key: "restaurant",
    title: "🍜 ร้านอาหาร",
    showNavigate: true,
    showCall: true,
  },
  { key: "cafe", title: "☕ คาเฟ่", showNavigate: true, showCall: true },
  { key: "temple", title: "⛩️ วัด", showNavigate: true, showCall: false },
  { key: "festival", title: "🎊 เทศกาล", showNavigate: false, showCall: false },
];

export default function ExploreScreen() {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width * 0.75;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | "all"
  >("all");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [spots, rests, cafesData, templesData, festivalsData] =
        await Promise.all([
          supabase.from("tourist_spots").select("*"),
          supabase.from("restaurants").select("*"),
          supabase.from("cafes").select("*"),
          supabase.from("temples").select("*"),
          supabase.from("festivals").select("*"),
        ]);

      const newCategories: Category[] = [
        {
          key: "tourist_spot",
          title: "🗺️ สถานที่ท่องเที่ยว",
          data: spots.data || [],
          showNavigate: true,
          showCall: false,
        },
        {
          key: "restaurant",
          title: "🍜 ร้านอาหาร",
          data: rests.data || [],
          showNavigate: true,
          showCall: true,
        },
        {
          key: "cafe",
          title: "☕ คาเฟ่",
          data: cafesData.data || [],
          showNavigate: true,
          showCall: true,
        },
        {
          key: "temple",
          title: "⛩️ วัด",
          data: templesData.data || [],
          showNavigate: true,
          showCall: false,
        },
        {
          key: "festival",
          title: "🎊 เทศกาล",
          data: festivalsData.data || [],
          showNavigate: false,
          showCall: false,
        },
      ];

      setCategories(newCategories);

      // Check favorites
      const favIds = new Set<string>();
      for (const cat of newCategories) {
        for (const item of cat.data) {
          const isFav = await isFavorite(item.id, cat.key);
          if (isFav) {
            favIds.add(`${item.id}_${cat.key}`);
          }
        }
      }
      setFavoriteIds(favIds);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load data from database");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, []);

  const handleNavigation = (lat?: number, lng?: number) => {
    if (!lat || !lng) {
      Alert.alert("Error", "Location not available");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open maps");
    });
  };

  const handleCall = (phone?: string) => {
    if (!phone) {
      Alert.alert("Error", "Phone number not available");
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert("Error", "Unable to make phone call");
    });
  };

  const handleToggleFavorite = async (item: BaseItem, type: CategoryType) => {
    const key = `${item.id}_${type}`;
    const isFav = favoriteIds.has(key);

    const favoriteItem: Omit<FavoriteItem, "addedAt"> = {
      id: item.id,
      type,
      name: item.name,
      image_url: item.image_url,
      address: item.address,
      lat: item.lat,
      lng: item.lng,
      phone: item.phone,
      festival_date: item.festival_date,
    };

    let success: boolean;
    if (isFav) {
      success = await removeFavorite(item.id, type);
      if (success) {
        const newFavs = new Set(favoriteIds);
        newFavs.delete(key);
        setFavoriteIds(newFavs);
      }
    } else {
      success = await addFavorite(favoriteItem);
      if (success) {
        const newFavs = new Set(favoriteIds);
        newFavs.add(key);
        setFavoriteIds(newFavs);
      }
    }

    if (!success) {
      Alert.alert("Error", "Failed to update favorites");
    }
  };

  const filterData = (data: BaseItem[]): BaseItem[] => {
    let filtered = data;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.address && item.address.toLowerCase().includes(query)),
      );
    }

    return filtered;
  };

  const renderCard = (
    item: BaseItem,
    type: CategoryType,
    showNavigate: boolean,
    showCall: boolean,
  ) => {
    const key = `${item.id}_${type}`;
    const isFav = favoriteIds.has(key);

    return (
      <View key={item.id} style={[styles.card, { width: CARD_WIDTH }]}>
        <View style={styles.imageContainer}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.cardImage} />
          ) : (
            <View style={styles.cardImagePlaceholder}>
              <Text style={styles.cardImageEmoji}>📷</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleToggleFavorite(item, type)}
          >
            <Text style={styles.favoriteIcon}>{isFav ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardName} numberOfLines={2}>
            {item.name}
          </Text>

          {item.address && (
            <Text style={styles.cardAddress} numberOfLines={2}>
              📍 {item.address}
            </Text>
          )}

          {item.festival_date && (
            <Text style={styles.cardDate}>📅 {item.festival_date}</Text>
          )}

          <View style={styles.buttonRow}>
            {showNavigate && item.lat && item.lng && (
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => handleNavigation(item.lat, item.lng)}
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
  };

  const renderSection = (category: Category) => {
    const filteredData = filterData(category.data);
    if (filteredData.length === 0) return null;

    return (
      <View style={styles.section} key={category.key}>
        <Text style={styles.sectionTitle}>
          {category.title} ({filteredData.length})
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredData.map((item) =>
            renderCard(
              item,
              category.key,
              category.showNavigate,
              category.showCall,
            ),
          )}
        </ScrollView>
      </View>
    );
  };

  // Filter categories based on selected category
  const filteredCategories =
    selectedCategory === "all"
      ? categories
      : categories.filter((c) => c.key === selectedCategory);

  // Check if there's any data after filtering
  const hasData = filteredCategories.some(
    (cat) => filterData(cat.data).length > 0,
  );

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6B35"]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>สำรวจอุตรดิตถ์</Text>
          <Text style={styles.headerSubtitle}>
            ค้นพบสถานที่ท่องเที่ยว ร้านอาหาร และอื่นๆ อีกมากมาย
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาสถานที่..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === "all" && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory("all")}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === "all" && styles.categoryTextActive,
              ]}
            >
              ทั้งหมด
            </Text>
          </TouchableOpacity>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryButton,
                selectedCategory === cat.key && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.key && styles.categoryTextActive,
                ]}
              >
                {cat.title.replace(/[^ก-๙a-zA-Z]/g, "").trim()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Categories */}
        {filteredCategories.map(renderSection)}

        {/* Empty State */}
        {!hasData && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>ไม่พบข้อมูล</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "ลองค้นหาด้วยคำอื่น"
                : "เพิ่มข้อมูลใน Supabase เพื่อแสดงผล"}
            </Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  header: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    fontSize: 18,
    color: "#999",
    padding: 5,
  },
  categoryScroll: {
    maxHeight: 50,
    marginTop: 15,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  categoryButtonActive: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingRight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 140,
  },
  cardImagePlaceholder: {
    width: "100%",
    height: 140,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImageEmoji: {
    fontSize: 40,
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    fontSize: 18,
  },
  cardContent: {
    padding: 16,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  cardAddress: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
    lineHeight: 20,
  },
  cardDate: {
    fontSize: 14,
    color: "#E91E63",
    fontWeight: "600",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  navigateButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  navigateButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  callButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  callButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyState: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
  },
  bottomPadding: {
    height: 40,
  },
});
