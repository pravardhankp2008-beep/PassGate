import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://xbcnuutbvwdmitkptzcd.supabase.co';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'sb_publishable_x-qTffgSQJNdm5q2i9mdoA_7ZoJwO98';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
