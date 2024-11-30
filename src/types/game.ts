export type Difficulty = "easy" | "medium" | "hard";

export interface HistoryItem {
  word: string;
  explanation: string;
  emoji: string;
  isError?: boolean;
}

export interface LeaderboardEntry {
  id?: string;
  player_name: string; // Updated to match database column name
  score: number;
  difficulty: Difficulty;
  date: string;
  words: string[];
  language: string;
}