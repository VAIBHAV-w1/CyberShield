const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// For local development, use mock values if not set
const mockSupabaseUrl = 'https://hghvozqtamfyytucjlet.supabase.co';
const mockSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaHZvenF0YW1meXl0dWNqbGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjc3NzQsImV4cCI6MjA3NzYwMzc3NH0.aZs0Uwp2oCHCiGB8UxXNrk4fxqqARTtOdjZNRbxW5qg';

const finalUrl = supabaseUrl || mockSupabaseUrl;
const finalKey = supabaseKey || mockSupabaseKey;

const supabase = createClient(finalUrl, finalKey);

module.exports = supabase;
