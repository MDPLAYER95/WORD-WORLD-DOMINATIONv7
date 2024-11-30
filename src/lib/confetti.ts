import confetti from 'canvas-confetti';

export const triggerSuccessConfetti = () => {
  // Fire confetti from both sides
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    shapes: ['square'],
    ticks: 200
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      colors: ['#9333EA', '#6366F1', '#8B5CF6'] // Purple theme colors
    });
  }

  // Left side
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    origin: { x: 0.2, y: 0.7 }
  });

  // Right side
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    origin: { x: 0.8, y: 0.7 }
  });

  // Middle
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    origin: { x: 0.5, y: 0.7 }
  });
};