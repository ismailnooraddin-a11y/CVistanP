import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Environment variable validation
 * CRITICAL: Ensure all required env vars are present before app starts
 */
function validateEnvVars(): { url: string; anonKey: string; serviceKey?: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL\n' +
      'Please add this to your .env.local file.\n' +
      'Get this from: https://supabase.com/dashboard > Project Settings > API'
    );
  }

  if (!anonKey) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
      'Please add this to your .env.local file.\n' +
      'Get this from: https://supabase.com/dashboard > Project Settings > API'
    );
  }

  if (!serviceKey) {
    throw new Error(
      'Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY\n' +
      'Please add this to your .env.local file.\n' +
      'Get this from: https://supabase.com/dashboard > Project Settings > API (service_role key)\n' +
      'WARNING: This key should NEVER be exposed to client-side code!'
    );
  }

  return { url, anonKey, serviceKey };
}

// Validate once at module load time
let envConfig: ReturnType<typeof validateEnvVars> | null = null;

function getEnvConfig() {
  if (!envConfig) {
    envConfig = validateEnvVars();
  }
  return envConfig;
}

// Browser client (for client components)
export function createClient() {
  const config = getEnvConfig();
  return createBrowserClient(config.url, config.anonKey);
}

// Server client with service role (for API routes)
// WARNING: This key has admin privileges - NEVER import in client components!
export function createServiceClient() {
  const config = getEnvConfig();
  return createSupabaseClient(
    config.url,
    config.serviceKey!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}