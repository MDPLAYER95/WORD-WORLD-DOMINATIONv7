import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const emojis = ["😈", "👿", "👹", "👺", "🦹", "🧟", "💀", "👻"];

const BattleAnimation = () => {
  const [attacker, setAttacker] = useState(emojis[0]);
  const [victim, setVictim] = useState(emojis[1]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newAttacker = emojis[Math.floor(Math.random() * emojis.length)];
      const newVictim = emojis[Math.floor(Math.random() * emojis.length)];
      setAttacker(newAttacker);
      setVictim(newVictim);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-48 flex items-center justify-center mb-8">
      {/* Attacker */}
      <motion.div
        initial={{ x: -100, opacity: 0, scale: 1 }}
        animate={{ 
          x: [null, 0, 100, -100],
          opacity: [null, 1, 1, 0],
          scale: [null, 1, 1.5, 1],
          rotate: [0, 0, 45, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute text-8xl md:text-9xl"
      >
        {attacker}
      </motion.div>
      
      {/* Victim */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: [null, 1, 0],
          scale: [null, 1, 0.2],
          rotate: [null, 0, 360],
          y: [null, 0, 50]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "anticipate"
        }}
        className="absolute text-8xl md:text-9xl"
      >
        {victim}
      </motion.div>

      {/* Explosion Effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [null, 0, 3, 0],
          opacity: [null, 0, 1, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1
        }}
        className="absolute text-8xl md:text-9xl text-yellow-500"
      >
        💥
      </motion.div>

      {/* Particle Effects */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: [0, (i % 2 === 0 ? 100 : -100) * Math.random()],
            y: [0, (i % 2 === 0 ? 100 : -100) * Math.random()]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1 + (i * 0.1),
            ease: "easeOut"
          }}
          className="absolute text-3xl"
        >
          {["💫", "✨", "💨"][i % 3]}
        </motion.div>
      ))}

      {/* Shockwave Effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 4],
          opacity: [0.5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1,
          ease: "easeOut"
        }}
        className="absolute w-8 h-8 rounded-full border-2 border-yellow-500/50"
      />
    </div>
  );
};

export default BattleAnimation;