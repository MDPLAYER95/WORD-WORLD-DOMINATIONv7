import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { Language } from "@/i18n/translations";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const LanguageSelector = ({ currentLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "it", label: "Italiano", flag: "🇮🇹" }
  ];

  return (
    <motion.div 
      className="flex justify-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex gap-2 p-2 game-card">
        <Globe className="w-5 h-5 text-white" />
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200
                ${currentLanguage === lang.code 
                  ? 'bg-primary text-white' 
                  : 'text-white/80 hover:bg-white/10'
                }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm font-medium hidden md:inline">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LanguageSelector;