import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://placeholder.supabase.co';
const supabaseAnonKey = 'placeholder_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
