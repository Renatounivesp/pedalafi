import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pbosucrtmmngandfhttm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBib3N1Y3JjdG5ubmdqeHJkaHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3Njk0OTMsImV4cCI6MjA5NDM0NTQ5M30.29X6DTs7JbUI5jxAVTCSNuQoFRmwgdZjfmI0GQ76kDY";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. Check your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
