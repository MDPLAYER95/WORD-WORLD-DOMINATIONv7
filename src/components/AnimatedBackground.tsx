import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const emojis = [
  "💥", "🔥", "⚡", "🌋", "🌪️", "☄️", "🎇", 
  "🧨", "💣", "⚔️", "☠️", "💀", "🕱", "🩸", 
  "⚰️", "🕳️", "🪦", "🌑", "🖤", "🔪", "😈", 
  "👹", "👺", "🩻", "⛈️", "⚡", "🛑", "📉", 
  "🕷️", "🕸️", "🦂", "🐍", "🩼", "☢️", "☣️", 
  "📛", "🔻", "🔺", "🔥", "🌪️", "💔"
];

const numberOfEmojis = 20;

const AnimatedBackground = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    emoji: string;
    scale: number;
    rotation: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: numberOfEmojis }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      scale: 0.5 + Math.random() * 1.5,
      rotation: Math.random() * 360
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-2xl opacity-20"
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            scale: particle.scale,
            rotate: particle.rotation
          }}
          animate={{
            x: [
              `${particle.x}vw`,
              `${(particle.x + 20) % 100}vw`,
              `${(particle.x - 20 + 100) % 100}vw`
            ],
            y: [
              `${particle.y}vh`,
              `${(particle.y + 20) % 100}vh`,
              `${(particle.y - 20 + 100) % 100}vh`
            ],
            rotate: [particle.rotation, particle.rotation + 180, particle.rotation + 360]
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.5, 1]
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-transparent via-background/50 to-background"
        style={{
          background: `
            radial-gradient(circle at center, 
              transparent 0%, 
              hsl(224, 71.4%, 4.1%, 0.5) 50%, 
              hsl(224, 71.4%, 4.1%) 100%
            )
          `
        }}
      />
    </div>
  );
};

export default AnimatedBackground;