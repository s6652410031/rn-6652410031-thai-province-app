// Data service for fetching data from Supabase
import { supabase } from '../services/supabase';
import { TouristSpot, Restaurant, Cafe, Temple, Festival } from '../types/database';

// Fetch all tourist spots
export const getTouristSpots = async (): Promise<TouristSpot[]> => {
  const { data, error } = await supabase
    .from('tourist_spots')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tourist spots:', error);
    return [];
  }
  return data || [];
};

// Fetch all restaurants
export const getRestaurants = async (): Promise<Restaurant[]> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
  return data || [];
};

// Fetch all cafes
export const getCafes = async (): Promise<Cafe[]> => {
  const { data, error } = await supabase
    .from('cafes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching cafes:', error);
    return [];
  }
  return data || [];
};

// Fetch all temples
export const getTemples = async (): Promise<Temple[]> => {
  const { data, error } = await supabase
    .from('temples')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching temples:', error);
    return [];
  }
  return data || [];
};

// Fetch all festivals
export const getFestivals = async (): Promise<Festival[]> => {
  const { data, error } = await supabase
    .from('festivals')
    .select('*')
    .order('festival_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching festivals:', error);
    return [];
  }
  return data || [];
};

