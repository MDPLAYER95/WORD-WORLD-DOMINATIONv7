import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/lib/supabase";
import { Difficulty } from "@/types/game";

const LeaderboardSection = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");

  const { data: scores = [], isLoading } = useQuery({
    queryKey: ['leaderboard', selectedDifficulty],
    queryFn: () => getLeaderboard(selectedDifficulty === "all" ? undefined : selectedDifficulty, 100),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getMedalEmoji = (index: number) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400 bg-green-500/20";
      case "medium": return "text-yellow-400 bg-yellow-500/20";
      case "hard": return "text-red-400 bg-red-500/20";
      default: return "text-blue-400 bg-blue-500/20";
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="game-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-white">Leaderboard</h3>
          </div>
          <div className="flex gap-2">
            {["all", "easy", "medium", "hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff as Difficulty | "all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === diff
                    ? "bg-primary text-white"
                    : "bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {scores.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 text-center font-mono text-lg font-bold">
                  {getMedalEmoji(index) || `#${index + 1}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white truncate">
                      {entry.player_name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(entry.difficulty)}`}>
                      {entry.difficulty}
                    </span>
                  </div>
                  <div className="text-sm text-white/60">
                    {formatDate(entry.date)}
                  </div>
                </div>
                <div className="font-mono font-bold text-xl text-primary">
                  {entry.score}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardSection;