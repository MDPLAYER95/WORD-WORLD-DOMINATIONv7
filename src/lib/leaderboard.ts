import { LeaderboardEntry } from "@/types/game";
import { toast } from "@/hooks/use-toast";

const API_URL = '/.netlify/functions/leaderboard';

export const getLeaderboard = async (difficulty?: string, limit = 10): Promise<LeaderboardEntry[]> => {
  try {
    const params = new URLSearchParams();
    if (difficulty && difficulty !== 'all') {
      params.append('difficulty', difficulty);
    }
    params.append('limit', limit.toString());

    const response = await fetch(`${API_URL}?${params.toString()}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch leaderboard');
    }

    return response.json();
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    toast({
      title: "Error",
      description: "Failed to fetch leaderboard",
      variant: "destructive"
    });
    return [];
  }
};

export const addToLeaderboard = async (entry: Omit<LeaderboardEntry, 'id'>): Promise<LeaderboardEntry> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add score to leaderboard');
  }

  return response.json();
};