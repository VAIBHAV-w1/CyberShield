const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// For local development, use mock values if not set
const mockSupabaseUrl = 'https://mock.supabase.co';
const mockSupabaseKey = 'mock-key';

const finalUrl = supabaseUrl || mockSupabaseUrl;
const finalKey = supabaseKey || mockSupabaseKey;

const supabase = createClient(finalUrl, finalKey);

module.exports = supabase;
