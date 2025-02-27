import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper functions for common database operations
export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const getDoctors = async (filters = {}) => {
  let query = supabase.from('doctors').select('*');
  
  // Apply filters if provided
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query = query.eq(key, value);
    }
  });
  
  // Order by rating
  query = query.order('rating', { ascending: false });
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};