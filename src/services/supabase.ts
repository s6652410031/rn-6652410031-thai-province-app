// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lmfrwwgnrvmnxkascsbr.supabase.co';
const supabaseAnonKey = 'sb_publishable_eg4fqb-uwFkmK1SzqOvmqQ_Vb5eRAhZ';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

