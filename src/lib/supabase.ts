import { createClient } from '@supabase/supabase-js';
import type { LeaderboardEntry } from '@/types/game';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getLeaderboard = async (difficulty?: string, limit = 10) => {
  let query = supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit);

  if (difficulty && difficulty !== 'all') {
    query = query.eq('difficulty', difficulty);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }

  return data as LeaderboardEntry[];
};

export const addToLeaderboard = async (entry: Omit<LeaderboardEntry, 'id'>) => {
  const { data, error } = await supabase
    .from('leaderboard')
    .insert([entry])
    .select()
    .single();

  if (error) {
    console.error('Error adding score:', error);
    throw error;
  }

  return data;
};