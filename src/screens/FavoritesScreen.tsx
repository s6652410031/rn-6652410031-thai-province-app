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
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  FavoriteItem,
  getFavorites,
  removeFavorite,
} from "../services/favoritesService";

type CategoryType =
  | "tourist_spot"
  | "restaurant"
  | "cafe"
  | "temple"
  | "festival";

const CATEGORY_LABELS: Record<CategoryType, string> = {
  tourist_spot: "🗺️ สถานที่ท่องเที่ยว",
  restaurant: "🍜 ร้านอาหาร",
  cafe: "☕ คาเฟ่",
  temple: "⛩️ วัด",
  festival: "🎊 เทศกาล",
};

export default function FavoritesScreen() {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width - 40;

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error("Error loading favorites:", error);
      Alert.alert("Error", "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
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

  const handleRemoveFavorite = async (item: FavoriteItem) => {
    const success = await removeFavorite(item.id, item.type);
    if (success) {
      setFavorites((prev) =>
        prev.filter((f) => !(f.id === item.id && f.type === item.type)),
      );
    } else {
      Alert.alert("Error", "Failed to remove from favorites");
    }
  };

  const renderCard = (item: FavoriteItem) => {
    const showNavigate = item.lat && item.lng;
    const showCall =
      item.phone && (item.type === "restaurant" || item.type === "cafe");

    return (
      <View
        key={`${item.id}_${item.type}`}
        style={[styles.card, { width: CARD_WIDTH }]}
      >
        <View style={styles.imageContainer}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.cardImage} />
          ) : (
            <View style={styles.cardImagePlaceholder}>
              <Text style={styles.cardImageEmoji}>📷</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFavorite(item)}
          >
            <Text style={styles.removeIcon}>🗑️</Text>
          </TouchableOpacity>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {CATEGORY_LABELS[item.type]}
            </Text>
          </View>
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
            {showNavigate && (
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>กำลังโหลด...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
          <Text style={styles.headerTitle}>รายการโปรด</Text>
          <Text style={styles.headerSubtitle}>
            สถานที่ท่องเที่ยวที่คุณชื่นชอบ ({favorites.length})
          </Text>
        </View>

        {/* Favorites List */}
        {favorites.length > 0 ? (
          <View style={styles.favoritesContainer}>
            {favorites.map(renderCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>❤️</Text>
            <Text style={styles.emptyTitle}>ยังไม่มีรายการโปรด</Text>
            <Text style={styles.emptyText}>
              เริ่มสำรวจสถานที่ท่องเที่ยวต่างๆ
              {"\n"}
              และเพิ่มลงในรายการโปรดของคุณ
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
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
    paddingBottom: 30,
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
  favoritesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 16,
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
    height: 160,
  },
  cardImagePlaceholder: {
    width: "100%",
    height: 160,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImageEmoji: {
    fontSize: 40,
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  removeIcon: {
    fontSize: 20,
  },
  categoryBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
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
    marginHorizontal: 20,
    marginTop: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: "#888888",
    textAlign: "center",
    lineHeight: 24,
  },
  bottomPadding: {
    height: 40,
  },
});
