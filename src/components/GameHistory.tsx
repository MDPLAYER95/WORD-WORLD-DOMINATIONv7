import { motion } from "framer-motion";

interface HistoryItem {
  word: string;
  explanation: string;
  emoji: string;
  isError?: boolean;
}

interface GameHistoryProps {
  history: HistoryItem[];
}

const GameHistory = ({ history }: GameHistoryProps) => {
  // Inverser l'historique pour afficher les éléments les plus récents en premier
  const reversedHistory = [...history].reverse();

  return (
    <motion.div 
      className="game-card mt-8 max-w-2xl mx-auto"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white/90">
        <span className="text-3xl">📜</span> Historique
      </h2>
      <div className="space-y-4">
        {reversedHistory.map((item, index) => (
          <motion.div 
            key={index} 
            className={`glass-morphism p-4 ${
              item.isError 
                ? "border-red-500/50 bg-red-500/5" 
                : "hover:bg-white/10"
            } transition-all duration-300`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-4">
              <motion.span 
                className="text-6xl animate-float"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20 
                }}
              >
                {item.emoji}
              </motion.span>
              <div className="flex-1">
                <h3 className={`font-bold text-xl ${
                  item.isError ? "text-red-400" : "text-white/90"
                }`}>
                  {item.word}
                </h3>
                <p className="text-sm text-white/60 mt-1">{item.explanation}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GameHistory;