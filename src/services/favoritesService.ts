// Favorites Service - Local storage for favorite places
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "@uttaradit_favorites";

export interface FavoriteItem {
  id: number;
  type: "tourist_spot" | "restaurant" | "cafe" | "temple" | "festival";
  name: string;
  image_url: string | null;
  address: string | null;
  lat?: number;
  lng?: number;
  phone?: string;
  festival_date?: string;
  addedAt: string;
}

// Get all favorites
export const getFavorites = async (): Promise<FavoriteItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading favorites:", e);
    return [];
  }
};

// Add a favorite
export const addFavorite = async (
  item: Omit<FavoriteItem, "addedAt">,
): Promise<boolean> => {
  try {
    const favorites = await getFavorites();

    // Check if already exists
    const exists = favorites.some(
      (f) => f.id === item.id && f.type === item.type,
    );
    if (exists) {
      return false;
    }

    const newFavorite: FavoriteItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };

    favorites.push(newFavorite);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch (e) {
    console.error("Error adding favorite:", e);
    return false;
  }
};

// Remove a favorite
export const removeFavorite = async (
  id: number,
  type: string,
): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const filtered = favorites.filter((f) => !(f.id === id && f.type === type));
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error("Error removing favorite:", e);
    return false;
  }
};

// Check if item is favorite
export const isFavorite = async (
  id: number,
  type: string,
): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some((f) => f.id === id && f.type === type);
  } catch (e) {
    console.error("Error checking favorite:", e);
    return false;
  }
};

// Clear all favorites
export const clearFavorites = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (e) {
    console.error("Error clearing favorites:", e);
    return false;
  }
};
