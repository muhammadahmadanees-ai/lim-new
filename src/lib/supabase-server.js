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
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const apiKey = serviceKey || anonKey;

if (!supabaseUrl || !apiKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or Supabase API key (SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY)'
  );
}

export const supabaseServer = createClient(supabaseUrl, apiKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const fallbackClient = (serviceKey && anonKey && serviceKey !== anonKey)
  ? createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

async function executeQuery(queryFn) {
  const primaryResult = await queryFn(supabaseServer);
  if (primaryResult.error) {
    const msg = primaryResult.error.message || '';
    if ((msg.includes('Unregistered API key') || primaryResult.error.code === 'PGRST301' || primaryResult.error.status === 401) && fallbackClient) {
      console.warn('⚠️ Primary Supabase key was rejected (' + msg + '). Falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY.');
      const fallbackResult = await queryFn(fallbackClient);
      if (fallbackResult.error) throw fallbackResult.error;
      return fallbackResult.data || [];
    }
    throw primaryResult.error;
  }
  return primaryResult.data || [];
}

/**
 * Fetch all collections ordered by `order` column.
 * Returns the raw Supabase rows.
 */
export async function fetchAllCollections() {
  return executeQuery((client) =>
    client.from('collections').select('*').order('order')
  );
}

/**
 * Fetch all products ordered by `order` column.
 * Returns the raw Supabase rows.
 */
export async function fetchAllProducts() {
  return executeQuery((client) =>
    client.from('products').select('*').order('order')
  );
}

/**
 * Fetch products belonging to a specific collection.
 */
export async function fetchProductsByCollection(collectionId) {
  return executeQuery((client) =>
    client
      .from('products')
      .select('*')
      .eq('collection_id', collectionId)
      .order('order')
  );
}
