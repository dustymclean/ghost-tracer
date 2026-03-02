import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lhmzdqjiazjhsbptvooj.supabase.co';
const supabaseAnonKey = 'sb_publishable_H2TP2riMVb_OVaQOTv5Ozw_fhve4zmN'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log("Sovereign Node initialized at:", supabaseUrl);
