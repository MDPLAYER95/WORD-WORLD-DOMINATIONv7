import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface GameNotificationProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
}

const GameNotification = ({ message, type, isVisible }: GameNotificationProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }}
          exit={{ 
            opacity: 0,
            y: -20,
            scale: 0.8,
            transition: { duration: 0.2 }
          }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className={`
            game-card p-4 flex items-center gap-3
            ${type === "success" 
              ? "border-green-500/30 bg-green-500/20" 
              : "border-red-500/30 bg-red-500/20"
            }
          `}>
            {type === "success" ? (
              <CheckCircle2 className="w-6 h-6 text-green-400 animate-pulse" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400 animate-pulse" />
            )}
            <p className="text-lg font-medium text-white">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameNotification;