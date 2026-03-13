import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.warn('[SUPABASE_ADMIN] Variables de entorno faltantes: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
}

export const supabaseAdmin = createClient<Database>(url ?? '', serviceRoleKey ?? '', {
  auth: { autoRefreshToken: false, persistSession: false },
});
