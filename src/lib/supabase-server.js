/**
 * Server-only Supabase client.
 *
 * Uses the service role key so it can bypass RLS for SSG/ISR data fetching.
 * This module must NEVER be imported from a client component — Next.js App Router
 * guarantees server-only execution for server components and route handlers.
 *
 * The service role key is NOT prefixed with NEXT_PUBLIC_ so it is never
 * bundled into client JavaScript.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables'
  );
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Fetch all collections ordered by `order` column.
 * Returns the raw Supabase rows.
 */
export async function fetchAllCollections() {
  const { data, error } = await supabaseServer
    .from('collections')
    .select('*')
    .order('order');
  if (error) throw error;
  return data || [];
}

/**
 * Fetch all products ordered by `order` column.
 * Returns the raw Supabase rows.
 */
export async function fetchAllProducts() {
  const { data, error } = await supabaseServer
    .from('products')
    .select('*')
    .order('order');
  if (error) throw error;
  return data || [];
}

/**
 * Fetch products belonging to a specific collection.
 */
export async function fetchProductsByCollection(collectionId) {
  const { data, error } = await supabaseServer
    .from('products')
    .select('*')
    .eq('collection_id', collectionId)
    .order('order');
  if (error) throw error;
  return data || [];
}
