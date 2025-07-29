import { createClient } from "@supabase/supabase-js";

// GANTI DENGAN URL DAN KUNCI DARI DASHBOARD SUPABASE ANDA!
const supabaseUrl = "https://rqzocgbovysrpozmehlb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxem9jZ2JvdnlzcnBvem1laGxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjc4NTUsImV4cCI6MjA2ODYwMzg1NX0.W7TfPu7hYxAAynH2yCW4ZD1vUTI-RGWYHS2X-7CXKvE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
