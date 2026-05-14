import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pbosucrtmmngandfhttm.supabase.co".trim();
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBib3N1Y3JjdG5ubmdqeHJkaHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3Njk0OTMsImV4cCI6MjA5NDM0NTQ5M30.29X6DTs7JbUI5jxAVTCSNuQoFRmwgdZjfmI0GQ76kDY".trim();

console.log("Iniciando conexão com Satélite:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: { 'x-my-custom-header': 'pedalafi' },
  },
});
