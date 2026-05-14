import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pbosucrtmmngandfhttm.supabase.co";
const supabaseAnonKey = "sb_publishable_2AyCIufC1CIvThpHV3azbA_XiNggiou";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. Check your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
