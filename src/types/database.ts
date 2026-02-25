// Database table types for Supabase

export interface TouristSpot {
  id: number;
  name: string;
  image_url: string | null;
  address: string | null;
  lat: number;
  lng: number;
  created_at: string;
}

export interface Restaurant {
  id: number;
  name: string;
  image_url: string | null;
  address: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  created_at: string;
}

export interface Cafe {
  id: number;
  name: string;
  image_url: string | null;
  address: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  created_at: string;
}

export interface Temple {
  id: number;
  name: string;
  image_url: string | null;
  address: string | null;
  lat: number;
  lng: number;
  created_at: string;
}

export interface Festival {
  id: number;
  name: string;
  image_url: string | null;
  festival_date: string;
  created_at: string;
}

