export const startingWords = {
  fr: {
    word: "Fourmi",
    emoji: "🐜"
  },
  en: {
    word: "Ant",
    emoji: "🐜"
  },
  de: {
    word: "Ameise",
    emoji: "🐜"
  },
  es: {
    word: "Hormiga",
    emoji: "🐜"
  },
  it: {
    word: "Formica",
    emoji: "🐜"
  }
} as const;

export type StartingWord = typeof startingWords[keyof typeof startingWords];