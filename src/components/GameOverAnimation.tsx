import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Skull, RotateCcw, Timer, XCircle, Share2, Trophy, History, X, Copy, Check, Medal } from "lucide-react";
import { HistoryItem, LeaderboardEntry } from "@/types/game";
import confetti from "canvas-confetti";
import { addToLeaderboard } from "@/lib/leaderboard";
import LeaderboardModal from "./LeaderboardModal";
import { toast } from "@/hooks/use-toast";

interface GameOverAnimationProps {
  score: number;
  onRestart: () => void;
  lastMove?: HistoryItem;
  timeUp?: boolean;
  history: HistoryItem[];
  difficulty: string;
  language: string;
}

const GameOverAnimation = ({ score, onRestart, lastMove, timeUp, history, difficulty, language }: GameOverAnimationProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (score > 5) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#9333EA', '#6366F1', '#8B5CF6']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#9333EA', '#6366F1', '#8B5CF6']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [score]);

  const shareScore = async () => {
    const text = `🎮 J'ai marqué ${score} points dans Word Domination! 😈\n🔥 Peux-tu faire mieux?\n🎯 Joue maintenant: ${window.location.href}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Word Domination Score',
          text: text,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Share failed:', error);
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (clipboardError) {
        console.error('Clipboard failed:', clipboardError);
        toast({
          title: "Error",
          description: "Failed to share score",
          variant: "destructive"
        });
      }
    }
  };

  const submitScore = async () => {
    if (!playerName.trim() || hasSubmitted || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const entry: Omit<LeaderboardEntry, 'id'> = {
        playerName: playerName.trim(),
        score,
        difficulty: difficulty as "easy" | "medium" | "hard",
        date: new Date().toISOString(),
        words: history.map(h => h.word),
        language
      };

      await addToLeaderboard(entry);
      setHasSubmitted(true);
      setShowLeaderboard(true);
      toast({
        title: "Success!",
        description: "Your score has been submitted to the leaderboard",
      });
    } catch (error) {
      console.error('Submit score error:', error);
      toast({
        title: "Error",
        description: "Failed to submit score to leaderboard",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="game-card max-w-lg w-full mx-4 text-center relative overflow-hidden"
      >
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 z-0" />
        
        {/* Content */}
        <div className="relative z-10 space-y-8">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="mb-6"
          >
            {timeUp ? (
              <Timer className="w-24 h-24 mx-auto text-red-500" />
            ) : (
              <Skull className="w-24 h-24 mx-auto text-red-500" />
            )}
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-4 neon-glow"
          >
            Game Over!
          </motion.h2>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Score Display */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl text-white/90">Score Final: <span className="text-primary font-bold text-3xl">{score}</span></p>
              <div className="text-6xl my-2">🏆</div>
            </div>

            {/* Submit Score Form */}
            {!hasSubmitted && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="game-input text-center"
                  maxLength={20}
                  disabled={isSubmitting}
                />
                <button
                  onClick={submitScore}
                  className="game-button w-full flex items-center justify-center gap-2"
                  disabled={!playerName.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Trophy className="w-5 h-5" />
                      </motion.div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Trophy className="w-5 h-5" />
                      Submit Score
                    </>
                  )}
                </button>
              </div>
            )}
            
            {/* Reason for Game Over */}
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
              {timeUp ? (
                <div className="flex items-center justify-center gap-2 text-red-400">
                  <Timer className="w-5 h-5" />
                  <span>Temps écoulé!</span>
                </div>
              ) : lastMove?.isError && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-red-400">
                    <XCircle className="w-5 h-5" />
                    <span>Mot invalide!</span>
                  </div>
                  <div className="text-sm text-white/60">
                    {lastMove.explanation}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareScore}
                className="game-button flex items-center gap-2 justify-center bg-purple-600 hover:bg-purple-700"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Score copié!
                  </>
                ) : (
                  <>
                    {navigator.share ? (
                      <Share2 className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                    {navigator.share ? 'Partager mon score' : 'Copier mon score'}
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLeaderboard(true)}
                className="game-button flex items-center gap-2 justify-center bg-yellow-600 hover:bg-yellow-700"
              >
                <Trophy className="w-5 h-5" />
                Voir le classement
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHistory(!showHistory)}
                className="game-button flex items-center gap-2 justify-center bg-blue-600 hover:bg-blue-700"
              >
                <History className="w-5 h-5" />
                {showHistory ? "Masquer l'historique" : "Voir l'historique"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRestart}
                className="game-button flex items-center gap-2 justify-center"
              >
                <RotateCcw className="w-5 h-5" />
                Rejouer
              </motion.button>
            </div>
          </motion.div>

          {/* History Modal */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-4 bg-black/90 backdrop-blur-md rounded-xl p-4 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Historique des mots</h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowHistory(false)}
                    className="p-1 rounded-lg hover:bg-white/10"
                  >
                    <X className="w-6 h-6 text-white/80" />
                  </motion.button>
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {[...history].reverse().map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        item.isError ? 'bg-red-500/20' : 'bg-white/5'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{item.word}</p>
                        <p className="text-xs text-white/60">{item.explanation}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        currentDifficulty={difficulty as "easy" | "medium" | "hard"}
        currentScore={score}
      />
    </motion.div>
  );
};

export default GameOverAnimation;