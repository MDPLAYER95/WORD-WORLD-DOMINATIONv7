import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Loader2, Medal } from "lucide-react";
import { LeaderboardEntry, Difficulty } from "@/types/game";
import { getLeaderboard } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDifficulty: Difficulty;
  currentScore?: number;
}

const LeaderboardModal = ({ isOpen, onClose, currentDifficulty, currentScore }: LeaderboardModalProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">(currentDifficulty);
  const [playerRank, setPlayerRank] = useState<number | null>(null);

  const { data: scores = [], isLoading, error } = useQuery({
    queryKey: ['leaderboard', selectedDifficulty],
    queryFn: () => getLeaderboard(selectedDifficulty === "all" ? undefined : selectedDifficulty, 100),
    enabled: isOpen,
  });

  useEffect(() => {
    if (currentScore && scores.length > 0) {
      const rank = scores.findIndex(score => score.score <= currentScore) + 1;
      setPlayerRank(rank);
    }
  }, [scores, currentScore]);

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl game-card max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-white/80" />
              </button>
            </div>

            {/* Current Player Rank */}
            {playerRank && (
              <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-center gap-2">
                  <Medal className="w-6 h-6 text-yellow-500" />
                  <span className="text-xl font-bold text-white">
                    Your Rank: #{playerRank} of {scores.length}
                  </span>
                </div>
              </div>
            )}

            {/* Difficulty Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {["all", "easy", "medium", "hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff as Difficulty | "all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficulty === diff
                      ? "bg-primary text-white"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center p-12 text-red-400">
                Une erreur est survenue lors du chargement du classement.
              </div>
            )}

            {/* Scores List */}
            {scores && !isLoading && (
              <div className="overflow-y-auto flex-1 -mx-8 px-8">
                <div className="space-y-2">
                  {scores.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors ${
                        currentScore === entry.score ? "border-2 border-primary" : ""
                      }`}
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
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeaderboardModal;