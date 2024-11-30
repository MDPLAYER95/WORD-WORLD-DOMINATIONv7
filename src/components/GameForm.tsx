import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Flag } from "lucide-react";
import GameTimer from "./GameTimer";
import { Language, TranslationKey } from "@/i18n/translations";
import { Difficulty } from "@/types/game";

interface GameFormProps {
  currentWord: string;
  currentEmoji: string;
  inputWord: string;
  setInputWord: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  score: number;
  timeLeft: number;
  difficulty: Difficulty;
  t: (key: TranslationKey) => string;
  currentLanguage: Language;
  onSurrender: () => void;
}

const GameForm = ({
  currentWord,
  currentEmoji,
  inputWord,
  setInputWord,
  isLoading,
  onSubmit,
  score,
  timeLeft,
  difficulty,
  t,
  currentLanguage,
  onSurrender
}: GameFormProps) => {
  const [validationMessage, setValidationMessage] = React.useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (/\d/.test(value)) {
      setValidationMessage("Les chiffres ne sont pas autorisés");
      setTimeout(() => setValidationMessage(""), 2000);
      return;
    }
    
    const wordCount = value.trim().split(/\s+/).length;
    if (wordCount > 3) {
      setValidationMessage("Maximum 3 mots autorisés");
      setTimeout(() => setValidationMessage(""), 2000);
      return;
    }
    
    setInputWord(value);
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="text-center space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <motion.button
            onClick={onSurrender}
            className="game-button bg-red-500 hover:bg-red-600 flex items-center gap-2 text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Flag className="w-4 h-4 sm:w-5 sm:h-5" />
            {t("surrender")}
          </motion.button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold neon-glow bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            {t("title")}
          </h1>
          <div className="w-[120px] hidden sm:block" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-white/90">
          {t("score")}: <span className="text-primary">{score}</span>
        </div>
        
        <GameTimer 
          timeLeft={timeLeft} 
          maxTime={difficulty === 'easy' ? 60 : difficulty === 'medium' ? 30 : 15}
        />
      </div>

      <motion.div 
        className="game-card"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <p className="text-xs sm:text-sm text-white/60 mb-2">{t("currentWord")}:</p>
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            className="flex flex-col items-center gap-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              bounce: 0.5,
              duration: 0.5
            }}
          >
            <motion.span 
              className="text-6xl sm:text-7xl md:text-8xl animate-float"
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {currentEmoji}
            </motion.span>
            <span className="text-xl sm:text-2xl md:text-3xl text-white/90 font-medium">
              {currentWord}
            </span>
          </motion.div>
        </div>
      </motion.div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.input
              type="text"
              value={inputWord}
              onChange={handleInputChange}
              placeholder={t("inputPlaceholder")}
              className="game-input flex-1 text-base sm:text-lg"
              disabled={isLoading}
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button
              type="submit"
              disabled={isLoading}
              className="game-button text-base sm:text-lg whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2 inline" />
                  {t("loading")}
                </>
              ) : (
                t("submit")
              )}
            </motion.button>
          </div>
          <AnimatePresence>
            {validationMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-red-400 text-center"
              >
                {validationMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.div>
  );
};

export default GameForm;