import { motion } from "framer-motion";
import { Timer } from "lucide-react";

interface GameTimerProps {
  timeLeft: number;
  maxTime: number;
}

const GameTimer = ({ timeLeft, maxTime }: GameTimerProps) => {
  const progress = (timeLeft / maxTime) * 100;
  
  const getProgressColor = () => {
    if (progress > 66) return "bg-gradient-to-r from-green-500 to-emerald-600";
    if (progress > 33) return "bg-gradient-to-r from-yellow-500 to-orange-600";
    return "bg-gradient-to-r from-red-500 to-rose-600";
  };
  
  return (
    <div className="relative max-w-xs mx-auto">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Timer className="w-6 h-6 text-primary animate-pulse" />
        <span className="font-bold text-xl text-white/90">{timeLeft}s</span>
      </div>
      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${getProgressColor()}`}
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default GameTimer;