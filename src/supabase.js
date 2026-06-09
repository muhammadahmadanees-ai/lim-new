import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// In-memory cache to make loading collections and products instant
const cache = {
  collections: null,
  products: {}
};

export const getCollectionsCache = () => cache.collections;
export const getProductsCache = (id) => cache.products[id];

export const fetchCollectionsCached = async () => {
  if (cache.collections) return cache.collections;
  const { data, error } = await supabase.from('collections').select('*').order('order');
  if (error) throw error;
  cache.collections = data;
  return data;
};

export const fetchProductsCached = async (collectionId) => {
  if (cache.products[collectionId]) return cache.products[collectionId];
  const { data, error } = await supabase.from('products').select('*').eq('collection_id', collectionId).order('order');
  if (error) throw error;
  cache.products[collectionId] = data;
  return data;
};
