import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ExplosionAnimationProps {
  onComplete: () => void;
}

const particleCount = 20;

const ExplosionAnimation = ({ onComplete }: ExplosionAnimationProps) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 150,
      y: (Math.random() - 0.5) * 150,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1.5,
      delay: Math.random() * 0.2
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      onComplete();
    }, 1000); // Reduced from 2000ms to 1000ms

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* Initial flash */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.2 }} // Reduced from 0.3s to 0.2s
          className="absolute inset-0 bg-white"
        />

        {/* Central explosion */}
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 20], opacity: [1, 0] }}
          transition={{ duration: 0.8, ease: "easeOut" }} // Reduced from 1.5s to 0.8s
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-500/30 rounded-full"
        />

        {/* Shockwave */}
        <motion.div
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: [1, 10], opacity: [0.7, 0] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-red-500/50"
        />

        {/* Main explosion emoji */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 4, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180]
          }}
          transition={{ 
            duration: 0.8,
            times: [0, 0.5, 1],
            ease: "easeOut"
          }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl"
        >
          💥
        </motion.div>

        {/* Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              scale: 0,
              x: "50vw",
              y: "50vh",
              rotate: 0,
              opacity: 1
            }}
            animate={{ 
              scale: [0, particle.scale, 0],
              x: [
                "50vw",
                `calc(50vw + ${particle.x}vw)`,
              ],
              y: [
                "50vh",
                `calc(50vh + ${particle.y}vh)`,
              ],
              rotate: [0, particle.rotation],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.8, // Reduced from 2s to 0.8s
              ease: "easeOut",
              delay: particle.delay
            }}
            className="fixed text-4xl"
          >
            💥
          </motion.div>
        ))}

        {/* Screen shake */}
        <motion.div
          animate={{
            x: [0, -5, 5, -3, 3, 0],
            y: [0, 3, -3, 5, -5, 0]
          }}
          transition={{
            duration: 0.3, // Reduced from 0.5s to 0.3s
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            ease: "easeInOut"
          }}
          className="absolute inset-0"
        />
      </div>
    </AnimatePresence>
  );
};

export default ExplosionAnimation;