import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://xbcnuutbvwdmitkptzcd.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_x-qTffgSQJNdm5q2i9mdoA_7ZoJwO98';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ [Supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

export default supabase;
