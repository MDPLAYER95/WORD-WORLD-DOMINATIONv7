import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GameNotification from "@/components/GameNotification";
import GameHistory from "@/components/GameHistory";
import GameOverAnimation from "@/components/GameOverAnimation";
import { translations, Language, TranslationKey } from "@/i18n/translations";
import GameForm from "@/components/GameForm";
import DifficultySelector from "@/components/DifficultySelector";
import { Difficulty, HistoryItem } from "@/types/game";
import { startingWords } from "@/lib/starting-words";
import AnimatedBackground from "@/components/AnimatedBackground";
import ExplosionAnimation from "@/components/ExplosionAnimation";
import { triggerSuccessConfetti } from "@/lib/confetti";

interface GameResponse {
  explication_pour_ou_contre: string;
  mot_precedent: string;
  mot_soumis_par_utilisateur: string;
  smiley_correspondant_au_mot: string;
  mot_deja_utiliser_precedement: boolean;
  succes: boolean;
}

const DIFFICULTY_SETTINGS = {
  easy: { time: 60 },
  medium: { time: 30 },
  hard: { time: 15 }
};

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("fr");
  const [currentWord, setCurrentWord] = useState(startingWords[currentLanguage].word);
  const [currentEmoji, setCurrentEmoji] = useState(startingWords[currentLanguage].emoji);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([{
    word: startingWords[currentLanguage].word,
    explanation: translations[currentLanguage].initialWord,
    emoji: startingWords[currentLanguage].emoji
  }]);
  const [inputWord, setInputWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    isVisible: false
  });
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [lastMove, setLastMove] = useState<HistoryItem | undefined>();
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !timerPaused) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            setIsTimeUp(true);
            showNotification(t("timeUp"), "error");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, timerPaused]);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const resetGame = () => {
    const startingWord = startingWords[currentLanguage];
    setDifficulty(null);
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setHistory([{
      word: startingWord.word,
      explanation: t("initialWord"),
      emoji: startingWord.emoji
    }]);
    setCurrentWord(startingWord.word);
    setCurrentEmoji(startingWord.emoji);
    setInputWord("");
    setTimeLeft(0);
    setTimerPaused(false);
    setLastMove(undefined);
    setIsTimeUp(false);
  };

  const startGame = (selectedDifficulty: Difficulty) => {
    setShowExplosion(true);
    const startingWord = startingWords[currentLanguage];
    setDifficulty(selectedDifficulty);
    setTimeLeft(DIFFICULTY_SETTINGS[selectedDifficulty].time);
    setGameOver(false);
    setScore(0);
    setHistory([{
      word: startingWord.word,
      explanation: t("initialWord"),
      emoji: startingWord.emoji
    }]);
    setCurrentWord(startingWord.word);
    setCurrentEmoji(startingWord.emoji);
  };

  const handleExplosionComplete = () => {
    setShowExplosion(false);
    setGameStarted(true);
  };

  const submitWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWord.trim()) return;
    
    setTimerPaused(true);
    setIsLoading(true);
    
    try {
      const response = await fetch("/.netlify/functions/check-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: inputWord,
          previousWords: history.map(item => item.word),
          currentWord,
          language: currentLanguage
        }),
      });
      
      const data: GameResponse = await response.json();
      
      if (response.ok && data.succes) {
        if (difficulty) {
          setTimeLeft(DIFFICULTY_SETTINGS[difficulty].time);
        }
        setScore(prev => prev + 1);
        const newMove = { 
          word: inputWord,
          explanation: data.explication_pour_ou_contre,
          emoji: data.smiley_correspondant_au_mot
        };
        setHistory(prev => [...prev, newMove]);
        setCurrentWord(inputWord);
        setCurrentEmoji(data.smiley_correspondant_au_mot);
        showNotification(data.explication_pour_ou_contre, "success");
        setTimerPaused(false);
        triggerSuccessConfetti();
      } else {
        const failedMove = { 
          word: inputWord,
          explanation: data.explication_pour_ou_contre,
          emoji: "💀",
          isError: true
        };
        setHistory(prev => [...prev, failedMove]);
        setLastMove(failedMove);
        showNotification(data.explication_pour_ou_contre, "error");
        setGameOver(true);
      }
    } catch (error) {
      showNotification(t("error"), "error");
    } finally {
      setIsLoading(false);
      setInputWord("");
    }
  };

  const t = (key: TranslationKey) => translations[currentLanguage][key];

  if (!difficulty) {
    return (
      <>
        <AnimatedBackground />
        <DifficultySelector 
          onSelectDifficulty={startGame}
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <AnimatedBackground />
      <GameNotification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
      />
      
      {showExplosion && (
        <ExplosionAnimation onComplete={handleExplosionComplete} />
      )}

      {gameOver && (
        <GameOverAnimation 
          score={score} 
          onRestart={resetGame}
          lastMove={lastMove}
          timeUp={isTimeUp}
          history={history}
          difficulty={difficulty}
          language={currentLanguage}
        />
      )}
      
      <GameForm
        currentWord={currentWord}
        currentEmoji={currentEmoji}
        inputWord={inputWord}
        setInputWord={setInputWord}
        isLoading={isLoading}
        onSubmit={submitWord}
        score={score}
        timeLeft={timeLeft}
        difficulty={difficulty}
        t={t}
        currentLanguage={currentLanguage}
        onSurrender={resetGame}
      />

      {history.length > 0 && <GameHistory history={history} />}
    </div>
  );
};

export default Index;