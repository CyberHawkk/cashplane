import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase project credentials
const supabaseUrl = "https://jfjcnomuechceyrtxkzj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmamNub211ZWNoY2V5cnR4a3pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzYwNjQsImV4cCI6MjA2ODMxMjA2NH0.QUotogmeqCS72MEMOTwUp5BG-hR6R0NCGtQXHEwZ4zQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
